const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { Client } = require('azure-iot-device');
const { Mqtt } = require('azure-iot-device-mqtt');
const { Message } = require('azure-iot-device');

// Your device connection string from Azure IoT Hub
const connectionString = 'HostName=iothub1fa.azure-devices.net;DeviceId=iotdevice-webapp1f;SharedAccessKey=QmBxKjKfc6qmgWK+DlOIQ+vPeW2j9B/4LifUx82MbJk=';

// Create the IoT Hub client
const client = Client.fromConnectionString(connectionString, Mqtt);

let simulatedTemperature = 25;

app.get('/', (req, res) => {
    res.send(`
        <h1>IoT Device Simulator</h1>
        <p>Temperature: ${simulatedTemperature}°C</p>
        <button onclick="fetch('/increase')">Increase</button>
        <button onclick="fetch('/send')">Send Telemetry</button>
        <script>
            function fetchData() {
                fetch('/').then(res => res.text()).then(html => document.body.innerHTML = html);
            }
            setInterval(fetchData, 2000);
        </script>
    `);
});

app.get('/increase', (req, res) => {
    simulatedTemperature += 1;
    res.redirect('/');
});

app.get('/send', (req, res) => {
    const data = JSON.stringify({ temperature: simulatedTemperature });
    const message = new Message(data);
    console.log(`Sending message: ${message.getData()}`);

    client.sendEvent(message, (err) => {
        if (err) {
            console.error('Send error: ' + err.toString());
        } else {
            console.log('Message sent successfully');
        }
    });

    res.redirect('/');
});

client.open((err) => {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('IoT Hub connection opened.');
    }
});

app.listen(port, () => console.log(`Listening on ${port}`));