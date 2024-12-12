const Location = require("../models/Location");

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    if (locations.length === 0) {
      return res.status(404).json({ message: "No location found" });
    }
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getLocationsByState = async (req, res) => {
  const { state } = req.params;
  try {
    const locations = await Location.find({ "address.state": state });
    if (locations.length === 0) {
      return res
        .status(404)
        .json({ message: `No locations found for state: ${state}` });
    }
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
