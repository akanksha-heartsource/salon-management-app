const Stylist = require("../models/Stylist");
const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");
const { getStylistAvailability } = require("../services/googleCalendarService");

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function getStylistAvailabilityHandler(req, res) {
  const { stylistId } = req.params;
  const { date } = req.query;
  console.log(date);
  try {
    // Fetch stylist details
    const stylist = await Stylist.findOne({ stylistId });
    if (!stylist || !stylist.calendarId) {
      return res.status(404).json({ message: "Stylist or calendar not found" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const busyTimes = await getStylistAvailability(
      stylist.calendarId,
      startOfDay,
      endOfDay
    );

    // Generate available slots (30-minute intervals)
    const availableSlots = generateAvailableSlots(
      startOfDay,
      endOfDay,
      busyTimes
    );

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching availability:", error.message);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
}

function generateAvailableSlots(startOfDay, endOfDay, busyTimes) {
  const slotDuration = 30 * 60 * 1000;
  const slots = [];
  let currentSlot = new Date(startOfDay);

  while (currentSlot < endOfDay) {
    const slotEnd = new Date(currentSlot.getTime() + slotDuration);

    const isBusy = busyTimes.some(
      (busy) =>
        (currentSlot >= new Date(busy.start) &&
          currentSlot < new Date(busy.end)) ||
        (slotEnd > new Date(busy.start) && slotEnd <= new Date(busy.end))
    );

    if (!isBusy) {
      slots.push({
        start: currentSlot.toISOString(),
        end: slotEnd.toISOString(),
      });
    }

    currentSlot = slotEnd;
  }

  return slots;
}

async function addAppointment(req, res) {
  const { stylistId } = req.params;
  const { startTime, endTime, customerName, service } = req.body;

  try {
    const stylist = await Stylist.findOne({ stylistId });
    if (!stylist || !stylist.calendarId) {
      return res.status(404).json({ message: "Stylist or calendar not found" });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: `Appointment with ${customerName}`,
      description: `Service: ${service}`,
      start: { dateTime: startTime, timeZone: "America/New_York" },
      end: { dateTime: endTime, timeZone: "America/New_York" },
    };

    const response = await calendar.events.insert({
      calendarId: stylist.calendarId,
      requestBody: event,
    });

    res.status(201).json({
      message: "Appointment booked",
      eventLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Error adding appointment:", error.message);
    res
      .status(500)
      .json({ message: "Error adding appointment", error: error.message });
  }
}

module.exports = {
  getStylistAvailabilityHandler,
  generateAvailableSlots,
  addAppointment,
};
