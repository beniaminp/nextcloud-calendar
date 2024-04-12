const axios = require('axios');
require('dotenv').config();

const getCalendarEvents = async () => {
    const url = `${process.env.NEXTCLOUD_URL}/remote.php/dav/calendars/${process.env.NEXTCLOUD_USERNAME}/beniaminpantiru%40gmail.com+%28Google+Calendar+import%29?export&accept=jcal`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`).toString('base64')}`,
                'Content-Type': 'application/json'  // Assuming the 'accept=jcal' leads to a JSON content type response
            }
        });

        console.log('Calendar Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar data:', error.response ? error.response.data : error.message);
    }
};

getCalendarEvents();
