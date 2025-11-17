import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Health Insurance Guide - India",
  description: "Find the best health insurance plan for you and your family in India",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <ErrorBoundary>
              <main id="main-content">
                {children}
              </main>
            </ErrorBoundary>
            <Toaster position="top-right" richColors closeButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
