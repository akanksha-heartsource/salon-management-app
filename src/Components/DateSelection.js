import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dateSelection.css";

// import { convertToMinutes,convertTo12Hour } from "../utils/timeUtils";

export const DateSelection = ({
  onDateTimeSelect,
  selectedDateTime,
  selectedStylist,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [closedMessage, setClosedMessage] = useState("");

  useEffect(() => {
    if (selectedDateTime?.date) {
      setSelectedDate(new Date(selectedDateTime.date));
    } else {
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);
      setSelectedDate(todayUTC);
    }

    if (selectedDateTime?.time) {
      setSelectedTime(selectedDateTime.time);
    }
  }, [selectedDateTime]);

  const fetchStylistSchedule = async () => {
    if (!selectedStylist || !selectedDate) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/stylist-schedule/${selectedStylist.stylistId}`
      );

      //fetch booked slots
      const bookedSlotsResponse = await axios.get(
        `http://localhost:3001/api/appointments/booked-slots/${
          selectedStylist.name
        }/${selectedDate.toISOString().slice(0, 10)}`
      );

      const booked = bookedSlotsResponse.data.bookedSlots || [];
      setBookedSlots(
        booked.map((slot) => new Date(slot).toISOString().slice(0, 16))
      );
      setBookedSlots(
        booked.map((slot) => {
          const slotDate = new Date(slot);
          return slotDate.toISOString().slice(0, 16);
        })
      );

      const localDate = selectedDate.toLocaleDateString("en-CA");
      const scheduleForDate = response.data.find(
        (schedule) => schedule.date === localDate
      );

      if (!scheduleForDate) {
        setTimeSlots({});
        setClosedMessage("No availability for the selected date");
        return;
      }

      let { startTime, endTime, closed, reason } = scheduleForDate;

      if (closed) {
        setTimeSlots({});
        setClosedMessage(`Closed: ${reason || "No availability"}`);
        return;
      }

      if (!startTime || !endTime) {
        setTimeSlots({});
        return;
      }

      const adjustToLocalTime = (time) => {
        if (!time) {
          console.error("Time is null or undefined:", time);
          return null;
        }

        const match = time.match(/(\d+):(\d+) (\w+)/);
        if (!match) {
          console.error("Time format is invalid:", time);
          return null;
        }
        const [hours, minutes, modifier] = match.slice(1);
        const date = new Date();
        date.setHours(
          modifier === "PM" && hours !== "12" ? +hours + 12 : +hours
        );
        date.setMinutes(+minutes);
        date.setSeconds(0);

        if (isNaN(date.getTime())) {
          console.error("Invalid date generated from time:", time);
          return null;
        }

        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      startTime = adjustToLocalTime(startTime);

      endTime = adjustToLocalTime(endTime);
      console.log("Booked Slots (UTC):", bookedSlots);

      const slots = generateTimeSlots(startTime, endTime, bookedSlots);
      setTimeSlots(divideTimeSlots(slots, endTime));
      setClosedMessage("");
    } catch (error) {
      console.error("Error fetching stylist schedule:", error);
      setClosedMessage("Failed to fetch schedule");
    }
  };

  useEffect(() => {
    fetchStylistSchedule();
  }, [selectedStylist, selectedDate]);

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = date.getDay();
    startOfWeek.setDate(date.getDate() - day + (day === 0 ? -6 : 1));

    return Array.from({ length: 7 }).map((_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    });
  };

  const handleWeekNavigation = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const handleTimeSelect = (slot) => {
    if (slot.available) {
      setSelectedTime(slot.time);
      onDateTimeSelect(selectedDate.toISOString(), slot.time);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const generateTimeSlots = (startTime, endTime, unavailableSlots) => {
    const start = convertToMinutes(startTime);
    let end = convertToMinutes(endTime);

    if (end < start) {
      end += 24 * 60;
    }

    const currentDate = new Date();
    const selectedDayStart = new Date(selectedDate).setHours(0, 0, 0, 0);
    const todayStart = new Date(currentDate).setHours(0, 0, 0, 0);
    const currentMinutes =
      currentDate.getHours() * 60 + currentDate.getMinutes();

    const isPastDate = selectedDayStart < todayStart;
    const isToday = selectedDayStart === todayStart;

    const normalizeToMinutes = (isoString) => {
      const date = new Date(isoString);
      return date.toISOString().slice(0, 16);
    };

    const normalizedUnavailableSlots = bookedSlots.map((slot) =>
      new Date(slot).toISOString().slice(0, 16)
    );

    const slots = [];
    for (let time = start; time < end; time += 30) {
      const slotTime = convertTo12Hour(time);
      const slotDate = new Date(selectedDate);

      const [hours, minutes] = convertTo24Hour(convertTo12Hour(time))
        .split(":")
        .map(Number);

      slotDate.setUTCHours(hours, minutes, 0, 0);

      const slotISO = slotDate.toISOString().slice(0, 16);

      const isUnavailable = bookedSlots.includes(
        slotDate.toISOString().slice(0, 16)
      ); // Directly compare in UTC
      console.log(`Slot: ${slotISO}, Is Unavailable?`, isUnavailable);
      const isPastTime = isToday && time < currentMinutes;

      slots.push({
        time: convertTo12Hour(time),
        available: !isUnavailable && !isPastDate && !isPastTime,
      });
    }

    return slots;
  };

  const divideTimeSlots = (slots, endTime) => {
    const storeClosingHour = parseInt(endTime.split(":")[0], 10);

    const closingHourAdjusted =
      storeClosingHour < 6 ? storeClosingHour + 24 : storeClosingHour;

    return {
      morning: filterSlots(slots, 9, 12, closingHourAdjusted),
      afternoon: filterSlots(slots, 12, 16, closingHourAdjusted),
      evening: filterSlots(slots, 16, 24, closingHourAdjusted).concat(
        filterSlots(slots, 0, 6, closingHourAdjusted)
      ),
    };
  };

  const filterSlots = (slots, startHour, endHour, closingHour) => {
    return slots
      .filter((slot) => {
        if (!slot.time) {
          return false;
        }

        const [hour, modifier] = slot.time.split(" ");
        const hour24 =
          modifier === "PM" && hour !== "12"
            ? parseInt(hour) + 12
            : parseInt(hour);
        const adjustedHour = hour < 6 ? hour + 24 : hour;

        return hour24 >= startHour && hour24 < endHour;
      })
      .sort((a, b) => convertTo24Hour(a.time) - convertTo24Hour(b.time));
  };

  const convertToMinutes = (time) => {
    try {
      const sanitizedTime = time.trim();
      const [hourPart, minutePart] = sanitizedTime.split(":");
      const [minutes, modifier] = minutePart.split(" ");
      let hours = parseInt(hourPart, 10);
      const mins = parseInt(minutes, 10);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const totalMinutes = hours * 60 + mins;

      return totalMinutes;
    } catch (error) {
      console.error("Error in convertToMinutes:", time, error);
      return -1;
    }
  };

  const convertTo12Hour = (totalMinutes) => {
    const hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const hours12 = hours24 % 12 || 12;
    const amPm = hours24 < 12 ? "AM" : "PM";

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const convertTo24Hour = (slotTime) => {
    try {
      if (!slotTime) {
        throw new Error("slotTime is undefined or null");
      }
      const [time, modifier] = slotTime.split(" ");
      const [hour, minute] = time.split(":").map(Number);
      let hour24 = hour;

      if (modifier === "PM" && hour !== 12) hour24 += 12;
      if (modifier === "AM" && hour === 12) hour24 = 0;

      return `${hour24.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    } catch (error) {
      console.error("Error in convertTo24Hour:", slotTime, error);
      return "00:00";
    }
  };

  const weekDates = getWeekDates(selectedDate);

  return (
    <div className="date-selection">
      <div className="calendar-header">
        <button onClick={() => handleWeekNavigation(-1)} className="nav-arrow">
          {"<"}
        </button>
        <h4>
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <button onClick={() => handleWeekNavigation(1)} className="nav-arrow">
          {">"}
        </button>
      </div>

      <div className="calendar">
        {weekDates.map((date, index) => (
          <button
            key={index}
            className={`calendar-date ${
              date.toDateString() === selectedDate.toDateString()
                ? "selected"
                : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            <span>
              {date
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase()}
            </span>
            <span>{date.getDate()}</span>
          </button>
        ))}
      </div>

      <div className="selected-date">
        Selected Date:{" "}
        <strong className="dateDisplay">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </strong>
      </div>

      {closedMessage ? (
        <div className="closed-message">
          <h3>{closedMessage}</h3>
          <p>See you next day!</p>
        </div>
      ) : (
        <div className="time-slots">
          {Object.entries(timeSlots).map(([section, slots]) => (
            <div key={section} className="time-slot-section">
              <div
                className="time-slot-header"
                onClick={() => toggleSection(section)}
              >
                <strong>{section.toUpperCase()}:</strong>

                <span className="timeShow">
                  {slots.length > 0
                    ? `${slots[0].time} - ${slots[slots.length - 1].time}`
                    : "No slots"}
                </span>
                <span>{expandedSection === section ? "▲" : "▼"}</span>
              </div>
              {expandedSection === section && slots.length > 0 && (
                <div className="time-slot-options">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      className={`time-option ${
                        selectedTime === slot.time ? "selected" : ""
                      } ${!slot.available ? "disabled" : ""}`}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="waitlist">
        <p>Not seeing a time that works for you?</p>
        <button className="join-waitlist">Join our waitlist</button>
      </div>
    </div>
  );
};

export default DateSelection;
