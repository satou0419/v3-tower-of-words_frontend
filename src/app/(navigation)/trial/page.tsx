"use client";
import React, { useEffect, useState } from "react";
import "./trial.scss";
import useMerriam from "@/hook/useMerriam";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import useUserProgressStore from "@/store/userProgressStore";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import useSimulationDetails from "@/hook/useSimulationDetails";

export default function Trial() {
    const simulationDetails = useSimulationDetails(4);
    console.log("Enemies", simulationDetails.simulationDetails?.enemy);

    return <></>;
}
