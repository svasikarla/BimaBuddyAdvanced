/**
 * BimaBuddy Advanced - Landing Page
 * Comprehensive showcase of all features and capabilities
 */

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ChatbotButton } from "@/components/chatbot-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { Badge } from "@/components/ui/badge"
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
  BarChart3
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Statistics Section */}
          <section className="w-full py-12 md:py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">50+</div>
                  <div className="text-sm md:text-base text-blue-100">Health Insurance Plans</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">10</div>
                  <div className="text-sm md:text-base text-blue-100">Indian Languages</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">85%</div>
                  <div className="text-sm md:text-base text-blue-100">Claim Prediction Accuracy</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">1.1B+</div>
                  <div className="text-sm md:text-base text-blue-100">Voice Coverage</div>
                </div>
              </div>
            </div>
          </section>

          {/* AI-Powered Features Section */}
          <section className="w-full py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
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
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-purple-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Mic className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Voice Assistant
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">NEW</Badge>
                      </CardTitle>
                      <CardDescription>
                        Speak in your native language - 10 Indian languages supported
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
                        Try Voice Assistant
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Claim Intelligence */}
                <Link href="/claim-intelligence">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Claim Intelligence Pro
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">AI</Badge>
                      </CardTitle>
                      <CardDescription>
                        Predict claim approval with 85%+ accuracy before filing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                        Check Your Claim
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Wellness Rewards */}
                <Link href="/wellness">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Activity className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Wellness Rewards
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">12% OFF</Badge>
                      </CardTitle>
                      <CardDescription>
                        Track fitness, earn points, get premium discounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                        Start Earning Rewards
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Analytics Dashboard */}
                <Link href="/analytics">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-orange-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                      <CardDescription>
                        Visualize policy data with interactive charts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-orange-600 font-medium group-hover:gap-2 transition-all">
                        View Analytics
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Policy Comparison */}
                <Link href="/compare-plans">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-indigo-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Smart Comparison</CardTitle>
                      <CardDescription>
                        Compare plans side-by-side with AI recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
                        Compare Plans
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Policy School */}
                <Link href="/policy-school">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-yellow-500 group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">Policy School</CardTitle>
                      <CardDescription>
                        Learn insurance basics in simple terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 flex items-center text-yellow-600 font-medium group-hover:gap-2 transition-all">
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
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Answer Questions</h3>
                  <p className="text-gray-600">
                    Tell us about your age, family, and health needs
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">AI Analysis</h3>
                  <p className="text-gray-600">
                    Our AI matches you with the best plans instantly
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Compare Options</h3>
                  <p className="text-gray-600">
                    View side-by-side comparisons with detailed insights
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600">
                    4
                  </div>
                  <h3 className="text-xl font-semibold">Choose & Buy</h3>
                  <p className="text-gray-600">
                    Select your plan and get instant digital policy
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why 10,000+ Indians Trust BimaBuddy
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>10 Indian Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Get assistance in your native language - from Hindi to Tamil, we speak your language
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle>AI-Powered Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Get personalized recommendations in seconds, not hours. Our AI works 24/7 for you
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>100% Transparent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      No hidden charges, no fine print surprises. We show you exactly what you're getting
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle>Precision Matching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Our algorithms consider 50+ factors to find your perfect health insurance match
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle>Wellness Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Stay healthy, pay less. Get up to 12% discount on premiums for maintaining fitness
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <CardTitle>Expert Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      IRDAI-certified advisors + AI chatbot available 24/7 to answer your questions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="w-full py-16 md:py-20 bg-white">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Users className="w-12 h-12 text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-gray-900">10,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <Clock className="w-12 h-12 text-purple-600 mb-2" />
                  <div className="text-4xl font-bold text-gray-900">&lt;60s</div>
                  <div className="text-gray-600">Average Response Time</div>
                  <Badge className="mt-2 bg-purple-100 text-purple-700">Fastest in India</Badge>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mb-2" />
                  <div className="text-4xl font-bold text-gray-900">95%</div>
                  <div className="text-gray-600">Claim Settlement Rate</div>
                  <Badge className="mt-2 bg-green-100 text-green-700">Industry Leading</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-3xl">
                  Ready to Find Your Perfect Health Insurance Plan?
                </h2>
                <p className="max-w-[700px] text-blue-100 text-lg md:text-xl">
                  Join 10,000+ Indians who made the smart choice with BimaBuddy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href="/find-best-plan">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/voice-assistant">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-6 text-lg">
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
