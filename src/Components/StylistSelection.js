import React from "react";
import "../styles/stylistSelection.css";

const StylistSelection = ({
  stylists,
  onSelectStylist,
  selectedStylist,
  disabled,
}) => {
  return (
    <div>
      <h3>Available Stylists</h3>

      {disabled ? (
        <p>Please select a location first to view available stylists.</p>
      ) : stylists.length === 0 ? (
        <p>No stylists available for this location.</p>
      ) : (
        <ul className="stylist-list">
          {stylists.map((stylist) => (
            <li
              key={stylist._id}
              className={`stylist-item ${disabled ? "disabled" : ""}`}
              onClick={() => !disabled && onSelectStylist(stylist)}
              style={{
                pointerEvents: disabled ? "none" : "auto",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <img
                src={stylist.image || "https://via.placeholder.com/50"}
                alt={stylist.name}
              />
              <div className="stylist-info">
                <p className="stylist-name">{stylist.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StylistSelection;
