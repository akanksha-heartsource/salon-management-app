import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const SalonCalendar = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          margin: "0 auto",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          events={[]}
        />
      </div>
    </>
  );
};

export default SalonCalendar;
