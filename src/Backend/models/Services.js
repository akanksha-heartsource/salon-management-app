const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: Number, required: true },
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  services: [serviceSchema],
});

module.exports = mongoose.model("Service", categorySchema);
