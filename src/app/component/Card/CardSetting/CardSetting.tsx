import React from "react";
import { InputBox } from "../../Input/Input";
import "./cardsetting.scss";

interface CardSettingProps {
    title: string;
    namePlaceholder: string;
    timePlaceholder: string;
    deleteButtonLabel: string;
    saveButtonLabel: string;
    onDelete: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CardSetting: React.FC<CardSettingProps> = ({
    title,
    namePlaceholder,
    timePlaceholder,
    deleteButtonLabel,
    saveButtonLabel,
    onDelete,
    onSave,
}) => {
    return (
        <section className="cardsetting-card">
            <form onSubmit={onSave}>
                <h1>{title}</h1>
                <div className="input-group">
                    <InputBox type="text" placeholder={namePlaceholder} />
                    <InputBox
                        type="datetime-local"
                        placeholder={timePlaceholder}
                    />
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
