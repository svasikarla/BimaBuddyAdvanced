/**
 * BimaBuddy Advanced - Landing Page
 * Professional, clean design showcasing all features
 */

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ChatbotButton } from "@/components/chatbot-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import Link from "next/link"
import {
  Brain,
  Mic,
  Activity,
  TrendingUp,
  Shield,
  BookOpen,
  Sparkles,
  Globe,
  Target,
  CheckCircle2,
  ArrowRight,
  Zap,
  Heart,
  Award,
  Users,
  Clock,
  BarChart3,
  Quote,
  Star,
  ChevronRight
} from "lucide-react"

export default function Home() {
  const features = [
    {
      href: "/voice-assistant",
      icon: Mic,
      iconGradient: "from-purple-500 to-pink-500",
      title: "Voice Assistant",
      badge: { text: "NEW", class: "bg-purple-50 text-purple-700 border-purple-300" },
      description: "Speak in your native language across 10 Indian languages",
      points: ["95%+ transcription accuracy", "Emotion-aware responses", "1.1B+ speakers covered"],
      hoverColor: "purple-500"
    },
    {
      href: "/claim-intelligence",
      icon: Brain,
      iconGradient: "from-blue-500 to-cyan-500",
      title: "Claim Intelligence Pro",
      badge: { text: "AI", class: "bg-blue-50 text-blue-700 border-blue-300" },
      description: "Predict claim approval with 85%+ accuracy before filing",
      points: ["50+ factor analysis", "Document gap detection", "40% denial reduction"],
      hoverColor: "blue-500"
    },
    {
      href: "/wellness",
      icon: Activity,
      iconGradient: "from-green-500 to-emerald-500",
      title: "Wellness Rewards",
      badge: { text: "12% OFF", class: "bg-green-50 text-green-700 border-green-300" },
      description: "Track fitness, earn points, get premium discounts",
      points: ["Connect 150+ fitness trackers", "Earn points for activities", "Up to 12% discount"],
      hoverColor: "green-500"
    },
    {
      href: "/analytics",
      icon: BarChart3,
      iconGradient: "from-orange-500 to-red-500",
      title: "Analytics Dashboard",
      badge: null,
      description: "Visualize policy data with interactive charts",
      points: ["Premium comparison charts", "Coverage breakdown", "AI-powered insights"],
      hoverColor: "orange-500"
    },
    {
      href: "/compare-plans",
      icon: TrendingUp,
      iconGradient: "from-indigo-500 to-purple-500",
      title: "Smart Comparison",
      badge: null,
      description: "Compare plans side-by-side with AI recommendations",
      points: ["50+ plans from top insurers", "Feature-by-feature analysis", "Best value recommendations"],
      hoverColor: "indigo-500"
    },
    {
      href: "/policy-school",
      icon: BookOpen,
      iconGradient: "from-yellow-500 to-orange-500",
      title: "Policy School",
      badge: null,
      description: "Learn insurance basics in simple terms",
      points: ["Easy-to-understand guides", "Video tutorials", "Common terms explained"],
      hoverColor: "yellow-500"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Statistics Banner */}
          <section className="w-full py-16 md:py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="container px-4 md:px-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                {[
                  { value: 50, suffix: "+", label: "Insurance Plans" },
                  { value: 10, suffix: "", label: "Indian Languages" },
                  { value: 85, suffix: "%", label: "Prediction Accuracy" },
                  { value: 1.1, decimals: 1, suffix: "B+", label: "Voice Coverage" }
                ].map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} duration={2000} />
                    </div>
                    <div className="text-sm md:text-base text-blue-100 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-20 md:py-28 bg-white">
            <div className="container px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Complete Insurance Solution
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Everything You Need in One Platform
                </h2>
                <p className="text-lg text-gray-600">
                  From AI-powered recommendations to wellness rewards, we've built the most comprehensive health insurance platform in India
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Link key={index} href={feature.href} className="group">
                      <div className="h-full bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Title & Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                          {feature.badge && (
                            <Badge variant="outline" className={`${feature.badge.class} text-xs`}>
                              {feature.badge.text}
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6">{feature.description}</p>

                        {/* Points */}
                        <ul className="space-y-3 mb-6">
                          {feature.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Link */}
                        <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                          Learn more
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="w-full py-20 md:py-28 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Get Covered in 4 Simple Steps
                </h2>
                <p className="text-lg text-gray-600">
                  Our AI-powered platform makes finding the right insurance plan quick and effortless
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {[
                  { num: "01", title: "Share Your Needs", desc: "Tell us about your age, family size, and health requirements" },
                  { num: "02", title: "AI Analysis", desc: "Our AI instantly matches you with the best-suited plans" },
                  { num: "03", title: "Compare & Choose", desc: "Review detailed comparisons and select your perfect plan" },
                  { num: "04", title: "Instant Coverage", desc: "Get your digital policy delivered immediately" }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.num}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="w-full py-20 md:py-28 bg-white">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Trusted by Thousands of Indians
                </h2>
                <p className="text-lg text-gray-600">
                  Real stories from real people who found their perfect insurance plan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    name: "Priya Sharma",
                    location: "Mumbai, Maharashtra",
                    avatar: "PS",
                    text: "The voice assistant in Hindi was incredible! I could ask questions naturally and got perfect plan recommendations. Saved me so much time.",
                    rating: 5
                  },
                  {
                    name: "Rajesh Kumar",
                    location: "Bangalore, Karnataka",
                    avatar: "RK",
                    text: "The claim intelligence tool predicted 92% approval and they were spot on! My claim settled in just 7 days. This platform is revolutionary.",
                    rating: 5
                  },
                  {
                    name: "Anita Reddy",
                    location: "Hyderabad, Telangana",
                    avatar: "AR",
                    text: "I'm earning wellness points from my daily walks and got 8% premium discount. Insurance that actually rewards healthy living!",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="w-full py-16 md:py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
                {[
                  { icon: Users, value: 10000, suffix: "+", label: "Happy Customers", badge: "4.9★ Rating" },
                  { icon: Clock, value: 60, prefix: "<", suffix: "s", label: "Avg Response Time", badge: "Fastest in India" },
                  { icon: CheckCircle2, value: 95, suffix: "%", label: "Claim Settlement", badge: "Industry Leading" }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="space-y-4">
                      <Icon className="w-12 h-12 text-blue-600 mx-auto" />
                      <div className="text-4xl md:text-5xl font-bold text-gray-900">
                        {item.prefix}<AnimatedCounter end={item.value} suffix={item.suffix} duration={2500} />
                      </div>
                      <div className="text-gray-600 font-medium">{item.label}</div>
                      <Badge className="bg-blue-100 text-blue-700">{item.badge}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full py-20 md:py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="container px-4 md:px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Ready to Find Your Perfect Health Insurance?
                </h2>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                  Join 10,000+ Indians who trust BimaBuddy for smarter, faster, and better insurance decisions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/find-best-plan">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:scale-105 transition-all">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/voice-assistant">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
                      <Mic className="w-5 h-5 mr-2" />
                      Try Voice Assistant
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-blue-100">
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  No credit card required • Free forever • 2-minute setup
                </p>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
