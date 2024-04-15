const axios = require('axios');
require('dotenv').config();

const getCalendarEvents = async () => {
    const url = `${process.env.NEXTCLOUD_URL}/remote.php/dav/calendars/admin/Familie%2b%2528Google%2bCalendar%2bimport%2529/?export&accept=jcal`;

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
