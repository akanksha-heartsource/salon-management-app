import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = ({ onBookNow }) => {
  const navigate = useNavigate();

  const handleViewLocations = () => {
    navigate("/location");
  };

  const services = [
    {
      title: "Hair Styling",
      description: "Get a chic and trendy hairstyle tailored to your look.",
      icon: "✂️",
    },
    {
      title: "Facials",
      description: "Experience rejuvenating facials for glowing skin.",
      icon: "💆‍♀️",
    },
    {
      title: "Nail Care",
      description:
        "Pamper your nails with our exclusive manicure and pedicure services.",
      icon: "💅",
    },
    {
      title: "Massage Therapy",
      description: "Relax and unwind with our professional massage therapy.",
      icon: "🧖‍♀️",
    },
  ];

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
      <div className="services">
        <h2>Services</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
