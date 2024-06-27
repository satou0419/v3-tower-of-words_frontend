import React, { ReactNode, InputHTMLAttributes } from "react";
import "./input.scss";

// Define the prop types for the main Input container
interface InputProps {
    children: ReactNode;
    className?: string;
    [key: string]: any;
}

// Extend InputHTMLAttributes to allow all input props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export default function Input({
    children,
    className = "",
    ...props
}: InputProps) {
    return (
        <main className={`input-container ${className}`} {...props}>
            {children}
        </main>
    );
}

export function InputBox({ className = "", ...props }: InputFieldProps) {
    return (
        <input type="text" className={`input-box ${className}`} {...props} />
    );
}

export function InputLine({ className = "", ...props }: InputFieldProps) {
    return (
        <input type="text" className={`input-line ${className}`} {...props} />
    );
}
