import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import useUserInfoStore from "@/store/userInfoStore";
import updateUser from "@/lib/auth-endpoint/updateUser";
import Modal from "@/app/component/Modal/Modal";

const PersonalInformation = () => {
    const { username } = useUserInfoStore((state) => ({
        username: state.username,
    }));

    const { firstname, lastname, setFirstname, setLastname } =
        useUserInfoStore();

    const [localFirstname, setLocalFirstname] = useState(firstname);
    const [localLastname, setLocalLastname] = useState(lastname);

    const [initialLocalFirstname, setInitialLocalFirstname] =
        useState(firstname);
    const [initialLocalLastname, setInitialLocalLastname] = useState(lastname);

    const [isDirty, setIsDirty] = useState(false); // Track form dirty state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // New state for error modal

    useEffect(() => {
        setLocalFirstname(firstname);
        setLocalLastname(lastname);
        setInitialLocalFirstname(firstname);
        setInitialLocalLastname(lastname);
    }, [firstname, lastname]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmModalOpen(true); // Open the confirmation modal
    };

    const confirmUpdate = async () => {
        try {
            await updateUser(localFirstname, localLastname);
            setFirstname(localFirstname); // Update the Zustand store only after successful save
            setLastname(localLastname);
            setIsSuccessModalOpen(true); // Open the success modal upon successful save
            setIsDirty(false); // Reset dirty state after successful save
            setInitialLocalFirstname(localFirstname); // Update initial values
            setInitialLocalLastname(localLastname);
        } catch (err) {
            console.error("Failed to update user information:", err);
            setIsErrorModalOpen(true); // Open error modal if update fails
        } finally {
            setIsConfirmModalOpen(false); // Close the confirmation modal after handling update
        }
    };

    // Check if there are changes from initial values
    useEffect(() => {
        setIsDirty(
            localFirstname !== initialLocalFirstname ||
                localLastname !== initialLocalLastname
        );
    }, [
        localFirstname,
        localLastname,
        initialLocalFirstname,
        initialLocalLastname,
    ]);

    return (
        <section className="change-pass_wrapper">
            <form className="change-pass_form" onSubmit={handleSaveChanges}>
                <h1>ACCOUNT INFORMATION</h1>
                <div className="input-group">
                    <InputLine
                        type="text"
                        placeholder="Username"
                        value={username}
                        readOnly
                    />
                    <InputLine
                        type="text"
                        placeholder="Firstname"
                        value={localFirstname}
                        onChange={(e) => {
                            setLocalFirstname(e.target.value);
                        }}
                    />
                    <InputLine
                        type="text"
                        placeholder="Lastname"
                        value={localLastname}
                        onChange={(e) => {
                            setLocalLastname(e.target.value);
                        }}
                    />
                </div>
                <button type="submit" disabled={!isDirty}>
                    Save Changes
                </button>
            </form>

            {/* Confirmation Modal */}
            <Modal
                className="confirmation-modal"
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Update"
                details="Are you sure you want to update your information?"
                buttons={[
                    <button
                        key="cancel"
                        onClick={() => setIsConfirmModalOpen(false)}
                    >
                        Cancel
                    </button>,
                    <button key="confirm" onClick={confirmUpdate}>
                        Confirm
                    </button>,
                ]}
            />

            {/* Success Modal */}
            <Modal
                className="success-modal"
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Update Successful"
                details="User information updated successfully!"
                buttons={[
                    <button
                        key="ok"
                        onClick={() => setIsSuccessModalOpen(false)}
                    >
                        OK
                    </button>,
                ]}
            />

            {/* Error Modal */}
            <Modal
                className="error-modal"
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Update Failed"
                details="Failed to update user information. Please try again."
                buttons={[
                    <button
                        key="retry"
                        onClick={() => setIsErrorModalOpen(false)}
                    >
                        Retry
                    </button>,
                ]}
            />
        </section>
    );
};

export default PersonalInformation;
