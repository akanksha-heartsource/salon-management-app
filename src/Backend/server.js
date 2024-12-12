const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;

//connect to DB
connectDB();

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//API Routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/appointments", require("./routes/bookedSlots"));

app.use("/api/stylists", require("./routes/stylistRoutes"));
app.use("/api/stylists", require("./routes/stylistRoutesNew"));
app.use("/api/stylist-schedule", require("./routes/stylist-schedule"));

//NEW ROUTE for google calendar API
app.use("/api/takeappointments", require("./routes/appointmentRoutes"));

//Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
