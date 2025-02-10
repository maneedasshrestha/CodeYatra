import { Geist } from "next/font/google"
import { ThemeProvider } from "next-themes"
import Link from "next/link"
import "@/app/globals.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Globe, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import { signOutAction } from "@/app/actions"
import "@/app/globals.css"
import type React from "react" // Added import for React

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Eco Grid",
  description: "The future",
}

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-black text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background text-foreground">
            <div className="flex">
              <aside className="fixed top-0 left-0 h-screen w-[280px] border-r bg-background/50 backdrop-blur">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                  <Wallet className="h-6 w-6" />
                  <span className="font-bold">EcoGrid</span>
                </div>
                <div className="px-4 py-4">
                  <Input placeholder="Search" className="bg-background/50" />
                </div>
                <nav className="space-y-2 px-2">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Link href="/protected/analysis">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/protected/map">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Globe className="h-4 w-4" />
                      Map
                    </Button>
                  </Link>
                  <Link href="/protected/chatbot">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-message-circle"
                      >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      </svg>
                      Eco Chat
                    </Button>
                  </Link>
                  <Link href="/protected/image">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-focus"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                      </svg>
                      Classification Model
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LifeBuoy className="h-4 w-4" />
                    Support
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <form onSubmit={signOutAction}>
                    <Button type="submit" variant={"outline"}>
                      Sign out
                    </Button>
                  </form>
                </nav>
              </aside>
              <main className="flex-1 ml-[280px] p-6 w-[calc(100%-280px)]">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

