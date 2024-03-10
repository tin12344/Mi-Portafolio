// Required import for the component
import React from 'react';
import "./ModalStyles.css"

// Definition of the ModalCompleteData component, which receives a prop closeModal
const ModalCompleteData = ({ closeModal }) => {
    // Rendering of the component
    return (
        <div>
            {/* Overlay to create a backdrop for the modal */}
            <div className="modal__overlay active"></div>
            {/* Main modal content */}
            <div className="modal active">
                {/* Close button for the modal */}
                <div className="modal__close-btn" onClick={closeModal}>
                    {/* Close icon */}
                    <i className="fa-solid fa-xmark">X</i>
                </div>
                {/* Left section of the modal */}
                <div className="modal__left">
                    {/* Title of the modal */}
                    <p>Error</p>
                    {/* Error section*/}
                    <div className="modal__error">
                        {/* Error message displayed in the modal */}
                        <p>Compleate all the spaces</p>
                    </div>
                </div>
                {/* Right section of the modal */}
                <div className="modal__right">
                    {/* Text content displayed in the modal */}
                    <p className="modal__text">
                        Check the spaces
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModalCompleteData;
