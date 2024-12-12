const { google } = require("googleapis");
const Stylist = require("../models/Stylist");
const { createGoogleCalendar } = require("../services/googleCalendarService");

async function assignCalendarToStylist(req, res) {
  const { stylistId } = req.params;

  try {
    const stylist = await Stylist.findOne({ stylistId });
    if (!stylist) {
      return res.status(404).json({ message: "Stylist not found" });
    }

    if (stylist.calendarId) {
      return res.status(200).json({
        message: "Calendar already assigned",
        calendarId: stylist.calendarId,
      });
    }

    const calendarId = await createGoogleCalendar(stylist.name);
    stylist.calendarId = calendarId;
    await stylist.save();

    res
      .status(200)
      .json({ message: "Calendar assigned successfully", calendarId });
  } catch (error) {
    console.error("Error assigning calendar:", error.message);
    res
      .status(500)
      .json({ message: "Error assigning calendar", error: error.message });
  }
}

async function getStylistDetails(req, res) {
  const { stylistId } = req.params;

  try {
    const stylist = await Stylist.findOne({ stylistId });
    if (!stylist) {
      return res.status(404).json({ message: "Stylist not found" });
    }

    res.status(200).json(stylist);
  } catch (error) {
    console.error("Error fetching stylist details:", error.message);
    res.status(500).json({
      message: "Error fetching stylist details",
      error: error.message,
    });
  }
}

// Fetch stylists by location
async function getStylistsByLocation(req, res) {
  const { locationId } = req.params;

  try {
    // Find stylists by location
    const stylists = await Stylist.find({ locations: locationId }).populate({
      path: "expertise", // Populate the expertise field
      model: "Service",
    });

    if (!stylists || stylists.length === 0) {
      return res
        .status(404)
        .json({ message: "No stylists found for this location" });
    }

    res.status(200).json(stylists);
  } catch (error) {
    console.error("Error fetching stylists by location:", error.message);
    res.status(500).json({
      message: "Error fetching stylists by location",
      error: error.message,
    });
  }
}

module.exports = {
  assignCalendarToStylist,
  getStylistDetails,
  getStylistsByLocation,
};
