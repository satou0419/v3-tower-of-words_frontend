import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: {
        template: "%s | Tower of Words",
        default: "Tower of Words",
    },
    description: "The official site of Tower of Words.",
    openGraph: {
        title: "Tower of Words",
        description:
            "A web application gamified spelling activities for individual learners, aiming to enhance their literacy skills by implementing features such as audio pronunciation, vocabulary, and definitions, thus promoting an enjoyable learning environment.",
        url: "https://tower-of-words.vercel.app", // Replace with your actual URL
        siteName: "Tower of Words",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
