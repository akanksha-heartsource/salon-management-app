const mongoose = require("mongoose");

const stylistSchema = new mongoose.Schema({
  stylistId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  expertise: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  locations: [{ type: String }],
  calendarId: { type: String, default: null },
  schedule: [
    {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Stylist", stylistSchema);
