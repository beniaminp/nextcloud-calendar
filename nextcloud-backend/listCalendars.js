const axios = require('axios');
const xml2js = require('xml2js');

const findCalendarURI = async (serverUrl, username, password) => {
    const url = `${serverUrl}/remote.php/dav/calendars/${username}/`;

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
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
                'Content-Type': 'application/xml',
                'Depth': '1'
            },
            data: propfindXML
        });

        return parseCalendarData(response.data, serverUrl, username, password);
    } catch (error) {
        console.error('Error fetching calendar data:', error.response ? error.response.data : error.message);
    }
};

const parseCalendarData = (xmlData, serverUrl, username, password) => {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({explicitArray: false});

        parser.parseString(xmlData, async (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            const responses = result['d:multistatus']['d:response'];
            let calendars = [];
            for (const response of responses) {
                const href = response['d:href'];
                const parts = href.split('/');
                const calendarName = parts[parts.length - 2];

                const calendarData = await getCalendarEvents(href, serverUrl, username, password);
                if (calendarData) {
                    calendarData['calendarName'] = calendarName;
                    calendarData['href'] = href;
                    calendars.push(calendarData);
                }
            }
            resolve(calendars);
        });
    });
};

const getCalendarEvents = async (href, serverUrl, username, password) => {
    const url = `${serverUrl}/${href}?export&accept=jcal`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
                'Content-Type': 'application/json'  // Assuming the 'accept=jcal' leads to a JSON content type response
            }
        });
        return mapToJSObject(response.data);
    } catch (error) {
        console.error('Error fetching calendar data:', error.response ? error.response.data : error.message);
    }
};

function mapToJSObject(data) {
    let obj = {};
    obj[data[0]] = {};

    // Map the second element of the outer array
    data[1].forEach(item => {
        obj[data[0]][item[0]] = item[3];
    });

    // Initialize an array for the events
    obj[data[0]]['events'] = [];

    // Map the third element of the outer array
    data[2].forEach(item => {
        // Instead of creating a new key for each event, push it into the array
        // Add the calendar name to each event
        let event = item[1];
        event['calendarName'] = data[0];
        obj[data[0]]['events'].push(convertEventArrayToObject(event));
    });

    return obj;
}

function convertEventArrayToObject(eventArray) {
    return eventArray.reduce((obj, item) => {
        obj[item[0]] = item[3];
        return obj;
    }, {});
}

module.exports = findCalendarURI;
