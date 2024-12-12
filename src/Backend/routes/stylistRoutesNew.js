const express = require("express");
const {
  assignCalendarToStylist,
  getStylistDetails,
  getStylistsByLocation,
} = require("../controllers/stylistController");

const router = express.Router();

// Assign a Google Calendar to a stylist
router.post("/assign-calendar/:stylistId", assignCalendarToStylist);

// Get stylist details
router.get("/:stylistId", getStylistDetails);

// Get stylists by locationId
router.get("/location/:locationId", getStylistsByLocation);

module.exports = router;
