"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Watch, Smartphone, Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { WellnessProvider } from '@/lib/types/wellness'

interface TerraConnectWidgetProps {
  userId: string
  onSuccess?: (provider: WellnessProvider, terraUserId: string) => void
  onError?: (error: Error) => void
}

export function TerraConnectWidget({ userId, onSuccess, onError }: TerraConnectWidgetProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<WellnessProvider | null>(null)

  const providers = [
    {
      id: 'fitbit' as WellnessProvider,
      name: 'Fitbit',
      icon: Activity,
      description: 'Connect your Fitbit device',
      color: 'bg-blue-500'
    },
    {
      id: 'apple_health' as WellnessProvider,
      name: 'Apple Health',
      icon: Heart,
      description: 'Sync data from iPhone',
      color: 'bg-red-500'
    },
    {
      id: 'google_fit' as WellnessProvider,
      name: 'Google Fit',
      icon: Smartphone,
      description: 'Connect Google Fit',
      color: 'bg-green-500'
    },
    {
      id: 'garmin' as WellnessProvider,
      name: 'Garmin',
      icon: Watch,
      description: 'Connect Garmin device',
      color: 'bg-indigo-500'
    }
  ]

  const handleConnect = async (provider: WellnessProvider) => {
    setIsConnecting(true)
    setSelectedProvider(provider)

    try {
      // Generate widget session
      const response = await fetch('/api/wellness/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          provider
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate connection session')
      }

      const data = await response.json()

      // Open Terra widget in popup
      const width = 500
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const authWindow = window.open(
        data.url,
        'Terra Connect',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // Listen for auth callback
      const checkAuth = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkAuth)
          setIsConnecting(false)
          setSelectedProvider(null)

          // Check if connection was successful
          checkConnectionStatus(userId, provider)
        }
      }, 500)

    } catch (error: any) {
      console.error('Connection error:', error)
      toast.error('Failed to connect device', {
        description: error.message || 'Please try again later'
      })
      setIsConnecting(false)
      setSelectedProvider(null)
      onError?.(error)
    }
  }

  const checkConnectionStatus = async (userId: string, provider: WellnessProvider) => {
    try {
      const response = await fetch(`/api/wellness/status?userId=${userId}&provider=${provider}`)
      const data = await response.json()

      if (data.connected) {
        toast.success('Device connected successfully!', {
          description: `Your ${provider} data will sync automatically`
        })
        onSuccess?.(provider, data.terraUserId)
      }
    } catch (error) {
      console.error('Status check error:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Connect Your Fitness Tracker
        </CardTitle>
        <CardDescription>
          Link your fitness device to earn wellness points and get premium discounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => {
            const Icon = provider.icon
            const isLoading = isConnecting && selectedProvider === provider.id

            return (
              <Card
                key={provider.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`${provider.color} p-4 rounded-full text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                    <Button
                      onClick={() => handleConnect(provider.id)}
                      disabled={isConnecting}
                      className="w-full"
                      variant={isLoading ? "default" : "outline"}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Connect your fitness tracker or health app</li>
            <li>Your activity data syncs automatically</li>
            <li>Earn points based on your daily activities</li>
            <li>Redeem points for premium discounts (up to 12% off!)</li>
          </ol>
        </div>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>🔒 Your data is encrypted and secure. We only access activity metrics.</p>
        </div>
      </CardContent>
    </Card>
  )
}
