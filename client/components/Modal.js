// Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
// import './Modal.css';

const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        {/* Close button inside modal content */}
        {/* <button onClick={onClose} className="modal-close-button">
          Close
        </button> */}
      </div>
      <div className="modal-background" onClick={onClose}></div>
    </div>,
    document.getElementById('modal-root') // Ensure you have a div with id 'modal-root' in your index.html
  );
};

export default Modal;
