const express = require("express");
const router = express.Router();
const Stylist = require("../models/Stylist");

router.get("/location/:locationId", async (req, res) => {
  try {
    const stylists = await Stylist.find({
      locations: req.params.locationId,
    }).populate({
      path: "expertise",
      model: "Service",
      match: {},
    });
    res.status(200).json(stylists);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch stylists by location",
      error: err.message,
    });
  }
});

module.exports = router;
