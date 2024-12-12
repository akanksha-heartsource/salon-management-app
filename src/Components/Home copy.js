import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = ({ onBookNow }) => {
  const navigate = useNavigate();

  const handleViewLocations = () => {
    navigate("/location");
  };
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Our Salon</h1>
        <p>Your beauty journey starts here.</p>
        <div className="buttons">
          <button className="book-now" onClick={() => onBookNow(null)}>
            Book Now
          </button>
          <button className="locations" onClick={handleViewLocations}>
            View Locations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
