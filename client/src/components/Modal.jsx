function Modal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p className="modal-message">Your image has been uploaded successfully!</p>
                <button className="modal-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default Modal;
