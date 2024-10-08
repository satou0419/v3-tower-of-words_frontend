import React, { useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import changePassword from "@/lib/auth-endpoint/changePassword";
import Modal from "@/app/component/Modal/Modal";
import Toast from "@/app/component/Toast/Toast";
import "./setting.scss";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
    const [toastMessage, setToastMessage] = useState(""); // State to hold toast message

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setToastMessage("New passwords do not match."); // Set toast message for password mismatch
            setIsErrorToastOpen(true); // Display error toast
            return;
        }

        setIsConfirmModalOpen(true); // Show confirmation modal
    };

    const confirmChangePassword = async () => {
        try {
            await changePassword(currentPassword, newPassword);
            setIsSuccessModalOpen(true); // Open success modal upon successful change
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            setToastMessage("Failed to change password. Please try again."); // Set toast message for general error
            setIsErrorToastOpen(true); // Display error toast
        } finally {
            setIsConfirmModalOpen(false); // Close confirmation modal
        }
    };

    const handleCloseErrorToast = () => {
        setIsErrorToastOpen(false);
    };

    return (
        <section className="change-pass_wrapper">
            <form className="change-pass_form" onSubmit={handlePasswordChange}>
                <h1>CHANGE PASSWORD</h1>
                <div className="input-group">
                    <InputLine
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        autoFocus
                    />
                    <InputLine
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <InputLine
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>

            {/* Confirmation Modal */}
            <Modal
                className="confirmation-modal"
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Change"
                details="Are you sure you want to change your password?"
                buttons={[
                    <button
                        key="cancel"
                        onClick={() => setIsConfirmModalOpen(false)}
                    >
                        Cancel
                    </button>,
                    <button
                        key="confirm"
                        className="confirm" // Add class for confirmation button
                        onClick={confirmChangePassword}
                    >
                        Confirm
                    </button>,
                ]}
            />

            {/* Success Modal */}
            <Modal
                className="success-modal"
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Password Changed"
                details="Your password has been changed successfully!"
                buttons={[
                    <button
                        key="ok"
                        className="confirm" // Add class for confirmation button
                        onClick={() => setIsSuccessModalOpen(false)}
                    >
                        OK
                    </button>,
                ]}
            />

            {/* Error Toast */}
            {isErrorToastOpen && (
                <Toast
                    message={toastMessage}
                    type="error"
                    onClose={handleCloseErrorToast}
                />
            )}
        </section>
    );
};

export default ChangePassword;
