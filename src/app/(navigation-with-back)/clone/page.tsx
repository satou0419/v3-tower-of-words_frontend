"use client"
import React, { useEffect, useState } from "react"
import CardClone from "@/app/component/Card/CardClone/CardClone"
import { useRouter } from "next/navigation"
import "./clone.scss"
import { useRoomStore } from "@/store/roomStore"
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom"
import { viewSimulation } from "@/lib/simulation-endpoint/viewSimulation"
import Toast from "@/app/component/Toast/Toast"

export default function Clone() {
    const { currentRoom, rooms, setRoom } = useRoomStore()
    const router = useRouter()
    const [selectedSimulation, setSelectedSimulation] = useState<number>(0)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    )

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomData = await viewCreatedRoom()
                setRoom(roomData)
                console.log(rooms)
            } catch (error) {
                console.error("Failed to fetch rooms:", error)
            }
        }

        fetchRooms()
    }, [rooms, setRoom])

    const handleSimulationClick = (simulation: number) => {
        setSelectedSimulation((prevSelected) =>
            prevSelected === simulation ? 0 : simulation
        )
    }

    const handleCloneGame = async () => {
        if (selectedSimulation === 0) {
            setToastMessage("Please select a simulation to clone.")
            setToastType("warning")
            return
        }

        console.log("LICKED!", selectedSimulation)
        const simulation = await viewSimulation(selectedSimulation)

        const settings = {
            roomID: currentRoom,
            simulationType: simulation.simulationType,
            name: simulation.name,
            deadline: simulation.deadline,
            attackInterval: simulation.attackInterval,
            studentLife: simulation.studentLife,
            items: simulation.items,
            description: simulation.description,
            pronunciation: simulation.pronunciation,
            enemy: simulation.enemy,
        }

        console.log(settings)

        localStorage.setItem("settings", JSON.stringify(settings))
        localStorage.setItem("enemies", JSON.stringify(simulation.enemy))

        router.push("/create-game/my-word")
    }

    return (
        <section className="clone-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="buttons-container">
                <button className="clone-button" onClick={handleCloneGame}>
                    Clone a Game
                </button>
            </section>
            <section className="clone-container">
                {rooms.map((room) =>
                    room.simulations.map((simulation) => (
                        <CardClone
                            key={simulation.simulationID}
                            simulationName={simulation.name}
                            roomCode={room.code}
                            roomName={room.name}
                            roomID={room.roomID}
                            selected={
                                simulation.simulationID === selectedSimulation
                            }
                            onClick={() =>
                                handleSimulationClick(simulation.simulationID)
                            }
                        />
                    ))
                )}
            </section>
        </section>
    )
}
