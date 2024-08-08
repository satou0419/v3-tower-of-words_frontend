"use client";

import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./studentassessment.scss";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useStudentInfo from "@/hook/useStudentInfo";
import viewStudentAssessment from "@/lib/assessment-endpoint/viewStudentAssessment";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function StudentAssessment() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN;

    const studentIDParam = searchParams.get("studentID");
    const studentID = studentIDParam ? parseInt(studentIDParam, 10) : NaN;

    const [assessmentData, setAssessmentData] = useState<any>(null);

    const user = useStudentInfo(studentID);

    console.log(simulationID);
    console.log(studentID);
    useEffect(() => {
        const fetchAssessmentData = async () => {
            try {
                const data = await viewStudentAssessment(
                    simulationID,
                    studentID
                );
                console.log(data);
                setAssessmentData(data);
            } catch (error) {
                console.error("Error fetching assessment data:", error);
            }
        };

        if (!isNaN(simulationID) && !isNaN(studentID)) {
            fetchAssessmentData();
        }
    }, [simulationID, studentID]);

    const chartData = {
        labels: assessmentData
            ? [
                  `Accuracy: ${assessmentData.accuracy.toFixed(2)}`,
                  `Duration: ${assessmentData.duration.toFixed(2)}`,
                  `Mistakes: ${assessmentData.mistakes.toFixed(2)}`,
                  `Score: ${assessmentData.score}`,
              ]
            : ["Accuracy", "Duration", "Mistakes", "Score "],
        datasets: [
            {
                label: "Assessment Data",
                data: assessmentData
                    ? [
                          assessmentData.accuracy,
                          assessmentData.mistake,
                          assessmentData.duration,
                          assessmentData.score,
                      ]
                    : [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        console.log("Student Assessment Data", chartData);
    });

    const handleWordProgress = () => {
        router.push(
            `/student-word-progress?simulationID=${simulationID}&studentID=${studentID}`
        );
    };

    return (
        <main className="studentassessment-wrapper">
            <section className="studentassessment-container">
                <div className="studentassessment-buttons">
                    <button
                        className="button-back"
                        onClick={() => router.back()}
                        type="button"
                    >
                        Back
                    </button>
                    <h1>{user.studentInfo?.data?.username}</h1>
                    <button
                        className="button-next"
                        onClick={handleWordProgress}
                        type="button"
                    >
                        Word Progress
                    </button>
                </div>
                <CardTab
                    className="cardtab"
                    title="Student Assessment"
                    subtitle={
                        assessmentData
                            ? assessmentData.done
                                ? "DONE"
                                : "ONGOING"
                            : "0"
                    }
                >
                    <section className="studentassessment-content">
                        <section className="studentassessment-details">
                            <span className="studentassessment-data">
                                <div>Accuracy</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.accuracy
                                        : "0"}
                                </div>
                            </span>
                            <span className="studentassessment-data">
                                <div>Duration</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.duration
                                        : "0"}
                                </div>
                            </span>
                            <span className="studentassessment-data">
                                <div>Mistake</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.mistake
                                        : "0"}
                                </div>
                            </span>
                            <span className="studentassessment-data">
                                <div>Score</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.score
                                        : "0"}
                                </div>
                            </span>
                        </section>
                        <section className="studentassessment-graph">
                            <Bar data={chartData} />
                        </section>
                    </section>
                </CardTab>
            </section>
        </main>
    );
}
