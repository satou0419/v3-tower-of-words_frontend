"use client"
import useUserInfoStore from "@/store/userInfoStore"
import "./gamemode.scss"
import { useRouter, useSearchParams } from "next/navigation"

export default function GameMode() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { userType } = useUserInfoStore.getState()
    const roomIDParam = searchParams.get("roomID")
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : null

    const handleGameModeClick = (type: string) => {
        const settings = localStorage.getItem("settings")
        let updatedSettings: {
            roomID?:
                | {
                      roomID?: number | null
                  }
                | undefined
            simulationType?: string
        } = {}

        if (settings) {
            try {
                updatedSettings = JSON.parse(settings) || {}
            } catch (error) {
                console.error("Failed to parse settings:", error)
            }
        }

        updatedSettings.simulationType = type
        if (!updatedSettings.roomID) {
            updatedSettings.roomID = { roomID: null }
        }

        updatedSettings.roomID.roomID = roomID

        localStorage.setItem("settings", JSON.stringify(updatedSettings))

        if (roomID === 0) {
            router.push(`/${userType.toLowerCase()}-room`)
        } else {
            router.push(`/create-game/my-word`)
        }
    }

    return (
        <main className="gamemode-wrapper">
            <section className="buttons-container">
                <button
                    onClick={() => router.push("/clone")}
                    className="clone-button"
                >
                    Clone a Game
                </button>
            </section>

            <section className="gamemode-container">
                <section className="gamemode-content">
                    <h1>Choose Game Mode</h1>
                    <section className="gamemode-option">
                        <div onClick={() => handleGameModeClick("Spelling")}>
                            Spelling Game
                        </div>
                        <div onClick={() => handleGameModeClick("Syllable")}>
                            Syllable Game
                        </div>
                        <div onClick={() => handleGameModeClick("Silent")}>
                            Silent Game
                        </div>
                    </section>
                </section>
            </section>
        </main>
    )
}
