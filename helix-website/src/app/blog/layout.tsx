import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ReactNode } from 'react'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto min-h-screen px-4 py-32">
        {children}
      </main>
      <Footer />
    </div>
  )
}