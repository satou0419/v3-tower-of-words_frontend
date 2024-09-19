import { useState, useCallback, useEffect } from "react"
import enemyData from "../data/enemy.json" // Adjust the path as needed

// Define TypeScript type for the enemy data
interface EnemyData {
    enemies: string[]
}

const useRandomEnemy = () => {
    const [enemy, setEnemy] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Function to get a random enemy
    const getRandomEnemy = useCallback(() => {
        setLoading(true)
        const data: EnemyData = enemyData
        const enemies = data.enemies
        const randomIndex = Math.floor(Math.random() * enemies.length)
        setEnemy(enemies[randomIndex])
        setLoading(false)
    }, [])

    // Call getRandomEnemy to initialize the enemy
    useEffect(() => {
        getRandomEnemy()
    }, [getRandomEnemy])

    return { enemy, loading, refetch: getRandomEnemy }
}

export default useRandomEnemy
