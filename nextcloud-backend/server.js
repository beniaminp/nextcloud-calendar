const express = require('express');
const cors = require('cors');
const listCalendars = require('./listCalendars.js');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/calendars', async (req, res) => {
    try {
        console.error(req.body);
        const serverUrl = req.body.serverUrl;
        const username = req.body.username;
        const password = req.body.password;

        const calendars = await listCalendars(serverUrl, username, password);
        res.json(calendars);
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));