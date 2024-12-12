const express = require("express");
const router = express.Router();
const {
  getAllLocations,
  getLocationsByState,
} = require("../controllers/locationController");

//Route to fetch all Locations
router.get("/", getAllLocations);

// Route to fetch locations by state
router.get("/:state", getLocationsByState);

module.exports = router;
