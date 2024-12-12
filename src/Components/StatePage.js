import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import "../styles/statePage.css";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const StatePage = ({ openBooking }) => {
  const { stateId } = useParams();
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -95.7129 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/locations/${stateId}`
        );

        setLocations(response.data);

        if (response.data.length > 0) {
          const firstLocation = response.data[0];
          setCenter({
            lat: parseFloat(firstLocation.coordinates?.lat || 37.7749),
            lng: parseFloat(firstLocation.coordinates?.lng || -95.7129),
          });
        }
      } catch (error) {
        setError("We don't have any location at this state.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [stateId]);

  if (loading) {
    return <div>Loading locations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginTop: "2em" }}>Contact Information for {stateId}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {locations.length > 0 ? (
          locations.map((location) => (
            <div
              key={location._id}
              style={{ flex: "1 1 45%", minWidth: "300px" }}
            >
              <h3>{location.name}</h3>

              <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{
                    lat: parseFloat(location.coordinates?.lat || 37.7749),
                    lng: parseFloat(location.coordinates?.lng || -95.7129),
                  }}
                  zoom={10}
                >
                  <Marker
                    position={{
                      lat: parseFloat(location.coordinates?.lat || 37.7749),
                      lng: parseFloat(location.coordinates?.lng || -95.7129),
                    }}
                    onClick={() => setSelectedLocation(location)}
                  />
                  {selectedLocation &&
                    selectedLocation._id === location._id && (
                      <InfoWindow
                        position={{
                          lat: parseFloat(location.coordinates?.lat || 37.7749),
                          lng: parseFloat(
                            location.coordinates?.lng || -95.7129
                          ),
                        }}
                        onCloseClick={() => setSelectedLocation(null)}
                      >
                        <div>
                          <h4>{location.name}</h4>
                          <p>
                            {location.address.street}, {location.address.city},{" "}
                            {location.address.state} {location.address.zip}
                          </p>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              `${location.address.street}, ${location.address.city}, ${location.address.state} ${location.address.zip}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                            }}
                          >
                            Get Directions
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                </GoogleMap>
              </LoadScript>
              <p>
                {location.address.street}, {location.address.city},{" "}
                {location.address.state} {location.address.zip}
              </p>
              <button
                onClick={() => {
                  openBooking(location, "ServiceSelection");
                }}
                style={{ backgroundColor: "lightcoral", color: "white" }}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>
            We don't have any location at this state.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatePage;
