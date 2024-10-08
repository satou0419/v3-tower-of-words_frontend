import React, { useEffect, useState } from "react"
import "./achievementToast.scss" // Add your CSS or SCSS file for styling

interface AchievementToastProps {
    message: string
    imageUrl: string
    onClose: () => void
}

const AchievementToast: React.FC<AchievementToastProps> = ({
    message,
    imageUrl,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true)

    // Close the toast after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            onClose()
        }, 3000)

        return () => {
            clearTimeout(timer)
        }
    }, [onClose])

    const handleClose = () => {
        setIsVisible(false)
        onClose()
    }

    return (
        <div className={`achievement-toast ${isVisible ? "show" : ""}`}>
            <div className="image">
                <img src={imageUrl} />
            </div>
            <div className="content">
                <span className="achievement-message">{message}</span>
            </div>
        </div>
    )
}

export default AchievementToast
