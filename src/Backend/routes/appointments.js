const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointments");
const nodemailer = require("nodemailer");

//NodeMailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "", //email
    pass: "", //pass
  },
});

//create a new appointment
router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    email,
    appointment_date,
    location_id,
    service_id,
    location_details,
    service_details,
    stylist_name,
  } = req.body;

  try {
    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !email ||
      !appointment_date ||
      !location_id ||
      !service_id ||
      !location_details ||
      !location_details.name ||
      !location_details.address ||
      !location_details.address.street ||
      !location_details.address.city ||
      !location_details.address.state ||
      !location_details.address.zip ||
      !service_details ||
      !service_details.name ||
      !service_details.price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const appointmentDate = new Date(appointment_date);

    // Check for overlapping appointments within the same time slot

    const startRange = new Date(appointment_date);
    startRange.setMinutes(startRange.getMinutes() - 30);

    const endRange = new Date(appointment_date);
    endRange.setMinutes(endRange.getMinutes() + 30);

    const existingAppointment = await Appointment.findOne({
      location_id,
      service_id,
      stylist_name,
      appointment_date: {
        $gte: startRange,
        $lte: endRange,
      },
      status: "confirmed",
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "Time slot already booked" });
    }

    //New Appointment
    const newAppointmnet = new Appointment({
      first_name,
      last_name,
      phone_number,
      email,
      appointment_date: new Date(appointment_date),
      location_id,
      location_details,
      service_id,
      service_details,
      stylist_name,
    });

    const savedAppointment = await newAppointmnet.save();

    //send mail with appointment details
    const mailOptions = {
      from: "emailID", // Sender email
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p>Dear <strong>${first_name} ${last_name}</strong>,</p>
          <p>
            Your appointment for <strong style="color: #FF5722;">${
              service_details.name
            }</strong> 
            with <strong style="color: #2196F3;">${
              stylist_name || "our stylist"
            }</strong> is confirmed.
          </p>
          <p>
            <strong>Date:</strong> 
            <span style="color: #FF9800;">
              ${new Date(appointment_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <br>
            <strong>Time:</strong> 
            <span style="color: #FF9800;">
              ${new Date(appointment_date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <p>
            <strong>Location:</strong> 
            <span style="color: #009688;">
              ${location_details.name}, ${location_details.address.street}, 
              ${location_details.address.city}, ${
        location_details.address.state
      } ${location_details.address.zip}
            </span>
          </p>
          <p style="margin-top: 20px;">Thank you for choosing our service!</p>
          <hr style="margin: 20px 0;">
          <footer style="font-size: 0.9em; color: #666;">
            <p>
              If you have any questions, please contact us at 
              <a href="mailto:support@salon.com" style="color: #4CAF50; text-decoration: none;">support@example.com</a>.
            </p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(201).json({
      message: "Appointment booked successfully. Confirmation email sent.",
      appointment: savedAppointment,
    });
  } catch (err) {
    console.error("Error saving appointment:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
