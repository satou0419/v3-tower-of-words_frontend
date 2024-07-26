import "./modal.scss";
import React, { ReactNode } from "react";

interface ModalProps {
    title: string;
    details?: string;
    icon?: ReactNode;
    buttons: ReactNode[];
    isOpen: boolean;
    onClose?: () => void; // Add onClose prop
    children?: ReactNode;
    className?: string; // Add className prop
}

const Modal: React.FC<ModalProps> = ({
    title,
    details,
    icon,
    buttons,
    isOpen,
    onClose, // Destructure onClose prop
    children,
    className = "", // Default to empty string if not provided
}) => {
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${className}`} onClick={onClose}>
            <div
                className={`modal-content ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    {icon && <div className="icon">{icon}</div>}
                    <h2>{title}</h2>
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
