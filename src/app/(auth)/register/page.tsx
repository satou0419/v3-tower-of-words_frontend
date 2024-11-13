"use client"
import React, { useState, useEffect } from "react"
import { InputBox } from "@/app/component/Input/Input"
import "./register.scss"
import Link from "next/link"
import registerUser from "@/lib/auth-endpoint/registerUser"
import Toast from "@/app/component/Toast/Toast"
import { useRouter } from "next/navigation"
import Modal from "@/app/component/Modal/Modal"
import Loading from "@/app/loading"
import useCheckUsername from "@/hook/useCheckUsername"

interface FormData {
    username: string
    email: string
    firstname: string
    lastname: string
    userType: string
    password: string
    confirmPassword: string
}

const initialFormData: FormData = {
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    userType: "",
    password: "",
    confirmPassword: "",
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [toastMessage, setToastMessage] = useState<string>("")
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    )
    const [showToast, setShowToast] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [showTooltip, setShowTooltip] = useState<string | null>(null)

    const [inputStyles, setInputStyles] = useState<Record<string, string>>({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: "",
        userType: "",
    })

    const validateName = (name: string) => {
        const nameRegex = /^[A-Za-z\s]+$/
        return nameRegex.test(name) && name.length >= 2
    }

    const validateUsername = (username: string) => {
        const usernameRegex = /^[a-z][a-z._]*[a-z._]?$/

        return usernameRegex.test(username) && username.length >= 3
    }

    const validatePassword = (password: string) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordRegex.test(password)
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateForm = () => {
        const isFirstnameValid = validateName(formData.firstname)
        const isLastnameValid = validateName(formData.lastname)
        const isUsernameValid = validateUsername(formData.username)
        const isPasswordValid = validatePassword(formData.password)
        const isEmailValid = validateEmail(formData.email)
        const isConfirmPasswordValid =
            formData.confirmPassword === formData.password
        const isUserTypeValid = formData.userType !== ""

        return (
            isFirstnameValid &&
            isLastnameValid &&
            isUsernameValid &&
            isPasswordValid &&
            isEmailValid &&
            isConfirmPasswordValid &&
            isUserTypeValid
        )
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

        switch (name) {
            case "username":
                setInputStyles((prevStyles) => ({
                    ...prevStyles,
                    username: value
                        ? validateUsername(value)
                            ? "valid-input"
                            : "invalid-input"
                        : "",
                }))
                break
            case "password":
                setInputStyles((prevStyles) => ({
                    ...prevStyles,
                    password: value
                        ? validatePassword(value)
                            ? "valid-input"
                            : "invalid-input"
                        : "",
                    confirmPassword:
                        formData.confirmPassword === value
                            ? "valid-input"
                            : "invalid-input",
                }))
                break
            case "confirmPassword":
                setInputStyles((prevStyles) => ({
                    ...prevStyles,
                    confirmPassword:
                        value === formData.password
                            ? "valid-input"
                            : "invalid-input",
                }))
                break
            case "email":
                setInputStyles((prevStyles) => ({
                    ...prevStyles,
                    email: value
                        ? validateEmail(value)
                            ? "valid-input"
                            : "invalid-input"
                        : "",
                }))
                break
            case "firstname":
            case "lastname":
            case "userType":
                setInputStyles((prevStyles) => ({
                    ...prevStyles,
                    [name]: value ? "valid-input" : "",
                }))
                break
            default:
                break
        }
    }

    const route = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setToastMessage("Passwords do not match")
            setToastType("error")
            setShowToast(true)
            return
        }

        const { confirmPassword, ...userData } = formData
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)

        try {
            setLoading(true)
            const response = await registerUser(userData, {
                signal: controller.signal,
            })
            clearTimeout(timeoutId)

            console.log("User registered successfully:", response)
            setToastMessage("User registered successfully")
            setToastType("success")
            setShowToast(true)
            setShowModal(true)
            setLoading(false)
        } catch (error) {
            if (controller.signal.aborted) {
                console.error("Registration failed due to timeout.")
                setToastMessage("Registration failed. Request timed out.")
            } else {
                console.error("Registration failed:", error)
                setToastMessage("Registration failed. Please try again.")
            }
            setToastType("error")
            setShowToast(true)
            setLoading(false)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        route.push("/login")
    }

    return (
        <main className="register-wrapper">
            {loading && <Loading />}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
            {showModal && (
                <Modal
                    title="Account Created"
                    details="Your account has been created successfully."
                    buttons={[<button onClick={handleCloseModal}>OK</button>]}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    className="success-modal"
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
                                label="Firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                autoFocus
                                className={inputStyles.firstname}
                            />
                            <InputBox
                                type="text"
                                name="lastname"
                                placeholder="Lastname"
                                label="Lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className={inputStyles.lastname}
                            />
                        </div>

                        <div
                            className="input-with-tooltip"
                            onMouseEnter={() => setShowTooltip("username")}
                            onMouseLeave={() => setShowTooltip(null)}
                        >
                            <InputBox
                                type="text"
                                name="username"
                                placeholder="Username"
                                label="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={inputStyles.username}
                            />
                            {showTooltip === "username" && (
                                <div className="tooltip">
                                    Username must be at least 3 characters long,
                                    consist of lowercase letters only, and may
                                    include periods (.) and/or underscores (_).
                                </div>
                            )}
                        </div>

                        <InputBox
                            type="text"
                            name="email"
                            placeholder="Email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={inputStyles.email}
                        />

                        <div
                            className="input-with-tooltip"
                            onMouseEnter={() => setShowTooltip("password")}
                            onMouseLeave={() => setShowTooltip(null)}
                        >
                            <InputBox
                                type="password"
                                name="password"
                                placeholder="Password"
                                label="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={inputStyles.password}
                            />
                            {showTooltip === "password" && (
                                <div className="tooltip">
                                    Password must be at least 8 characters long,
                                    include uppercase and lowercase letters, a
                                    number, and a special character.
                                </div>
                            )}
                        </div>

                        <InputBox
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={inputStyles.confirmPassword}
                        />
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            required
                            className={inputStyles.userType}
                        >
                            <option disabled value="">
                                --Select Type--
                            </option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" disabled={!validateForm()}>
                        Register
                    </button>

                    <div className="register-link_group">
                        <span>
                            Already have an account?
                            <Link href="/login" className="link-signup">
                                Sign in
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
    )
}

export default Register
