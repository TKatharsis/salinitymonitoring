#include <FS.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <LittleFS.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <time.h>

WiFiClientSecure espClient;
PubSubClient client(espClient);

const char* ssid;
const char* password;
const char* mqtt_server;
int mqtt_port;
const char* mqtt_user;
const char* mqtt_pass;

const int tdsPin = A0;  
float voltage, tdsValue, salinity;

const char* ntpServer = "time.google.com";
const long gmtOffset_sec = 8 * 3600;
const int daylightOffset_sec = 0; 

float readSalinity() {
    int tdsAnalog = analogRead(tdsPin);
    voltage = tdsAnalog * (3.3 / 1024.0);
    tdsValue = (133.42 * voltage * voltage * voltage - 
                255.86 * voltage * voltage + 
                857.39 * voltage);
    salinity = tdsValue / 1000.0;

    
    salinity = floor(salinity * 10000.0 + 0.5) / 10000.0;

    return salinity;
}


String getTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return "N/A";
    }
    char timeString[20];
    strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%S", &timeinfo);
    return String(timeString);
}

void readCredentials() {
    File configFile = LittleFS.open("/config.txt", "r");
    if (!configFile) {
        Serial.println("Failed to open credentials file");
        return;
    }

    String line;
    while (configFile.available()) {
        line = configFile.readStringUntil('\n');
        line.trim();

        if (line.startsWith("SSID=")) {
            ssid = strdup(line.substring(5).c_str());
        }
        else if (line.startsWith("PASSWORD=")) {
            password = strdup(line.substring(9).c_str());
        }
        else if (line.startsWith("MQTT_USER=")) {
            mqtt_user = strdup(line.substring(10).c_str());
        }
        else if (line.startsWith("MQTT_PASS=")) {
            mqtt_pass = strdup(line.substring(10).c_str());
        }
        else if (line.startsWith("MQTT_SERVER=")) {
            mqtt_server = strdup(line.substring(12).c_str());
        }
        else if (line.startsWith("MQTT_PORT=")) {
            mqtt_port = line.substring(10).toInt();
        }
    }
    configFile.close();
}

void setupWiFi() {
    WiFi.begin(ssid, password);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 60) {
        delay(1000);
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.print("Connected to Wi-Fi. IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("Failed to connect to Wi-Fi.");
    }
}

void reconnect() {
    while (!client.connected()) {
        if (client.connect("ESP8266Client", mqtt_user, mqtt_pass)) {
        } else {
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);

    if (!LittleFS.begin()) {
        Serial.println("LittleFS Mount Failed");
        return;
    }

    readCredentials();

    setupWiFi();

    if (WiFi.status() == WL_CONNECTED) {
        client.setServer(mqtt_server, mqtt_port);
        espClient.setInsecure();
        configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    }

    Serial.println("Starting TDS Sensor Salinity Monitoring...");
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    float salinity = readSalinity();
    String timestamp = getTime();

    DynamicJsonDocument doc(1024);
    doc["timestamp"] = timestamp;
    doc["salinity (ppt)"] = salinity;

    char payload[128];
    serializeJson(doc, payload);

    if (client.publish("pond/salinity", payload)) {
        Serial.println("Salinity data published to MQTT with timestamp");
    } else {
        Serial.println("Failed to publish salinity data");
    }

    delay(5000);
}
