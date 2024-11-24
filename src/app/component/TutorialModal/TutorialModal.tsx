"use client"
// components/TutorialModal.tsx
import React, { useEffect } from "react"
import "./tutorialmodal.scss"

// Define the type for the TutorialModal's props
type TutorialModalProps = {
    isOpen: boolean
    onClose: () => void
    renderTutorialPage: () => JSX.Element | null // This is a function that returns the correct component
}

const TutorialModal: React.FC<TutorialModalProps> = ({
    isOpen,
    onClose,
    renderTutorialPage, // Pass the function that returns the correct component
}) => {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = isOpen ? "hidden" : "auto"
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="tm-modal-overlay" onClick={onClose}>
            <div
                className="tm-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="tm-modal-close" onClick={onClose}>
                    &times;
                </button>
                {/* Render the correct tutorial page dynamically */}
                {renderTutorialPage()}
            </div>
        </div>
    )
}

export default TutorialModal
