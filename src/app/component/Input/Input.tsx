import React, {
    ReactNode,
    InputHTMLAttributes,
    forwardRef,
    useState,
} from "react"
import "./input.scss"

// Define the prop types for the main Input container
interface InputProps {
    children: ReactNode
    className?: string
    label?: string // Added label here
    [key: string]: any
}

// Extend InputHTMLAttributes to allow all input props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string
    label?: string // Added label here
}

const Input = ({ children, className = "", ...props }: InputProps) => {
    return (
        <main className={`input-container ${className}`} {...props}>
            {children}
        </main>
    )
}

const InputBox = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className = "", type = "text", label, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false) // State to track focus

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true) // Set focus state
            if (props.onFocus) props.onFocus(event) // Call onFocus if provided
        }

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            if (!props.value) setIsFocused(false) // Clear focus if input is empty
            if (props.onBlur) props.onBlur(event) // Call onBlur if provided
        }

        return (
            <div className="input-wrapper">
                <input
                    type={type}
                    className={`input-box ${className} ${
                        isFocused ? "focused" : ""
                    }`}
                    {...props}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder=""
                />
                <label
                    className={`input-label ${
                        isFocused || props.value ? "filled" : ""
                    }`}
                >
                    {label}
                </label>
            </div>
        )
    }
)

const InputLine = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className = "", type = "text", label, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false) // State to track focus

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true) // Set focus state
            if (props.onFocus) props.onFocus(event) // Call onFocus if provided
        }

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            if (!props.value) setIsFocused(false) // Clear focus if input is empty
            if (props.onBlur) props.onBlur(event) // Call onBlur if provided
        }

        return (
            <div className="input-wrapper">
                <input
                    type={type}
                    className={`input-line ${className} ${
                        isFocused ? "focused" : ""
                    }`}
                    {...props}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <label
                    className={`input-label ${
                        isFocused || props.value ? "filled" : ""
                    }`}
                >
                    {label}
                </label>
            </div>
        )
    }
)

export default Input
export { InputBox, InputLine }
