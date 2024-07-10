"use client";

import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";
import useUserInfoStore from "@/store/userInfoStore";

export default function Dashboard() {
    const { userType } = useUserInfoStore.getState();
    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Floor Completed"
                    progressValue={2}
                    modeTitle="Adventure"
                    modeDescription="This is a custom description for the adventure."
                    link="/tower/spelling"
                />

                <CardMode
                    className="cardmode-simulation"
                    bannerSrc="/assets/images/banner/banner-simulation_large.webp"
                    progressHeader="Room"
                    progressValue={5}
                    modeTitle="Room"
                    modeDescription="This is a custom description for the room."
                    link={`/${userType.toLowerCase()}-room`}
                />
            </section>
            <CardArchive badgesCount={1} wordsCount={12} />
        </main>
    );
}
