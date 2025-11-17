/**
 * Voice Assistant Page - Regional Language Voice Interface
 * Phase 11: Voice-First Regional AI - Complete Implementation
 */

import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChatbotButton } from '@/components/chatbot-button'
import { PageTransition } from '@/components/page-transition'
import { VoiceAssistant } from '@/components/voice-assistant'
import { Card, CardContent } from '@/components/ui/card'
import { Mic, Globe, Brain, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Voice Assistant - BimaBuddy',
  description: 'Speak naturally in your preferred Indian language for personalized health insurance assistance',
}

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Section */}
          <div className="w-full py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
                    <Mic className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      Voice-First • 10 Indian Languages
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Speak Your Language
                  </h1>
                  <p className="max-w-[700px] text-gray-600 md:text-xl mx-auto">
                    Get instant health insurance assistance in your preferred language.
                    Just speak naturally - no typing needed.
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">10 Indian Languages</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">AI-Powered Understanding</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Instant Responses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Coverage Stats */}
          <div className="container px-4 md:px-6 -mt-8 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Languages Supported', value: '10', color: 'bg-blue-500' },
                { label: 'Speakers Covered', value: '1.1B+', color: 'bg-purple-500' },
                { label: 'Response Time', value: '<10s', color: 'bg-orange-500' },
                { label: 'Accuracy', value: '95%+', color: 'bg-green-500' }
              ].map((stat, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                      <div className={`w-6 h-6 rounded ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Voice Assistant */}
          <div className="container px-4 md:px-6 pb-12">
            <VoiceAssistant />
          </div>

          {/* Supported Languages Section */}
          <div className="w-full py-16 bg-gray-50">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Supported Languages</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: 'English', native: 'English', speakers: '125M' },
                  { name: 'Hindi', native: 'हिन्दी', speakers: '528M' },
                  { name: 'Tamil', native: 'தமிழ்', speakers: '75M' },
                  { name: 'Telugu', native: 'తెలుగు', speakers: '81M' },
                  { name: 'Bengali', native: 'বাংলা', speakers: '97M' },
                  { name: 'Marathi', native: 'मराठी', speakers: '83M' },
                  { name: 'Gujarati', native: 'ગુજરાતી', speakers: '56M' },
                  { name: 'Kannada', native: 'ಕನ್ನಡ', speakers: '44M' },
                  { name: 'Malayalam', native: 'മലയാളം', speakers: '38M' },
                  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', speakers: '33M' }
                ].map((lang) => (
                  <Card key={lang.name} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold mb-2">{lang.native}</p>
                      <p className="text-sm text-muted-foreground mb-1">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">{lang.speakers} speakers</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="container px-4 md:px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Select Your Language',
                  description: 'Choose from 10 Indian languages for the most comfortable experience'
                },
                {
                  step: '2',
                  title: 'Tap & Speak',
                  description: 'Press the microphone button and speak your question naturally'
                },
                {
                  step: '3',
                  title: 'AI Understands',
                  description: 'Advanced AI recognizes your intent, context, and even emotions'
                },
                {
                  step: '4',
                  title: 'Get Voice Response',
                  description: 'Hear the answer in your language with automatic text-to-speech'
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What You Can Ask Section */}
          <div className="w-full py-16 bg-gray-50">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">What You Can Ask</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Policy Comparison',
                    icon: '📊',
                    examples: [
                      'Compare family health plans under ₹10,000',
                      'Which policy is best for senior citizens?',
                      'Show me plans with maternity coverage'
                    ]
                  },
                  {
                    title: 'Hospital Search',
                    icon: '🏥',
                    examples: [
                      'Find cashless hospitals near me',
                      'Which hospitals accept my policy?',
                      'Show network hospitals in Bangalore'
                    ]
                  },
                  {
                    title: 'Claims & Terms',
                    icon: '📝',
                    examples: [
                      'How do I file a claim?',
                      'What is waiting period?',
                      'Track my claim status'
                    ]
                  },
                  {
                    title: 'Policy Details',
                    icon: '📋',
                    examples: [
                      'Check my policy coverage',
                      'What are exclusions in my plan?',
                      'When does my policy renew?'
                    ]
                  },
                  {
                    title: 'Quotes & Purchase',
                    icon: '💰',
                    examples: [
                      'Get quote for family of 4',
                      'Calculate premium for age 45',
                      'Show me best value plans'
                    ]
                  },
                  {
                    title: 'Wellness & Rewards',
                    icon: '💪',
                    examples: [
                      'How many wellness points do I have?',
                      'What is my premium discount?',
                      'Track my fitness progress'
                    ]
                  }
                ].map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {category.examples.map((example, i) => (
                          <li key={i} className="italic">"{example}"</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="container px-4 md:px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use Voice Assistant?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Speak Your Mother Tongue',
                  description: 'No need to struggle with English. Use the language you think in.',
                  icon: '🗣️'
                },
                {
                  title: 'No Typing Required',
                  description: 'Especially helpful for elderly users or those with visual impairments.',
                  icon: '♿'
                },
                {
                  title: 'Faster Than Chat',
                  description: 'Get answers in seconds without typing long queries.',
                  icon: '⚡'
                },
                {
                  title: 'Emotion Detection',
                  description: 'AI understands if you are stressed or confused and responds appropriately.',
                  icon: '😊'
                },
                {
                  title: 'Context Aware',
                  description: 'Remembers your conversation and provides relevant follow-up answers.',
                  icon: '🧠'
                },
                {
                  title: 'Always Available',
                  description: '24/7 assistance without waiting for customer service.',
                  icon: '🕐'
                }
              ].map((benefit, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
