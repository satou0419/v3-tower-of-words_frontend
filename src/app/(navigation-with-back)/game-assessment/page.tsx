"use client"

import React, { useEffect, useState } from "react"
import CardTab from "@/app/component/Card/CardTab/CardTab"
import "./gameassessment.scss"
import { useRouter, useSearchParams } from "next/navigation"
import viewSimulationAssessment from "@/lib/assessment-endpoint/viewSimulationAssessment"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import updateGameAssessment from "@/lib/assessment-endpoint/updateGameAssessment"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function GameAssessment() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const simulationIDParam = searchParams.get("simulationID")
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN

    const [assessmentData, setAssessmentData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAssessmentData = async () => {
            try {
                setLoading(true)
                const data = await viewSimulationAssessment(simulationID)
                updateGameAssessment(simulationID)
                console.log(data)
                setAssessmentData(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching assessment data:", error)
                setError("Failed to fetch assessment data.")
                setLoading(false)
            }
        }

        if (!isNaN(simulationID)) {
            fetchAssessmentData()
        }
    }, [simulationID])

    const chartData = {
        labels: assessmentData
            ? [
                  `Number of Participants: ${assessmentData.numberOfParticipants}`,
                  `Number of Missed Participants: ${assessmentData.missedTakers}`,
                  `Simulation Accuracy Rate: ${assessmentData.simulationAccruracyRate}`,
                  `Simulation Duration Average: ${assessmentData.simulationDurationAverage}`,
              ]
            : [
                  "Number of Participants",
                  "Number of Missed Participants",
                  "Simulation Accuracy Rate",
                  "Simulation Duration Average",
              ],
        datasets: [
            {
                label: "Assessment Data",
                data: assessmentData
                    ? [
                          assessmentData.numberOfParticipants,
                          assessmentData.missedTakers,
                          assessmentData.simulationAccruracyRate,
                          assessmentData.simulationDurationAverage,
                      ]
                    : [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    }

    const chartOptions = {
        indexAxis: "y" as const, // Make sure to use 'y' or 'x'
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                grid: {
                    display: false, // Hides the y-axis grid lines
                },
            },
        },
    }

    return (
        <main className="gameassessment-wrapper">
            <section className="gameassessment-container">
                <CardTab
                    className="cardtab"
                    title="Game Assessment"
                    subtitle={
                        assessmentData ? assessmentData.totalParticipants : "0"
                    }
                >
                    <section className="gameassessment-content">
                        <section className="gameassessment-details">
                            <span className="gameassessment-data">
                                <div>Number of Participants</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.numberOfParticipants
                                        : "0"}
                                </div>
                            </span>
                            <span className="gameassessment-data">
                                <div>Number of Missed Participants</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.missedTakers
                                        : "0"}
                                </div>
                            </span>
                            <span className="gameassessment-data">
                                <div>Simulation Accuracy Rate</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.simulationAccruracyRate
                                        : "0"}
                                </div>
                            </span>
                            <span className="gameassessment-data">
                                <div>Simulation Duration Average</div>
                                <div>
                                    {assessmentData
                                        ? assessmentData.simulationDurationAverage
                                        : "0"}
                                </div>
                            </span>
                        </section>
                        <section className="gameassessment-graph">
                            <Bar data={chartData} options={chartOptions} />
                        </section>
                    </section>
                </CardTab>
            </section>
        </main>
    )
}
