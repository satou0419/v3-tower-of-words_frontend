import React from "react";
import { InputBox } from "../../Input/Input";
import "./cardsetting.scss";

interface InputConfig {
    type: string;
    placeholder: string;
}

interface CardSettingProps {
    title: string;
    inputs: InputConfig[];
    deleteButtonLabel: string;
    saveButtonLabel: string;
    onDelete: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => void;
    className?: string; // Optional className prop
}

const CardSetting: React.FC<CardSettingProps> = ({
    title,
    inputs,
    deleteButtonLabel,
    saveButtonLabel,
    onDelete,
    onSave,
    className,
}) => {
    return (
        <section className={`cardsetting-card ${className || ""}`}>
            <form onSubmit={onSave}>
                <h1>{title}</h1>
                <div className="input-group">
                    {inputs.map((input, index) => (
                        <InputBox
                            key={index}
                            type={input.type}
                            placeholder={input.placeholder}
                        />
                    ))}
                </div>

                <div className="button-group">
                    <button type="button" onClick={onDelete}>
                        {deleteButtonLabel}
                    </button>
                    <button type="submit">{saveButtonLabel}</button>
                </div>
            </form>
        </section>
    );
};

export default CardSetting;
