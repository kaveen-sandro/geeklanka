import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Geek Lanka',
  description: 'Tech news and articles for Sri Lanka and the world',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
