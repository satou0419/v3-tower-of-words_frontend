import "./modal.scss";
import React, { ReactNode } from "react";

interface ModalProps {
    title: string;
    details?: string;
    icon?: ReactNode;
    buttons: ReactNode[];
    isOpen: boolean;
    children?: ReactNode;
    className?: string; // Add className prop
}

const Modal: React.FC<ModalProps> = ({
    title,
    details,
    icon,
    buttons,
    isOpen,
    children,
    className = "", // Default to empty string if not provided
}) => {
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${className}`}>
            <div className={`modal-content ${className}`}>
                <div className="modal-header">
                    {icon && <div className="icon">{icon}</div>}
                    <h2>{title}</h2>
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
