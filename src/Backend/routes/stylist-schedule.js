const express = require("express");
const router = express.Router();
const Schedule = require("../models/Stylist-Schedule");

router.get("/:stylistId", async (req, res) => {
  try {
    const stylistId = req.params.stylistId;

    // Query the schedules collection for the stylistId
    const stylistSchedules = await Schedule.find({ stylistId });

    if (!stylistSchedules || stylistSchedules.length === 0) {
      return res.status(404).json({ message: "Stylist schedule not found" });
    }

    res.json(stylistSchedules);
  } catch (error) {
    console.error("Error fetching stylist schedule:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
