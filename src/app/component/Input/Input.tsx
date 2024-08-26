import React, { ReactNode, InputHTMLAttributes, forwardRef } from "react"
import "./input.scss"

// Define the prop types for the main Input container
interface InputProps {
    children: ReactNode
    className?: string
    [key: string]: any
}

// Extend InputHTMLAttributes to allow all input props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

const Input = ({ children, className = "", ...props }: InputProps) => {
    return (
        <main className={`input-container ${className}`} {...props}>
            {children}
        </main>
    )
}

const InputBox = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className = "", type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                className={`input-box ${className}`}
                {...props}
                ref={ref}
            />
        )
    }
)

const InputLine = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className = "", type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                className={`input-line ${className}`}
                {...props}
                ref={ref}
            />
        )
    }
)

export default Input
export { InputBox, InputLine }
