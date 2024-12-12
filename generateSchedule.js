const mongoose = require("mongoose");
const { eachDayOfInterval, format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Stylist schema
const stylistSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  stylistId: { type: String, required: true },
  name: { type: String, required: true },
  expertise: [String],
  locations: [String],
  schedule: [
    {
      date: { type: String },
      startTime: { type: String },
      endTime: { type: String },
    },
  ],
  state: { type: String },
});

const Stylist = mongoose.model("Stylist", stylistSchema);

// Schedule schema
const scheduleSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  stylistId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  closed: { type: Boolean, default: false },
  reason: { type: String },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

//Regular business hours
const businessHours = [
  { day: "Monday", startTime: "09:00 AM", endTime: "07:00 PM", closed: false },
  { day: "Tuesday", startTime: "09:00 AM", endTime: "07:00 PM", closed: false },
  {
    day: "Wednesday",
    startTime: "09:00 AM",
    endTime: "07:00 PM",
    closed: false,
  },
  { day: "Thursday", closed: true },
  { day: "Friday", startTime: "09:00 AM", endTime: "07:00 PM", closed: false },
  {
    day: "Saturday",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    closed: false,
  },
  { day: "Sunday", startTime: "11:00 AM", endTime: "05:00 PM", closed: false },
];

//Holiday hours
const holidayHours = [
  { date: "2024-11-28", name: "Thanksgiving", closed: true },
  { date: "2024-12-25", name: "Christmas", closed: true },
  { date: "2025-01-01", name: "New Year", closed: true },
  { date: "2025-12-25", name: "Christmas", closed: true },
];

// Generating the schedule
const generateSchedule = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/salon", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const stylists = await Stylist.find();
    if (!stylists || stylists.length === 0) {
      throw new Error("No stylist data found in the database");
    }

    for (const stylist of stylists) {
      if (!stylist.stylistId) {
        const generatedStylistId = uuidv4();
        await Stylist.updateOne(
          { _id: stylist._id },
          { $set: { stylistId: generatedStylistId } }
        );
        stylist.stylistId = generatedStylistId;
        console.log(
          `Added stylistId for ${stylist.name}: ${generatedStylistId}`
        );
      }
    }

    await Schedule.deleteMany({});
    console.log("Cleared existing schedule data");

    const allDates = eachDayOfInterval({
      start: new Date("2024-11-27"),
      end: new Date("2025-12-31"),
    });

    const allSchedules = [];

    stylists.forEach((stylist) => {
      const { stylistId, name, schedule: stylistSchedule } = stylist;

      console.log(`Processing Stylist ID: ${stylistId}, Name: ${name}`);

      allDates.forEach((date) => {
        const currentDate = format(date, "yyyy-MM-dd");
        const dayOfWeek = format(date, "EEEE");

        const holiday = holidayHours.find((h) => h.date === currentDate);
        if (holiday) {
          allSchedules.push({
            _id: uuidv4(),
            stylistId,
            name,
            date: currentDate,
            closed: holiday.closed,
            reason: holiday.name,
          });
          return;
        }

        const specificSchedule = stylistSchedule.find(
          (s) => s.date === currentDate
        );
        if (specificSchedule) {
          allSchedules.push({
            _id: uuidv4(),
            stylistId,
            name,
            date: currentDate,
            startTime: specificSchedule.startTime,
            endTime: specificSchedule.endTime,
            closed: false,
            reason: null,
          });
          return;
        }

        // regular business hours
        const regularHours = businessHours.find((b) => b.day === dayOfWeek);
        allSchedules.push({
          _id: uuidv4(),
          stylistId,
          name,
          date: currentDate,
          startTime: regularHours?.startTime || null,
          endTime: regularHours?.endTime || null,
          closed: regularHours?.closed || false,
          reason: null,
        });
      });
    });

    const chunkSize = 500;
    for (let i = 0; i < allSchedules.length; i += chunkSize) {
      const chunk = allSchedules.slice(i, i + chunkSize);
      await Schedule.insertMany(chunk);
    }

    console.log("Yearly schedule for all stylists generated successfully!");
  } catch (error) {
    console.error("Error generating schedule:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
generateSchedule();
