"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { warmUpServer } from "@/services/apiClient"
import "./globals.css"

// Ping backend on app load to wake up Render free-tier server
if (typeof window !== "undefined") warmUpServer()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Provider store={store}>
          {/* Header */}
          <header className="border-b bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.948V8a1 1 0 0 1 1-1h1.382a1 1 0 0 1 .894.553L20 10h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <div>
                <h1 className="text-lg font-bold leading-tight">Spotter ELD Trip Planner</h1>
                <p className="text-xs text-primary-foreground/70">HOS-compliant route planning</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
              Spotter ELD Trip Planner &mdash; Built with Next.js, Django &amp; FMCSA HOS Rules
            </div>
          </footer>
        </Provider>
      </body>
    </html>
  )
}
