const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  date: { type: String, require: true },
  slots: [
    {
      time: { type: String, required: true },
      status: { type: String, default: "available" }, // 'available', 'reserved', 'booked'
    },
  ],
});

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
