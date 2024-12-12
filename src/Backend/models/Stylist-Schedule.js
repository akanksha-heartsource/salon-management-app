const mongoose = require("mongoose");

const stylistScheduleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    required: true,
  },
  stylistId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  closed: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Schedule", stylistScheduleSchema, "schedules");
