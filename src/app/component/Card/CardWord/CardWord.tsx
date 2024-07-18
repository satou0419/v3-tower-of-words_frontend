import React, { ReactNode, useState } from "react";
import "./cardword.scss";
import { InputLine } from "../../Input/Input";

interface CardWordProps {
    className?: string;
    children?: ReactNode;
}

const CardWord: React.FC<CardWordProps> = ({ className, children }) => {
    const [searchWord, setSearchWords] = useState();

    return (
        <main className={className}>
            <section className="cardword-card">
                <div className="outer">
                    <div className="inner">
                        <InputLine
                            type="text"
                            placeholder="Search"
                            value={searchWord}
                        />
                        {children}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CardWord;
