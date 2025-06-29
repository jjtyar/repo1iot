const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let simulatedData = { temperature: 25 };

app.get('/', (req, res) => {
    res.send(`
        <h1>IoT Device Simulator</h1>
        <p>Temperature: ${simulatedData.temperature}°C</p>
        <button onclick="fetch('/increase')">Increase</button>
        <script>
            function fetchData() {
                fetch('/').then(res => res.text()).then(html => document.body.innerHTML = html);
            }
            setInterval(fetchData, 2000);
        </script>
    `);
});

app.get('/increase', (req, res) => {
    simulatedData.temperature += 1;
    res.redirect('/');
});

app.listen(port, () => console.log(`Listening on ${port}`));
