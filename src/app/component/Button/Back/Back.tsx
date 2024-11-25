"use client"
import { useRouter } from "next/navigation"
import "./back.scss"

interface BackButtonProps {
    customRoute?: string // Optional route prop
}

const BackButton: React.FC<BackButtonProps> = ({ customRoute }) => {
    const router = useRouter()

    const handleBackClick = () => {
        if (customRoute) {
            router.push(customRoute) // Navigate to the custom route if provided
        } else {
            router.back() // Fallback to the default behavior
        }
    }

    return (
        <button onClick={handleBackClick} className="back-button">
            Back
        </button>
    )
}

export default BackButton
