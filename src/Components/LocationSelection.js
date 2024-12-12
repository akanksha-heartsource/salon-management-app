import React, { useState, useEffect } from "react";
import "../styles/stateLocation.css";

import stateAbbreviations from "../utils/stateAbbreviations";

const StateLocationSelection = ({
  onSelectLocation,
  locations,
  selectedLocation,
}) => {
  const [expandedState, setExpandedState] = useState(null);

  const stateWiseLocations = locations.reduce((acc, location) => {
    const state = location.address.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(location);
    return acc;
  }, {});

  useEffect(() => {
    if (selectedLocation) {
      const locationState = selectedLocation.address.state;
      setExpandedState(locationState);
    }
  }, [selectedLocation]);

  const toggleState = (state) => {
    setExpandedState(expandedState === state ? null : state);
  };

  const reversedStateAbbreviations = Object.fromEntries(
    Object.entries(stateAbbreviations).map(([name, abbr]) => [abbr, name])
  );

  return (
    <div className="state-location-selection">
      <h2 className="headerLoc">Select a Location</h2>
      {Object.keys(stateWiseLocations).map((state) => (
        <div key={state} className="state-item">
          <div
            className="state-header"
            onClick={() => toggleState(state)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: expandedState === state ? "#eaeaea" : "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div className="stateName">
              <span>
                {`${reversedStateAbbreviations[state] || state} (${state})`}
              </span>
            </div>
            <div className="arrow">
              <span>{expandedState === state ? "▲" : "▼"}</span>
            </div>
          </div>
          {expandedState === state && (
            <ul className="location-list">
              {stateWiseLocations[state].map((location) => (
                <li
                  key={location._id}
                  className={`location-item ${
                    selectedLocation?._id === location._id
                      ? "selected-location"
                      : ""
                  }`}
                  onClick={() => onSelectLocation(location)}
                  style={{
                    padding: "10px",
                    marginBottom: "5px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    backgroundColor:
                      selectedLocation?._id === location._id
                        ? "#d1e8f7"
                        : "#ffffff",
                  }}
                >
                  <h3>{location.name}</h3>
                  <p>
                    {location.address.street}, {location.address.city},{" "}
                    {location.address.zip}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default StateLocationSelection;
