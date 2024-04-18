// fetchCalendarEvents.js
const axios = require('axios');
require('dotenv').config();

const fetchCalendarEvents = async () => {
    const calendarUrl = `${process.env.NEXTCLOUD_URL}yourCalendarName/`;  // Specify the specific calendar name if needed

    try {
        const response = await axios({
            method: 'get',
            url: calendarUrl,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`).toString('base64')}`,
                'Content-Type': 'text/calendar',
                'Prefer': 'return-minimal'
            },
            responseType: 'text'
        });

        console.log('Calendar Data:', response.data);
        return response.data;  // Contains the iCalendar data
    } catch (error) {
        console.error('Error fetching calendar data:', error.message);
        return null;
    }
};

fetchCalendarEvents();
