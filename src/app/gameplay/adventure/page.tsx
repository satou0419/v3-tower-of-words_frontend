"use client";
import { useEnemyStore } from "@/store/enemyStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const AdventureGameplay = () => {
    const searchParams = useSearchParams();
    const floorId = searchParams.get("floorId");
    const { enemies, fetchEnemies } = useEnemyStore();
    const [enemyData, setEnemyData] = useState<any | null>(null);
    const [attackType, setAttackType] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [idleFrame, setIdleFrame] = useState<string>("");
    const [attackFrame, setAttackFrame] = useState<string>("");

    useEffect(() => {
        if (floorId) {
            fetchEnemies(Number(floorId));
        }
    }, [floorId, fetchEnemies]);

    useEffect(() => {
        if (enemies.length > 0) {
            setEnemyData(enemies[0]);
        }
    }, [enemies]);

    useEffect(() => {
        if (enemyData) {
            const parsedData = parseImagePath(enemyData.imagePath);
            setAttackType(parsedData.attackType);
            setName(parsedData.name);
            setIdleFrame(parsedData.idleFrame);
            setAttackFrame(parsedData.attackFrame);
        }
    }, [enemyData]);

    const parseImagePath = (path: string) => {
        // Remove the initial '&' if present
        if (path.startsWith("&")) {
            path = path.slice(1);
        }

        const attackType = path.substring(0, path.indexOf("_"));
        const name = path.substring(path.indexOf("_") + 1, path.indexOf("-"));
        const idleFrame = path.substring(
            path.indexOf("-i") + 2,
            path.indexOf("-a")
        );
        const attackFrame = path.substring(path.indexOf("-a") + 2);

        return { attackType, name, idleFrame, attackFrame };
    };

    if (!floorId || !enemyData) {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <h1>Floor ID: {floorId}</h1>
            <div>
                <span>Words: {enemyData.words.join(", ")}</span>
            </div>
            <div>
                <span>Enemy: {enemyData.imagePath}</span>
            </div>
            <div>
                <span>Attack Type: {attackType}</span>
            </div>
            <div>
                <span>Name: {name}</span>
            </div>
            <div>
                <span>Idle Frame: {idleFrame}</span>
            </div>
            <div>
                <span>Attack Frame: {attackFrame}</span>
            </div>
        </main>
    );
};

export default AdventureGameplay;
