import React from "react";

const SubcategorySelection = ({ services, onSelectService, onBack }) => (
  <div className="subcategory-container">
    <button onClick={onBack} className="back-button">
      ← Back
    </button>
    <h3>Select a Service</h3>
    <div className="service-list">
      {services.map((service, index) => (
        <div
          key={index}
          className="service-item"
          onClick={() => onSelectService(service)}
        >
          <span>{service.name}</span>
          <span>{service.price}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SubcategorySelection;
