const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointments");

// Get booked time slots for a stylist on a specific date
router.get("/booked-slots/:stylistName/:date", async (req, res) => {
  const { stylistName, date } = req.params;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      stylist_name: stylistName,
      appointment_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "confirmed",
    });

    const bookedSlots = appointments.map((appt) =>
      appt.appointment_date.toISOString()
    );

    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error("Error fetching booked slots:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
