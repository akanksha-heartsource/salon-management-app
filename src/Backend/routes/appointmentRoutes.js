const express = require("express");
const {
  addAppointment,
  getStylistAvailabilityHandler,
} = require("../controllers/appointmentController");

const router = express.Router();

// Fetch stylist availability
router.get("/:stylistId/availability", getStylistAvailabilityHandler);

// Book an appointment
router.post("/:stylistId/book", addAppointment);

module.exports = router;
