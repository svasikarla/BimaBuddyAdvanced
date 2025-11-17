"use client"

/**
 * Wellness Callback Page
 * Handles OAuth redirect from Terra after user connects their device
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const success = searchParams.get('success') === 'true'
  const terraUserId = searchParams.get('user_id')
  const provider = searchParams.get('provider')

  useEffect(() => {
    // Handle the callback
    if (success && terraUserId) {
      // TODO: Save connection to database
      // Example:
      // await supabase.from('wellness_connections').insert({
      //   user_id: userId,
      //   provider: provider,
      //   terra_user_id: terraUserId,
      //   status: 'active',
      //   created_at: new Date()
      // })

      // TODO: Trigger initial data sync
      // await fetch('/api/wellness/sync', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId, terraUserId, days: 30 })
      // })

      setStatus('success')

      // Redirect to wellness dashboard after 3 seconds
      setTimeout(() => {
        router.push('/wellness')
      }, 3000)
    } else {
      setStatus('error')
    }
  }, [success, terraUserId, provider, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <CardTitle>Connecting Your Device</CardTitle>
                <CardDescription>Please wait while we set up your wellness tracking...</CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="flex justify-center mb-4"
                >
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                </motion.div>
                <CardTitle className="text-green-600">Successfully Connected!</CardTitle>
                <CardDescription>
                  Your {provider || 'device'} is now linked. We'll start tracking your activity automatically.
                </CardDescription>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full">
                    <XCircle className="h-16 w-16 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-red-600">Connection Failed</CardTitle>
                <CardDescription>
                  We couldn't connect your device. Please try again or contact support if the problem persists.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="text-center">
            {status === 'success' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-left">
                  <h4 className="font-semibold mb-2">What's next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ Your activity data will sync automatically</li>
                    <li>✅ Earn points for steps, workouts, and active minutes</li>
                    <li>✅ Unlock premium discounts up to 12%</li>
                    <li>✅ Track your progress on the wellness dashboard</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your wellness dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Button onClick={() => router.push('/wellness')} className="w-full">
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Return Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function WellnessCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
