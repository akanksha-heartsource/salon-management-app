import "../styles/bookingModal.css";

const BookingModal = ({ details, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h2 className="modal-header">Booking Confirmation</h2>
      <p className="modal-text">
        Appointment booked for{" "}
        <strong className="highlight">{details.name}</strong> on{" "}
        <strong className="highlight">{details.date}</strong> at{" "}
        <strong className="highlight">{details.time}</strong> at the location:
      </p>
      <p className="modal-location">
        <strong className="highlight-location">{details.location}</strong> with{" "}
        <strong className="highlight">{details.selectedStylist}</strong>
      </p>
      <p className="confirmation-message">
        You'll receive a confirmation email soon. Keep an eye on your inbox for
        the details!
      </p>
      <button onClick={onClose} className="btnConfirm">
        Close
      </button>
    </div>
  </div>
);

export default BookingModal;
