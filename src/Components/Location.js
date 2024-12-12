import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoPath } from "d3-geo";
import { useNavigate } from "react-router-dom";
import stateAbbreviations from "../utils/stateAbbreviations";
import axios from "axios";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Location = () => {
  const navigate = useNavigate();
  const [tooltipContent, setTooltipContent] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    const fetchAvailableStates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/locations/"
        );
        console.log("API Response:", response.data);

        const states = response.data.map((location) => location.address.state);

        setAvailableStates([...new Set(states)]);
      } catch (error) {
        console.error("Error fetching available states:", error);
      }
    };

    fetchAvailableStates();
  }, []);

  const handleStateClick = (stateAbbr) => {
    navigate(`/state/${stateAbbr}`);
  };

  const handleMouseEnter = (stateName, evt) => {
    const { clientX: x, clientY: y } = evt;
    setTooltipContent({ name: stateName, x, y });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <>
      <div className="map-container" style={{ position: "relative" }}>
        <ComposableMap
          className="composable-map"
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 900 }}
          width={900}
          height={500}
        >
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const stateAbbr = stateAbbreviations[stateName] || "";

                const isAvailable =
                  Array.isArray(availableStates) &&
                  availableStates.includes(stateAbbr);

                const centroid = geoPath().centroid(geo);
                const [x, y] = projection(centroid) || [0, 0];

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onClick={() => handleStateClick(stateAbbr)}
                      onMouseEnter={(evt) => handleMouseEnter(stateName, evt)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isAvailable ? "#eb738b" : "#d3d3d3",
                          stroke: "#000",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: isAvailable ? "#f0607d" : "#a9a9a9",
                          stroke: "#000",
                          strokeWidth: 1,
                          outline: "none",
                        },
                        pressed: {
                          fill: isAvailable ? "#2a5c4a" : "#7a7a7a",
                          stroke: "#000",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />

                    {stateAbbr && (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dy="0.35em"
                        style={{
                          fill: "#333",
                          fontSize: 12,
                          fontWeight: "bold",
                          pointerEvents: "none",
                        }}
                      >
                        {stateAbbr}
                      </text>
                    )}
                  </g>
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip display */}
        {tooltipContent && (
          <div
            style={{
              position: "absolute",
              top: tooltipContent.y,
              left: tooltipContent.x,
              background: "#fff",
              padding: "5px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            }}
          >
            {tooltipContent.name}
          </div>
        )}
      </div>
    </>
  );
};

export default Location;
