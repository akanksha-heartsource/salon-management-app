import React from "react";
import "../styles/serviceSelection.css";

const ServiceSelection = ({
  salonServices,
  onToggleCategory,
  expandedCategory,
  onSelectSubservice,
  selectedService,
}) => {
  return (
    <div className="service-categories">
      {salonServices &&
        Object.keys(salonServices)
          .filter((key) => key !== "_id")
          .map((category) => (
            <div
              key={category}
              className={`service-category ${
                expandedCategory === category ? "active" : ""
              }`}
            >
              <div
                onClick={() => onToggleCategory(category)}
                className="category-header"
              >
                <span className="category-name">{category}</span>
                <span className="arrow">
                  {expandedCategory === category ? "▲" : "▼"}
                </span>
              </div>
              <div
                className={`service-list ${
                  expandedCategory === category ? "expanded" : "collapsed"
                }`}
              >
                {Array.isArray(salonServices[category]) ? (
                  salonServices[category].map((subservice, index) => (
                    <div
                      key={subservice.serviceId}
                      className={`service-item ${
                        selectedService?.serviceId === subservice.serviceId
                          ? "selected-service"
                          : ""
                      }`}
                      onClick={() => onSelectSubservice(subservice)}
                    >
                      <span className="service-name">{subservice.name}</span>
                      <div className="service-details">
                        <span>{subservice.price}</span>
                        <small>
                          {subservice.duration
                            ? `${subservice.duration} mins`
                            : ""}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No services available in this category.</p>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default ServiceSelection;
