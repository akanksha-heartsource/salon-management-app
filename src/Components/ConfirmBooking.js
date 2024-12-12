import React, { useState } from "react";
import axios from "axios";
import BookingModal from "./BookingModal";
import "../styles/confirmBooking.css";

const ConfirmBooking = ({
  selectedService,
  selectedLocation,
  selectedDateTime,
  selectedStylist,
  onClose,
}) => {
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [policyError, setPolicyError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [formErrors, setFormErros] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const handleModalClose = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCheckboxChange = () => {
    setIsPolicyAgreed(!isPolicyAgreed);
    setPolicyError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setFormErros({ ...formErrors, [name]: "" });
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = "* First Name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = " * Last name is required";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = " * Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.email.trim()) {
      errors.email = "* Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    const { date, time } = selectedDateTime;

    if (!date || !time) {
      console.error("Invalid date or time:", selectedDateTime);
      return;
    }

    const [hour, minute] = time.split(":");
    const isPM = time.includes("PM");
    const formattedDate = new Date(date);

    formattedDate.setHours(isPM ? parseInt(hour, 10) + 12 : parseInt(hour, 10));
    formattedDate.setMinutes(parseInt(minute, 10));

    const formattedDateTime = formattedDate.toISOString();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErros(errors);
      setIsLoading(false);
      return;
    }
    if (!isPolicyAgreed) {
      setPolicyError("* You must agree to the cancellation policy.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        appointment_date: formattedDateTime,
        location_id: selectedLocation._id,
        service_id: selectedService.serviceId,
        location_details: {
          name: selectedLocation.name,
          address: {
            street: selectedLocation.address.street,
            city: selectedLocation.address.city,
            state: selectedLocation.address.state,
            zip: selectedLocation.address.zip,
          },
        },
        service_details: {
          name: selectedService.name,
          price: selectedService.price,
        },
        stylist_name: selectedStylist?.name || null,
      };

      const response = await axios.post(
        "http://localhost:3001/api/appointments",
        payload
      );

      setBookingDetails({
        name: `${formData.firstName} ${formData.lastName}`,
        date: new Date(selectedDateTime.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: selectedDateTime.time,
        location: `${selectedLocation.name}, ${selectedLocation.address.street}, ${selectedLocation.address.city}, ${selectedLocation.address.state}, ${selectedLocation.address.zip}`,
        selectedStylist: selectedStylist?.name || "No stylist selected",
      });

      setIsModalVisible(true);
      setIsLoading(false);

      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      });
      setIsPolicyAgreed(false);
      setFormErros({});
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to book appointment");
      setIsLoading(false);
    }
  };

  return (
    <div className="confirm-booking">
      {isModalVisible && (
        <BookingModal details={bookingDetails} onClose={handleModalClose} />
      )}

      <div className="booking-summary">
        <p className="booking-date">
          {selectedDateTime.date
            ? new Date(selectedDateTime.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "No date selected"}
        </p>
        <h2 className="service-name">
          {selectedService?.name} ({selectedService?.price})
          <p className="stylist-info">
            with "{selectedStylist?.name || "No stylist selected"}"
          </p>
          <p className="stylist-info">
            at {selectedDateTime.time || "No time selected"}
          </p>
          <p className="stylist-info">
            LOC:{" "}
            {selectedLocation
              ? `${selectedLocation.name}, ${selectedLocation.address.street}, ${selectedLocation.address.city}, ${selectedLocation.address.state}, ${selectedLocation.address.zip}`
              : "No location selected"}
          </p>
        </h2>
      </div>

      <div className="user-details">
        <div className="input-group">
          <label>* First name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleInputChange}
            className={formErrors.firstName ? "error-input" : ""}
          />
          {formErrors.firstName && (
            <span className="error">{formErrors.firstName}</span>
          )}
        </div>

        <div className="input-group">
          <label>* Last name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleInputChange}
            className={formErrors.lastName ? "error-input" : ""}
          />
          {formErrors.lastName && (
            <span className="error">{formErrors.lastName}</span>
          )}
        </div>
        <div className="input-group">
          <label>* Phone number</label>
          <input
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            placeholder="Enter phone number"
            onChange={handleInputChange}
            className={formErrors.phoneNumber ? "error-input" : ""}
          />
          {formErrors.phoneNumber && (
            <span className="error">{formErrors.phoneNumber}</span>
          )}
        </div>
        <div className="input-group">
          <label>* Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email address"
            onChange={handleInputChange}
            className={formErrors.email ? "error-input" : ""}
          />
          {formErrors.email && (
            <span className="error">{formErrors.email}</span>
          )}
        </div>
      </div>

      <div className="cancellation-policy">
        <h3>Cancellation policy:</h3>
        <p>
          For appointments canceled within 24 hours or “no-show” appointments,
          we charge 100% of the service total.
        </p>
      </div>
      <div className="toggle-group">
        <label className="switch">
          <input
            type="checkbox"
            checked={isPolicyAgreed}
            onChange={handleCheckboxChange}
          />
          <span className="slider"></span>
        </label>
        <span>I agree to the cancellation policy.</span>
      </div>

      {policyError && <span className="policy-error">{policyError}</span>}

      <div className="btn">
        <button
          onClick={handleBookNow}
          className="btnBook"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner-container">
              <i className="fas fa-cut scissor-icon"></i>
              <p>Hold tight! We're finalizing your appointment...</p>
            </div>
          ) : (
            "Book Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
