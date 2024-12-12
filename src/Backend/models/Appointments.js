const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  appointment_date: { type: Date, required: true },
  location_id: { type: String, ref: "Location", required: true },
  location_details: {
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
  },
  service_id: { type: String, ref: "Service", required: true },
  service_details: {
    name: { type: String, required: true },
    price: { type: String, required: true },
  },
  stylist_name: { type: String },
  status: {
    type: String,
    enum: ["confirmed", "canceled", "completed"],
    default: "confirmed",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointments", appointmentSchema);
