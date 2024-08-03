"use client"
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./gamemode.scss";
import { useRouter } from 'next/navigation';

export default function GameMode() {
    const router = useRouter();

    const handleGameModeClick = (type: string) => {
        const settings = localStorage.getItem("settings");
        let updatedSettings = settings ? JSON.parse(settings) : {};
        updatedSettings.simulationType = type;
        localStorage.setItem("settings", JSON.stringify(updatedSettings));
        router.push('/create-game/my-word');
    };
    
    return (
        <main className="gamemode-wrapper">
            <section className="gamemode-container">
                <button onClick={() => router.back()} type="button">Back</button>

                <section className="gamemode-content">
                    <h1>Choose Game Mode</h1>
                    <section className="gamemode-option">
                        <div onClick={() => handleGameModeClick('Spelling')}>Spelling Game</div>
                        <div onClick={() => handleGameModeClick('Syllable')}>Syllable Game</div>
                        <div onClick={() => handleGameModeClick('Silent')}>Silent Game</div>
                    </section>
                </section>
            </section>
        </main>
    );
}
