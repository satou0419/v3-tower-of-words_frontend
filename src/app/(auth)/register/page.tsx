import { InputBox } from "@/app/component/Input/Input";
import "./register.scss";
import Link from "next/link";

export default function Register() {
    return (
        <main className="register-wrapper">
            <section className="register-container">
                <section className="register-banner">
                    <img src="assets/images/banner/banner_register.webp" />
                </section>
                <form className="register-form">
                    <h1>Create Account</h1>

                    <div className="register-input_group">
                        <div className="register-fullname_group">
                            <InputBox
                                type="text"
                                name="firstname"
                                placeholder="Firstname"
                                id=""
                            />
                            <InputBox
                                type="text"
                                name="lastname"
                                placeholder="Lastname"
                                id=""
                            />
                        </div>

                        <InputBox
                            type="text"
                            placeholder="Username"
                            name="username"
                            id=""
                        />
                        <InputBox
                            type="password"
                            placeholder="Password"
                            name="password"
                            id=""
                        />
                        <InputBox
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            id=""
                        />
                        <select name="userType" id="">
                            <option disabled>Select Type</option>
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
}
