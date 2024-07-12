import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import useUserInfoStore from "@/store/userInfoStore";
import updateUser from "@/lib/auth-endpoint/updateUser";

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

    useEffect(() => {
        setLocalFirstname(firstname);
        setLocalLastname(lastname);
        setInitialLocalFirstname(firstname);
        setInitialLocalLastname(lastname);
    }, [firstname, lastname]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateUser(localFirstname, localLastname);
            setFirstname(localFirstname); // Update the Zustand store only after successful save
            setLastname(localLastname);
            alert("User information updated successfully!");
            setIsDirty(false); // Reset dirty state after successful save
            setInitialLocalFirstname(localFirstname); // Update initial values
            setInitialLocalLastname(localLastname);
        } catch (err) {
            console.error("Failed to update user information:", err);
            // Handle error state
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
        </section>
    );
};

export default PersonalInformation;
