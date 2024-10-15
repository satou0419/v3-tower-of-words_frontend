import Link from "next/link";
import "./landing.scss";

export default function Landing() {
    return (
        <main className="landing">
            <section className="landing__container">
                <div className="landing__banner">
                    <nav className="landing__nav">
                        <img src="/assets/images/logo/logo_simple.webp" />
                        <div className="links">
                            <Link href="#about_us" className="landing-aboutus">
                                ABOUT US
                            </Link>
                            <Link href="/register" className="landing-register">
                                SIGN UP
                            </Link>
                            <Link href="/login" className="landing-login">
                                SIGN IN
                            </Link>
                        </div>
                    </nav>

                    <section className="landing__intro">
                        <img
                            src="/assets/images/landing/landing-logo.png"
                            alt="Landing Logo"
                        />

                        <div className="landing__description">
                            <h1>What is Tower of Words?</h1>
                            <span>
                                a web application gamified spelling activities
                                for individual learners, aiming to enhance their
                                literacy skills by implementing features such as
                                audio pronunciation, vocabulary, and
                                definitions, thus promoting an enjoyable
                                learning environment. This application, which
                                focuses on spelling activities, serves as an
                                amplifier for their other literary skills.
                            </span>
                        </div>
                    </section>
                </div>

                <section className="landing__adventure">
                    <div className="landing__details">
                        <div className="landing__description">
                            <h1>Adventure Mode</h1>
                            <span>
                                Jump into an exciting adventure where you take
                                on the floor guardian and tackle different
                                tests. Boost your spelling and reading
                                abilities, spot letters that are hidden, and
                                take down all the cyborg guys to win on each
                                floor. See how good you are and step up to the
                                task!
                            </span>
                        </div>
                        <img
                            src="/assets/images/landing/land-adventure.png"
                            alt="Adventure Mode"
                        />
                    </div>
                    <img
                        src="/assets/images/landing/land-adventure-features.webp"
                        alt="Adventure Features"
                    />
                </section>

                <section className="landing__items">
                    <img
                        src="/assets/images/landing/land-items.png"
                        alt="Items"
                    />
                    <div className="landing__description">
                        <h1>Items to aid you</h1>
                        <span>
                            Did your opponent beat you? Don't worry! These items
                            will give you an edge. Get your health back, find
                            weak spots, and change the game to your advantage.
                            Grab everything you can and jump back into the
                            action tougher than before!
                        </span>
                    </div>
                </section>

                <section className="landing__simulation">
                    <div className="landing__details">
                        <div className="landing__description">
                            <h1>Simulations</h1>
                            <span>
                                Want to be in charge? Make your own spelling
                                quests and test your students with tailor-made
                                games. You craft the setting, come up with the
                                tasks, and see your students take them on with
                                the same fun gameplay you enjoy. Let's turn
                                learning into an adventure that's all your own!
                            </span>
                        </div>
                        <img
                            src="/assets/images/landing/land-simulation.webp"
                            alt="Simulations"
                        />
                    </div>
                    <img
                        src="/assets/images/landing/land-simulation-features.webp"
                        alt="Simulation Features"
                    />
                </section>

                <section className="landing__about" id="about_us">
                    <h1>About Us</h1>
                    <div className="landing__developers">
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/anton.png"
                                        alt="Anton Joseph Cruz"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Anton Joseph Cruz</span>
                                    <span>Leader/Backend Developer</span>
                                </div>
                            </div>
                        </div>
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/yabao.png"
                                        alt="Gil Joshua S. Yabao"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Gil Joshua S. Yabao</span>
                                    <span>
                                        Graphic Designer/Backend Developer
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/lorenz.jpg"
                                        alt="Jhon Lorenz Pabroa"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Jhon Lorenz E. Pabroa</span>
                                    <span>Secretary/Backend Developer</span>
                                </div>
                            </div>
                        </div>
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/mar.png"
                                        alt="Rey Mar Segalle"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Rey Mar R. Segalle</span>
                                    <span>UI Designer</span>
                                </div>
                            </div>
                        </div>
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/trisha.png"
                                        alt="Trisha Mae E. Rivera"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Trisha Mae E. Rivera</span>
                                    <span>Documentation</span>
                                </div>
                            </div>
                        </div>
                        <div className="landing__profile">
                            <div className="landing__title">
                                <div className="landing__profile-img">
                                    <img
                                        src="/assets/images/developer/reyd.jpg"
                                        alt="Rey Dante G. Garcia"
                                    />
                                </div>

                                <div className="landing__name">
                                    <span>Rey Dante G. Garcia</span>
                                    <span>Frontend Developer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="landing__footer">
                    <img
                        src="/assets/images/landing/land-footer.webp"
                        alt="Footer"
                    />
                </footer>
            </section>
        </main>
    );
}
