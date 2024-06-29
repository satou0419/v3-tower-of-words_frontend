"use client";

import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";
import Link from "next/link";

export default function Dashboard() {
    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <Link href="#">
                    <CardMode
                        bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                        progressHeader="Floor Completed"
                        progressValue={2}
                        modeTitle="Adventure"
                        modeDescription="This is a custom description for the adventure."
                    />
                </Link>

                <Link href="#">
                    <CardMode
                        className="cardmode-simulation"
                        bannerSrc="/assets/images/banner/banner-simulation_large.webp"
                        progressHeader="Room"
                        progressValue={5}
                        modeTitle="Room"
                        modeDescription="This is a custom description for the room."
                    />
                </Link>
            </section>
            <CardArchive badgesCount={1} wordsCount={12} />
        </main>
    );
}
