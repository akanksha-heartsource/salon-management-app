const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function createGoogleCalendar(stylistName) {
  try {
    const response = await calendar.calendars.insert({
      requestBody: {
        summary: `Stylist - ${stylistName}`,
        timeZone: "America/New_York",
      },
    });
    return response.data.id; // Return the calendar ID
  } catch (error) {
    console.error("Error creating Google Calendar:", error.message);
    throw error;
  }
}

/**
 * Fetch busy time slots for a stylist's Google Calendar
 * @param {string} calendarId - The Google Calendar ID of the stylist
 * @param {Date} startOfDay - The start of the day
 * @param {Date} endOfDay - The end of the day
 * @returns {Array} - Array of busy time ranges
 */
async function getStylistAvailability(calendarId, startOfDay, endOfDay) {
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busyTimes = response.data.calendars[calendarId]?.busy || [];
    return busyTimes;
  } catch (error) {
    console.error(
      "Error fetching availability from Google Calendar:",
      error.message
    );
    throw error;
  }
}

async function createAppointment(calendarId, eventDetails) {
  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: eventDetails,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    throw error;
  }
}

module.exports = {
  createGoogleCalendar,
  getStylistAvailability,
  createAppointment,
};
