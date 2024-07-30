"use client";
import React, { useState } from "react";
import { InputBox } from "@/app/component/Input/Input";
import "./register.scss";
import Link from "next/link";
import registerUser from "@/lib/auth-endpoint/registerUser";
import Toast from "@/app/component/Toast/Toast";
import { useRouter } from "next/navigation";

interface FormData {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    userType: string;
    password: string;
    confirmPassword: string;
}

const initialFormData: FormData = {
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    userType: "",
    password: "",
    confirmPassword: "",
};

const Register: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const route = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setToastMessage("Passwords do not match");
            setToastType("error");
            setShowToast(true);
            return;
        }

        const { confirmPassword, ...userData } = formData;
        try {
            const response = await registerUser(userData);
            console.log("User registered successfully:", response);
            setToastMessage("User registered successfully");
            setToastType("success");
            setShowToast(true);
            route.push("/login");

            // Handle successful registration (e.g., redirect to login)
        } catch (error) {
            console.error("Registration failed:", error);
            setToastMessage("Registration failed. Please try again.");
            setToastType("error");
            setShowToast(true);
        }
    };

    return (
        <main className="register-wrapper">
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
            <section className="register-container">
                <section className="register-banner">
                    <img
                        src="assets/images/banner/banner_register.webp"
                        alt="Register Banner"
                    />
                </section>
                <form className="register-form" onSubmit={handleSubmit}>
                    <h1>Create Account</h1>

                    <div className="register-input_group">
                        <div className="register-fullname_group">
                            <InputBox
                                type="text"
                                name="firstname"
                                placeholder="Firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                            <InputBox
                                type="text"
                                name="lastname"
                                placeholder="Lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <InputBox
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            required
                        >
                            <option disabled value="">
                                Select Type
                            </option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit">Register</button>

                    <div className="register-link_group">
                        <span>
                            Don't have an account yet?
                            <Link href="/login" className="link-signup">
                                Sign up
                            </Link>
                        </span>
                        <span>
                            <Link href="#">Terms and Conditions |</Link>
                            <Link href="#">Privacy Policy |</Link>
                            <Link href="#">Support</Link>
                        </span>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Register;
