"use client";
import "./login.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import loginUser from "@/lib/auth-endpoint/loginUser";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import { InputBox } from "@/app/component/Input/Input";
import Link from "next/link";
import Loading from "@/app/loading";

export default function Login() {
    const route = useRouter();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        await loginUser(username, password);
        const data = await getAllItems();
        console.log(data);
        setLoading(false);
        route.push("/dashboard");
    };

    return (
        <main className="login-wrapper">
            {loading && <Loading />}
            <section className="login-container">
                <section className="login-banner">
                    <img src="assets/images/banner/banner_login.webp" />
                </section>
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Welcome!</h1>

                    <div className="login-input_group">
                        <InputBox
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                        <InputBox
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>

                    <div className="login-link_group">
                        <span>
                            Don't have an account yet?
                            <Link href="/register" className="link-signup">
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
