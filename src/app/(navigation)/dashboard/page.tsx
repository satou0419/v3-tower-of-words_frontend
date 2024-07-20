"use client";

import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";
import useUserInfoStore from "@/store/userInfoStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import { useEffect } from "react";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";

export default function Dashboard() {
    const { userType } = useUserInfoStore.getState();
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );

    useEffect(() => {
        getUserDetails();
    }, []);
    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Floor Completed"
                    progressValue={userDashboard.floorCount}
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
            <CardArchive
                badgesCount={userDashboard.achievementCount}
                wordsCount={userDashboard.wordsCollected}
            />
        </main>
    );
}
