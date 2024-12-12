import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceSelection from "./ServiceSelection";
import DateSelection from "./DateSelection";
import LocationSelection from "./LocationSelection";
import StylistSelection from "./StylistSelection";
import ConfirmBooking from "./ConfirmBooking";
import "../styles/bookingSidebar.css";

const BookingSidebar = ({
  onClose,
  preselectedLocation,
  preselectedScreen,
}) => {
  const [currentScreen, setCurrentScreen] = useState(
    preselectedScreen || "ServiceSelection"
  );
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    preselectedLocation || null
  );
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylists, setStylists] = useState([]);

  const [selectedDateTime, setSelectedDateTime] = useState({
    date: null,
    time: null,
  });
  const [salonServices, setSalonServices] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (preselectedLocation) {
      setSelectedLocation(preselectedLocation);
      fetchStylistsByLocation(preselectedLocation._id);
    }
  }, [preselectedLocation]);

  useEffect(() => {
    const fetchServicesAndLocations = async () => {
      try {
        setLoading(true);
        const servicesResponse = await axios.get(
          "http://localhost:3001/api/services"
        );
        const locationsResponse = await axios.get(
          "http://localhost:3001/api/locations"
        );

        const rawServices = servicesResponse.data[0] || null;
        const sanitizedServices = rawServices
          ? Object.fromEntries(
              Object.entries(rawServices).filter(
                ([key]) => key !== "_id" && key.toLowerCase() !== "services"
              )
            )
          : null;

        setSalonServices(sanitizedServices);

        setLocations(
          locationsResponse.data.map((location) => ({
            ...location,
            _id: location._id || location.id,
          }))
        );
      } catch (err) {
        setError("Failed to load services or locations");
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndLocations();
  }, []);

  const fetchStylistsByLocation = async (locationId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/stylists/location/${locationId}`
      );

      setStylists(response.data);
    } catch (error) {
      console.error("Failed to fetch stylists", error);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    if (selectedLocation || preselectedLocation) {
      setCurrentScreen("StylistSelection");
    } else {
      setCurrentScreen("LocationSelection");
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    fetchStylistsByLocation(location._id);
    setCurrentScreen("StylistSelection");
  };

  const handleStylistSelection = (stylist) => {
    setSelectedStylist(stylist);
    setCurrentScreen("DateSelection");
  };

  const handleDateTimeSelect = (date, time) => {
    setSelectedDateTime({ date, time });
    setCurrentScreen("ConfirmBooking");
  };

  const handleConfirm = () => {
    setCurrentScreen("ConfirmBooking");
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="booking-sidebar-overlay" onClick={handleOverlayClick}>
      <div className="sidebar" onClick={handleSidebarClick}>
        <button onClick={onClose} className="close-button">
          X
        </button>
        <h2>Salon</h2>

        <div className="steps-navigation">
          <button
            className={`step-button ${
              currentScreen === "ServiceSelection" ? "active-step" : ""
            }`}
            onClick={() => setCurrentScreen("ServiceSelection")}
          >
            Service
          </button>
          <span className="step-separator">{">"}</span>

          <button
            className={`step-button ${
              !selectedService ? "disabled-step" : ""
            } ${currentScreen === "LocationSelection" ? "active-step" : ""}`}
            onClick={() => {
              if (selectedService) setCurrentScreen("LocationSelection");
            }}
            disabled={!selectedService}
          >
            Location
          </button>

          <span className="step-separator">{">"}</span>

          <button
            className={`step-button ${
              currentScreen === "StylistSelection" ? "active-step" : ""
            }`}
            onClick={() => {
              if (selectedLocation) setCurrentScreen("StylistSelection");
            }}
            disabled={!selectedLocation}
          >
            Stylist
          </button>

          <span className="step-separator">{">"}</span>

          <button
            className={`step-button ${
              !selectedLocation ? "disabled-step" : ""
            } ${currentScreen === "DateSelection" ? "active-step" : ""}`}
            onClick={() => {
              if (selectedLocation) setCurrentScreen("DateSelection");
            }}
            disabled={!selectedLocation}
          >
            Day & Time
          </button>
          <span className="step-separator">{">"}</span>

          <button
            className={`step-button ${
              !selectedDateTime.date || !selectedDateTime.time
                ? "disabled-step"
                : ""
            } ${currentScreen === "ConfirmBooking" ? "active-step" : ""}`}
            onClick={() => {
              if (selectedDateTime.date && selectedDateTime.time) {
                setCurrentScreen("ConfirmBooking");
              }
            }}
            disabled={!selectedDateTime.date || !selectedDateTime.time}
          >
            Confirm
          </button>
        </div>

        {currentScreen === "ServiceSelection" && salonServices && (
          <ServiceSelection
            salonServices={salonServices}
            onToggleCategory={toggleCategory}
            expandedCategory={expandedCategory}
            onSelectSubservice={handleServiceSelect}
            selectedService={selectedService}
          />
        )}

        {currentScreen === "LocationSelection" && (
          <LocationSelection
            serviceId={selectedService?.serviceId}
            onSelectLocation={handleLocationSelect}
            locations={locations}
            selectedLocation={selectedLocation}
          />
        )}

        {currentScreen === "StylistSelection" && (
          <StylistSelection
            stylists={stylists}
            onSelectStylist={handleStylistSelection}
            disabled={!selectedLocation}
          />
        )}

        {currentScreen === "DateSelection" && (
          <DateSelection
            selectedService={selectedService}
            selectedLocation={selectedLocation}
            onDateTimeSelect={handleDateTimeSelect}
            selectedDateTime={selectedDateTime}
            //selectedStylist={{ stylist_name: "Carla Nguyen" }}
            selectedStylist={selectedStylist}
          />
        )}

        {currentScreen === "ConfirmBooking" && (
          <ConfirmBooking
            selectedService={selectedService}
            selectedLocation={selectedLocation}
            selectedDateTime={selectedDateTime}
            selectedStylist={selectedStylist}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default BookingSidebar;
