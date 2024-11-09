"use client"
import { useRouter } from "next/navigation"
import "./back.scss"

const BackButton = () => {
    const router = useRouter()

    const handleBackClick = () => {
        router.back()
    }

    return (
        <button onClick={handleBackClick} className="back-button">
            Back
        </button>
    )
}

export default BackButton
