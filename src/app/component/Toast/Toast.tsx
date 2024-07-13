import React, { useEffect, useState } from "react";
import "./toast.scss"; // Add your CSS or SCSS file for styling

interface ToastProps {
    message: string;
    type: "success" | "error" | "warning";
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Close the toast after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    return (
        <div className={`toast ${type} ${isVisible ? "show" : ""}`}>
            <div className="toast-content">
                <span className="message">{message}</span>
                <button className="close-btn" onClick={handleClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Toast;
