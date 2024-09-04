import React from "react"
import "./navlayout.css"
import Navigation from "../component/Navigation/Navigation"

export default function NavigationLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="nav-layout-wrapper">
            <Navigation />
            <div className="content-wrapper">{children}</div>
        </div>
    )
}
