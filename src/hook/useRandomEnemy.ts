import { useState, useCallback, useEffect } from "react"
import enemyData from "../data/enemy.json" // Adjust the path as needed

// Define TypeScript type for the enemy data
interface EnemyData {
    enemies: string[]
}

const useRandomEnemy = () => {
    const [enemy, setEnemy] = useState<string | null>(null)

    // Function to get a random enemy
    const getRandomEnemy = useCallback(() => {
        const data: EnemyData = enemyData
        const enemies = data.enemies
        const randomIndex = Math.floor(Math.random() * enemies.length)
        setEnemy(enemies[randomIndex])
    }, [])

    // Call getRandomEnemy to initialize the enemy
    useEffect(() => {
        getRandomEnemy()
    }, [getRandomEnemy])

    return { enemy, refetch: getRandomEnemy }
}

export default useRandomEnemy
