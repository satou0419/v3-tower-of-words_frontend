import React from "react"
import "./navlayout.css"
import Navigation from "../component/Navigation/Navigation"
import BackButton from "../component/Button/Back/Back"

export default function NavigationLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="nav-layout-wrapper">
            <Navigation />
            <div className="content-wrapper">
                <div className="btn-container">
                    <BackButton />
                </div>
                {children}
            </div>
        </div>
    )
}
