import mqtt from "mqtt";

let client = null;

const connectAndSubscribe = (onMessageCallback, onErrorCallback) => {
  const host = "wss://a861c4d8328545aa8e034dd66473b64a.s1.eu.hivemq.cloud:8884/mqtt";
  const username = "KingCrimson";
  const password = "Mikasa4321";

  console.log("Attempting to connect to MQTT broker...");

  client = mqtt.connect(host, {
    username,
    password,
    reconnectPeriod: 3000,
    keepalive: 60,
    clean: true,
  });

  client.on("connect", () => {
    console.log("Connected to MQTT broker.");
    
    client.subscribe("pond/salinity", (err) => {
      if (err) {
        console.error("Error subscribing to topic:", err);
        if (onErrorCallback) {
          onErrorCallback(err);
        }
      } else {
        console.log("Successfully subscribed to 'pond/salinity' topic.");
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log(`Received message on topic: ${topic}`);

    const payload = message.toString();
    let salinityData;

    try {
      salinityData = JSON.parse(payload);
    } catch (error) {
      console.error("Error parsing message payload:", error);
      return;
    }

    const salinity = salinityData["salinity (ppt)"];
    if (salinity !== undefined) {
      console.log(`Salinity data received: ${salinity} ppt`);
      if (onMessageCallback) {
        onMessageCallback({ topic, salinity });
      }
    } else {
      console.warn("Salinity data is undefined in the received message.");
    }
  });

  client.on("close", () => {
    console.log("MQTT connection closed.");
  });

  client.on("error", (error) => {
    console.error("Error with MQTT client:", error);
    if (onErrorCallback) {
      onErrorCallback(error);
    }
  });
};

const publish = (topic, payload) => {
  if (client && client.connected) {
    console.log(`Publishing message to topic ${topic}:`, payload);
    client.publish(topic, payload, (err) => {
      if (err) {
        console.error("Error publishing message:", err);
      }
    });
  } else {
    console.warn("MQTT client is not connected, cannot publish message.");
  }
};

export default { connectAndSubscribe, publish };
