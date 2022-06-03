import { promises } from 'fs';
import { calendar_v3, google } from 'googleapis';
import { SCOPES } from '~constants';

import type { JWT } from "google-auth-library";

export const getJWT = async (): Promise<JWT> => {
  // Load client secrets from a local file.
  try {
    const content = JSON.parse(
      await promises.readFile(__dirname + "/../config/credentials.json", "utf8")
    ) as Credentials;

    const jwt = new google.auth.JWT({
      email: content["client_email"],
      key: content["private_key"],
      scopes: SCOPES
    });

    jwt.fromJSON(content);
    return jwt;
  } catch (error) {
    throw error;
  }
};

export const listCalendarList = async (auth: JWT) => {
  const calendar = google.calendar({ version: "v3", auth });
  const list = await calendar.calendarList.list();
  console.log("list: ", list);
  return list;
};

export const getPrimaryCalendar = async (auth: JWT) => {
  const calendar = google.calendar({ version: "v3", auth });
  const primaryCalendar = await calendar.calendars.get({
    calendarId: "primary"
  });
  console.log("primaryCalendar: ", primaryCalendar);
  return primaryCalendar;
};

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.JWT} auth An authorized JWT.
 */
export const listEvents = async (
  auth: JWT
): Promise<calendar_v3.Schema$Event[]> => {
  const calendar = google.calendar({ version: "v3", auth });
  const eventList = (
    await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    })
  ).data.items;

  if (!!eventList && eventList.length) {
    console.log("Upcoming 10 events:");
    eventList.map((event) => {
      const start = !!event.start && (event.start.dateTime || event.start.date);
      console.log(`${start} - ${event.summary}`);
    });
    return eventList;
  } else {
    console.log("No upcoming events found.");
    return [];
  }
};

/**
 * Create new calendar events
 * @param {google.auth.JWT} auth An authorized JWT.
 */
export const createEvent = async (auth: JWT) => {
  const calendar = google.calendar({ version: "v3", auth });
  const dateVal = new Date().getTime();

  const ret = await calendar.events.insert({
    auth,
    calendarId: "primary",
    requestBody: {
      summary: "Testing Event",
      location: "Seoul, Korea",
      description: "This is a testing Event",
      start: {
        dateTime: new Date(dateVal + 3600000).toISOString(),
        timeZone: "Asia/Seoul"
      },
      end: {
        dateTime: new Date(dateVal + 7200000).toISOString(),
        timeZone: "Asia/Seoul"
      }
    }
  });
  return ret;
};

// export const deleteEvent = async (auth: JWT) => {
//   const calendar = google.calendar({ version: "v3", auth });

// }
