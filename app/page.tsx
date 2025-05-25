import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ChatbotButton } from "@/components/chatbot-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <section className="w-full py-10 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Ready to find your perfect health insurance plan?
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl/relaxed lg:text-xl/relaxed">
                  Answer a few simple questions and get personalized recommendations
                </p>
              </div>
              <div className="mt-8">
                <Link href="/find-best-plan">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg">
                    Find Your Best Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
