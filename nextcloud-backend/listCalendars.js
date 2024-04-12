const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const findCalendarURI = async () => {
    const url = `${process.env.NEXTCLOUD_URL}/remote.php/dav/calendars/${process.env.NEXTCLOUD_USERNAME}/`;

    const propfindXML = `<?xml version="1.0"?>
        <d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/">
            <d:prop>
                <d:displayname />
                <d:resourcetype />
            </d:prop>
        </d:propfind>`;

    try {
        const response = await axios({
            method: 'propfind',
            url: url,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`).toString('base64')}`,
                'Content-Type': 'application/xml',
                'Depth': '1'
            },
            data: propfindXML
        });

        parseCalendarData(response.data);
    } catch (error) {
        console.error('Error fetching calendar data:', error.response ? error.response.data : error.message);
    }
};

const parseCalendarData = (xmlData) => {
    const parser = new xml2js.Parser({ explicitArray: false });

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const responses = result['d:multistatus']['d:response'];
        responses.forEach(response => {
            const props = response['d:propstat']['d:prop'];
            console.error(props);
            // const displayName = props['d:displayname'];
            // const resourceType = props['d:resourcetype'];
            // if (resourceType && resourceType['cal:calendar']) {
               //  console.log('Calendar Name:', displayName, 'URL:', response['d:href']);
            // }
        });
    });
};

findCalendarURI();
