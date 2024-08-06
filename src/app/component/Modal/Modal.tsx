import React, { ReactNode } from "react";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaFrownOpen,
    FaGamepad,
    FaInfoCircle,
    FaKey,
    FaQuestionCircle,
    FaSignOutAlt,
    FaSkullCrossbones,
    FaTrophy,
} from "react-icons/fa";
import "./modal.scss";
import FireworksComponent from "../Lottie/Fireworks";

interface ModalProps {
    title: string;
    details?: string;
    buttons: ReactNode[];
    isOpen: boolean;
    onClose?: () => void;
    children?: ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    title,
    details,
    buttons,
    isOpen,
    onClose,
    children,
    className = "",
}) => {
    if (!isOpen) return null;

    // Determine the icon based on the type
    const renderIcon = () => {
        switch (className) {
            case "success-modal":
                return <FaCheckCircle />;
            case "error-modal":
                return <FaExclamationCircle />;
            case "confirmation-modal":
                return <FaInfoCircle />;
            case "info-modal":
                return <FaInfoCircle />;
            case "logout-modal":
                return <FaSignOutAlt />;
            case "welcome-modal":
                return <FaGamepad />;
            case "gameover-modal":
                return <FaFrownOpen />;
            case "conquer-floor-modal":
                return <FaTrophy />;
            case "room-code-modal":
                return <FaKey />;
            case "item-used-modal":
                return <FaQuestionCircle />;
            default:
                return null;
        }
    };

    return (
        <div className={`modal-overlay ${className}`} onClick={onClose}>
            <div
                className={`modal-content ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    {renderIcon() && (
                        <div className="icon">
                            {renderIcon()} <h2>{title}</h2>
                        </div>
                    )}
                    {onClose && (
                        <button className="close-button" onClick={onClose}>
                            ×
                        </button>
                    )}
                </div>
                {details && (
                    <div className="modal-details">
                        <p>{details}</p>
                    </div>
                )}
                {children && <div className="modal-children">{children}</div>}
                {className === "conquer-floor-modal" && isOpen && (
                    <FireworksComponent show={isOpen} />
                )}
                <div className="modal-footer">
                    {buttons.map((button, index) => (
                        <div key={index} className="button-wrapper">
                            {button}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Modal;
