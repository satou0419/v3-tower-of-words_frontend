/**
 * @typedef {'primary' | 'secondary' | 'danger'} ButtonVariant
 */

import React from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css";
import classNames from "classnames";

/**
 * Button component
 * @param {Object} props - Component props
 * @param {ButtonVariant} props.variant - The variant of the button
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - The size of the button
 * @param {boolean} [props.rounded=false] - Whether the button should have rounded corners
 * @param {string} [props.className=''] - Additional CSS classes for the button
 * @param {React.ReactNode} [props.children='Button'] - The content of the button
 * @param {string} [props.type='button'] - The type of the button
 * @param {function} [props.onClick] - The onClick handler for the button
 * @returns {JSX.Element} Button component
 */
const Button = ({
    variant = "primary",
    size = "medium",
    rounded = false,
    children = "Button",
    className = "",
    type = "button",
    onClick,
}) => {
    const buttonClass = classNames(
        styles.btn,
        {
            [styles.btnPrimary]: variant === "primary",
            [styles.btnSecondary]: variant === "secondary",
            [styles.btnDanger]: variant === "danger",
            [styles.btnSmall]: size === "small",
            [styles.btnMedium]: size === "medium",
            [styles.btnLarge]: size === "large",
            [styles.btnRounded]: rounded,
        },
        className
    );

    return (
        <button className={buttonClass} type={type} onClick={onClick}>
            {children}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    rounded: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
