import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Location from "./Components/Location";
import StatePage from "./Components/StatePage";
import BookingSidebar from "./Components/BookingSidebar";

const App = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const openBookingSidebar = (location) => {
    setSelectedLocation(location);
    setIsBookingOpen(true);
  };

  const closeBookingSidebar = () => {
    setIsBookingOpen(false);
  };

  return (
    <Router>
      <Header openBooking={openBookingSidebar} />
      <div className={isBookingOpen ? "blurred" : ""}>
        <Routes>
          <Route path="/" element={<Home onBookNow={openBookingSidebar} />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/location" element={<Location />} />
          <Route
            path="/state/:stateId"
            element={
              <StatePage
                openBooking={openBookingSidebar}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            }
          />
        </Routes>
      </div>
      {isBookingOpen && (
        <BookingSidebar
          onClose={closeBookingSidebar}
          preselectedLocation={selectedLocation}
        />
      )}
    </Router>
  );
};

export default App;
