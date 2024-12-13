const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mqtt = require('mqtt');
const serviceAccount = require('./assets/firebase.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://finalproj-salinity-iot-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const db = admin.database();
const app = express();
app.use(bodyParser.json());

// MQTT Client Setup
const mqttClient = mqtt.connect('wss://a861c4d8328545aa8e034dd66473b64a.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'KingCrimson',
  password: 'Mikasa4321',
});

const mqttTopic = 'pond/salinity';

// Handle MQTT connection
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(mqttTopic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${mqttTopic}:`, err);
    } else {
      console.log(`Subscribed to topic ${mqttTopic}`);
    }
  });
});

// Handle MQTT errors
mqttClient.on('error', (err) => {
  console.error('MQTT Connection Error:', err);
});

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
  if (topic === mqttTopic) {
    try {
      const salinityData = JSON.parse(message.toString());
      console.log('Received MQTT message:', salinityData);

      // Save to Firebase under "sensorData"
      db.ref('sensorData')
        .push(salinityData)
        .then(() => {
          console.log('Data saved to Firebase under sensorData:', salinityData);
        })
        .catch((error) => {
          console.error('Error saving data to Firebase:', error);
        });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }
});

// Endpoint for testing (Optional)
app.post('/data', (req, res) => {
  const data = req.body;
  db.ref('sensorData')
    .push(data)
    .then(() => res.status(200).send('Data saved successfully'))
    .catch((error) => res.status(500).send(error));
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
