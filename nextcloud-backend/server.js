const express = require('express');
const cors = require('cors');
const listCalendars = require('./listCalendars.js');

const app = express();
app.use(cors());

app.get('/calendars', async (req, res) => {
    try {
        const calendars = await listCalendars();
        console.error(calendars);
        res.json(calendars);
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));