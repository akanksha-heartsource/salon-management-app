const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: String,
  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
  },
});

const timeSlotSchema = new mongoose.Schema({
  date: String,
  slots: [slotSchema],
});

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
