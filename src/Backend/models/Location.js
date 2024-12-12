const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  _id: String,
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  services: [String],
});

module.exports = mongoose.model("Location", locationSchema);
