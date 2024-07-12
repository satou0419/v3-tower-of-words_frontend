import "./modal.scss";

import React, { ReactNode } from "react";

interface ModalProps {
    title: string;
    details?: string;
    icon?: ReactNode;
    buttons: ReactNode[];
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    title,
    details,
    icon,
    buttons,
    isOpen,
    onClose,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
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
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
