import React from "react"
import "./cardcharacterpreview.scss"
import CardWord from "@/app/component/Card/CardWord/CardWord"

interface CardCharacterPreviewProps {
    bannerClass: string
    equip?: boolean
    animation: string
    character: {
        attackType: string
        name: string
        attackFrame: number
        idleFrame: number
    }
    onAttackClick?: () => void
    onEquipClick?: () => void
}

const CardCharacterPreview: React.FC<CardCharacterPreviewProps> = ({
    bannerClass,
    equip,
    animation,
    character,
    onAttackClick,
    onEquipClick,
}) => {
    if (!character.name || !bannerClass) {
        return null
    }
    return (
        <div className="cardcharacterpreview-card">
            <section className="cardcharacterpreview-container">
                <CardWord
                    className={`cardcharacterpreview-banner ${bannerClass}`}
                >
                    <div className="banner-container">
                        <section className={`character-container`}>
                            <div
                                className={`character-sprite ${
                                    onAttackClick
                                        ? `attack-${character.name}`
                                        : `idle-${character.name}`
                                }`}
                                style={{
                                    position: "absolute",
                                    transform: "scale(0.6)",
                                    backgroundImage: `url("/assets/images/sprite/${character.name}.png")`,
                                    width: `360px`,
                                    height: `360px`,

                                    animation: `${
                                        onAttackClick
                                            ? `attack-${character.name}`
                                            : `idle-${character.name}`
                                    } calc(${
                                        onAttackClick
                                            ? `calc(${character.attackFrame}s / 12)`
                                            : `calc(${character.idleFrame}s / 12)`
                                    }) steps(${
                                        onAttackClick
                                            ? `${character.attackFrame}`
                                            : `${character.idleFrame}`
                                    }) infinite`,
                                }}
                            >
                                <style>{`${animation}`}</style>
                            </div>
                        </section>
                    </div>
                </CardWord>
                <button className="attack-button" onClick={onAttackClick}>
                    Attack
                </button>
                {onEquipClick &&
                    (equip ? (
                        <button className="equipped-button" disabled>
                            Equipped
                        </button>
                    ) : (
                        <button className="equip-button" onClick={onEquipClick}>
                            Equip
                        </button>
                    ))}
            </section>
        </div>
    )
}

export default CardCharacterPreview
