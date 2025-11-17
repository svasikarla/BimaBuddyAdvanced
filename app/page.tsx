/**
 * BimaBuddy Advanced - Landing Page
 * Comprehensive showcase of all features and capabilities with visual enhancements
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
  FileText,
  BookOpen,
  Search,
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
  Star
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Statistics Section with Animated Counters */}
          <section className="w-full py-12 md:py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={50} suffix="+" duration={2000} />
                  </div>
                  <div className="text-sm md:text-base text-blue-100">Health Insurance Plans</div>
                </div>
                <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={10} duration={2000} />
                  </div>
                  <div className="text-sm md:text-base text-blue-100">Indian Languages</div>
                </div>
                <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={85} suffix="%" duration={2000} />
                  </div>
                  <div className="text-sm md:text-base text-blue-100">Claim Prediction Accuracy</div>
                </div>
                <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={1.1} decimals={1} suffix="B+" duration={2000} />
                  </div>
                  <div className="text-sm md:text-base text-blue-100">Voice Coverage</div>
                </div>
              </div>
            </div>
          </section>

          {/* AI-Powered Features Section */}
          <section className="w-full py-16 md:py-24 bg-gray-50 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
                  AI-Powered Innovation
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Revolutionary Features for Modern India
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl">
                  Experience the future of health insurance with our cutting-edge AI technology
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Voice Assistant */}
                <Link href="/voice-assistant">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-purple-500 group overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <Mic className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                        Voice Assistant
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 shadow-sm">NEW</Badge>
                      </CardTitle>
                      <CardDescription>
                        Speak in your native language - 10 Indian languages supported
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>95%+ transcription accuracy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Emotion-aware responses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>1.1B+ speakers covered</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
                        Try Voice Assistant
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Claim Intelligence */}
                <Link href="/claim-intelligence">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-blue-500 group overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                        Claim Intelligence Pro
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 shadow-sm">AI</Badge>
                      </CardTitle>
                      <CardDescription>
                        Predict claim approval with 85%+ accuracy before filing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>50+ factor analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Document gap detection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>40% denial reduction</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                        Check Your Claim
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Wellness Rewards */}
                <Link href="/wellness">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500 group overflow-hidden bg-gradient-to-br from-white to-green-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <Activity className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                        Wellness Rewards
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 shadow-sm">12% OFF</Badge>
                      </CardTitle>
                      <CardDescription>
                        Track fitness, earn points, get premium discounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Connect 150+ fitness trackers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Earn points for activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Up to 12% premium discount</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                        Start Earning Rewards
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Analytics Dashboard */}
                <Link href="/analytics">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-orange-500 group overflow-hidden bg-gradient-to-br from-white to-orange-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                      <CardDescription>
                        Visualize policy data with interactive charts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Premium comparison charts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Coverage breakdown analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>AI-powered insights</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-orange-600 font-medium group-hover:gap-2 transition-all">
                        View Analytics
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Policy Comparison */}
                <Link href="/compare-plans">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-indigo-500 group overflow-hidden bg-gradient-to-br from-white to-indigo-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Smart Comparison</CardTitle>
                      <CardDescription>
                        Compare plans side-by-side with AI recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>50+ plans from top insurers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Feature-by-feature analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Best value recommendations</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
                        Compare Plans
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Policy School */}
                <Link href="/policy-school">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-yellow-500 group overflow-hidden bg-gradient-to-br from-white to-yellow-50/30">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Policy School</CardTitle>
                      <CardDescription>
                        Learn insurance basics in simple terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Easy-to-understand guides</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Video tutorials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Common terms explained</span>
                        </li>
                      </ul>
                      <div className="flex items-center text-yellow-600 font-medium group-hover:gap-2 transition-all">
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full py-16 md:py-24 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How BimaBuddy Works
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl">
                  Get the perfect health insurance plan in just 4 simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { num: 1, title: "Answer Questions", desc: "Tell us about your age, family, and health needs", color: "blue" },
                  { num: 2, title: "AI Analysis", desc: "Our AI matches you with the best plans instantly", color: "purple" },
                  { num: 3, title: "Compare Options", desc: "View side-by-side comparisons with detailed insights", color: "green" },
                  { num: 4, title: "Choose & Buy", desc: "Select your plan and get instant digital policy", color: "orange" }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                    <div className={`w-20 h-20 rounded-full bg-${step.color}-100 flex items-center justify-center text-3xl font-bold text-${step.color}-600 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {step.num}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-gray-600 text-lg md:text-xl">
                  Real stories from real people who found their perfect plan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Priya Sharma",
                    location: "Mumbai, Maharashtra",
                    text: "The voice assistant feature is a game-changer! I could explain everything in Hindi and got instant recommendations. Saved me hours of research.",
                    rating: 5
                  },
                  {
                    name: "Rajesh Kumar",
                    location: "Bangalore, Karnataka",
                    text: "The claim intelligence tool predicted my approval at 92%, and they were right! Got my claim settled within 7 days. This platform is incredible.",
                    rating: 5
                  },
                  {
                    name: "Anita Reddy",
                    location: "Hyderabad, Telangana",
                    text: "I'm earning wellness points for my morning walks and got 8% off my premium renewal. BimaBuddy makes insurance actually rewarding!",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="w-10 h-10 text-blue-200 mb-4" />
                      <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="w-full py-16 md:py-24 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why 10,000+ Indians Trust BimaBuddy
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: Globe, color: "blue", title: "10 Indian Languages", desc: "Get assistance in your native language - from Hindi to Tamil, we speak your language" },
                  { icon: Zap, color: "purple", title: "AI-Powered Speed", desc: "Get personalized recommendations in seconds, not hours. Our AI works 24/7 for you" },
                  { icon: Shield, color: "green", title: "100% Transparent", desc: "No hidden charges, no fine print surprises. We show you exactly what you're getting" },
                  { icon: Target, color: "orange", title: "Precision Matching", desc: "Our algorithms consider 50+ factors to find your perfect health insurance match" },
                  { icon: Heart, color: "red", title: "Wellness Rewards", desc: "Stay healthy, pay less. Get up to 12% discount on premiums for maintaining fitness" },
                  { icon: Award, color: "yellow", title: "Expert Support", desc: "IRDAI-certified advisors + AI chatbot available 24/7 to answer your questions" }
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-4`}>
                          <IconComponent className={`w-6 h-6 text-${item.color}-600`} />
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{item.desc}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="w-full py-16 md:py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center space-y-2 group">
                  <Users className="w-12 h-12 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold text-gray-900">
                    <AnimatedCounter end={10000} suffix="+" duration={2500} />
                  </div>
                  <div className="text-gray-600">Happy Customers</div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 group">
                  <Clock className="w-12 h-12 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold text-gray-900">
                    &lt;<AnimatedCounter end={60} suffix="s" duration={2500} />
                  </div>
                  <div className="text-gray-600">Average Response Time</div>
                  <Badge className="mt-2 bg-purple-100 text-purple-700">Fastest in India</Badge>
                </div>

                <div className="flex flex-col items-center space-y-2 group">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold text-gray-900">
                    <AnimatedCounter end={95} suffix="%" duration={2500} />
                  </div>
                  <div className="text-gray-600">Claim Settlement Rate</div>
                  <Badge className="mt-2 bg-green-100 text-green-700">Industry Leading</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-3xl">
                  Ready to Find Your Perfect Health Insurance Plan?
                </h2>
                <p className="max-w-[700px] text-blue-100 text-lg md:text-xl">
                  Join 10,000+ Indians who made the smart choice with BimaBuddy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href="/find-best-plan">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/voice-assistant">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-6 text-lg transition-all hover:scale-105">
                      <Mic className="w-5 h-5 mr-2" />
                      Try Voice Assistant
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-blue-100 mt-4">
                  No credit card required • Takes less than 2 minutes • 100% Free
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
