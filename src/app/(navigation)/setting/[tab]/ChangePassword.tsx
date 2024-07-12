import React, { useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import changePassword from "@/lib/auth-endpoint/changePassword";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            alert("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setError(null);
        } catch (err) {
            setError("Failed to change password. Please try again.");
        }
    };

    return (
        <section className="change-pass_wrapper">
            <form className="change-pass_form" onSubmit={handlePasswordChange}>
                <h1>CHANGE PASSWORD</h1>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <InputLine
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <InputLine
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputLine
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
};

export default ChangePassword;
