import React from "react";
import "./navlayout.css";
import Navigation from "../component/Navigation/Navigation";

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Tower of Words',
    default: 'Tower of Words Dashboard',
  },
  description: 'The official site of Tower of Words.'
};

// export default function NavigationLayout({ children }) {
//     return (
//         <div className="nav-layout-wrapper">
//             <Navigation />
//             <div className="content-wrapper">{children}</div>
//         </div>
//     );
// }
export default function NavigationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="nav-layout-wrapper">
            <Navigation />
            <div className="content-wrapper">{children}</div>
        </div>
    );
}
