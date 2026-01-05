import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AIChatWidget } from "@/components/AIChatWidget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terrasinus - Cucina di Pesce a Terrasini",
  description: "Terrasinus, ristorante di pesce a Terrasini, Sicilia. Cucina tradizionale siciliana con ingredienti freschi del territorio.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}

