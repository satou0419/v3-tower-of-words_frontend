// components/StudentChart.tsx
"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StudentData {
    studentId: number;
    averageDuration: number;
    averageAccuracy: number;
}

interface StudentChartProps {
    data: StudentData;
}

const StudentChart: React.FC<StudentChartProps> = ({ data }) => {
    const durationData = {
        labels: ["Average Duration (minutes)", "Remaining"],
        datasets: [
            {
                data: [data.averageDuration, 100 - data.averageDuration],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(200, 200, 200, 0.2)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(200, 200, 200, 0.2)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const accuracyData = {
        labels: ["Average Accuracy (%)", "Remaining"],
        datasets: [
            {
                data: [data.averageAccuracy, 100 - data.averageAccuracy],
                backgroundColor: [
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(200, 200, 200, 0.2)",
                ],
                borderColor: [
                    "rgba(153, 102, 255, 1)",
                    "rgba(200, 200, 200, 0.2)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "bottom" as const,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "200px",
                    height: "200px",
                }}
            >
                <Doughnut data={durationData} options={options} />
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <strong>{data.averageDuration}</strong>
                </div>
            </div>
            <div
                style={{
                    position: "relative",
                    width: "200px",
                    height: "200px",
                }}
            >
                <Doughnut data={accuracyData} options={options} />
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <strong>{data.averageAccuracy}%</strong>
                </div>
            </div>
        </div>
    );
};

export default StudentChart;
