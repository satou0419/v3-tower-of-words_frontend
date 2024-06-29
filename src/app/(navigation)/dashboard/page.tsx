"use client";

import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";

export default function Dashboard() {
    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Floor Completed"
                    progressValue={5}
                    modeTitle="Adventure"
                    modeDescription="This is a custom description for the adventure."
                />
                <CardMode
                    className="cardmode-simulation"
                    bannerSrc="/assets/images/banner/banner-simulation_large.webp"
                    progressHeader="Room"
                    progressValue={5}
                    modeTitle="Room"
                    modeDescription="This is a custom description for the adventure."
                />
            </section>
            <CardArchive
                archiveTitle="Archive"
                archiveDescription="Conquer the Towers! Collect Words and Badges in Adventure Mode!"
                badgesCount={8}
                wordsCount={12}
            />
        </main>
    );
}
