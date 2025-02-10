import "@/app/globals.css"
import Background from "@/components/Background"
import { Sidebar } from "lucide-react"
import { Inter } from "next/font/google"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/* <aside className="border-r bg-background/50 backdrop-blur">
      </aside> */}
        {/* <Sidebar /> */}
        {children}
        </body>
    </html>
  )
}

