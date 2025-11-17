"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Loader2,
  Send,
  Trash2,
  Languages
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { voiceService } from '@/lib/voice-service'
import type { VoiceLanguage, VoiceMessage, VoiceConversation } from '@/lib/types/voice'
import { VOICE_LANGUAGES } from '@/lib/types/voice'

interface VoiceAssistantProps {
  userId?: string
  defaultLanguage?: VoiceLanguage
  onConversationUpdate?: (conversation: VoiceConversation) => void
}

export function VoiceAssistant({
  userId = 'demo-user',
  defaultLanguage = 'en-IN',
  onConversationUpdate
}: VoiceAssistantProps) {
  const [language, setLanguage] = useState<VoiceLanguage>(defaultLanguage)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [currentTranscription, setCurrentTranscription] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [autoPlayResponses, setAutoPlayResponses] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkMicrophonePermission = async () => {
    const permission = await voiceService.getMicrophonePermission()
    setHasPermission(permission)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio context for waveform visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      // Start visualizing audio level
      visualizeAudioLevel()

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processVoiceCommand(audioBlob)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setHasPermission(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      setHasPermission(false)
      alert('Please allow microphone access to use voice features.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioLevel(0)

      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }

  const visualizeAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255) // Normalize to 0-1

      requestAnimationFrame(updateLevel)
    }

    updateLevel()
  }

  const processVoiceCommand = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setCurrentTranscription('Processing...')

    try {
      // Process voice command through the service
      const result = await voiceService.processVoiceCommand({
        audio_blob: audioBlob,
        language,
        user_id: userId,
        conversation_context: messages.length > 0 ? { previous_messages: messages.slice(-5) } : undefined
      })

      // Add user message
      const userMessage: VoiceMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        timestamp: new Date(),
        text: result.transcription,
        language,
        intent: result.intent,
        entities: result.entities,
        emotion: result.emotion,
        processing_time_ms: result.response_time_ms
      }

      // Add assistant message
      const assistantMessage: VoiceMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        timestamp: new Date(),
        text: result.response_text,
        language
      }

      setMessages(prev => [...prev, userMessage, assistantMessage])
      setCurrentTranscription('')

      // Auto-play response if enabled
      if (autoPlayResponses) {
        await playResponse(result.response_text)
      }
    } catch (error) {
      console.error('Error processing voice command:', error)
      setCurrentTranscription('Error processing voice. Please try again.')

      setTimeout(() => setCurrentTranscription(''), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const playResponse = async (text: string) => {
    try {
      setIsPlaying(true)

      const audioBlob = await voiceService.textToSpeech({
        text,
        language
      })

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error('Error playing response:', error)
      setIsPlaying(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    setCurrentTranscription('')
  }

  const getLanguageInfo = (code: VoiceLanguage) => {
    return VOICE_LANGUAGES.find(l => l.code === code)
  }

  const currentLanguageInfo = getLanguageInfo(language)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with Language Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Voice Assistant
              </CardTitle>
              <CardDescription>
                Speak naturally in your preferred language
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(val) => setLanguage(val as VoiceLanguage)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native_name} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoPlayResponses(!autoPlayResponses)}
                title={autoPlayResponses ? 'Disable auto-play' : 'Enable auto-play'}
              >
                {autoPlayResponses ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={clearConversation}
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conversation History */}
      <Card className="min-h-[400px] max-h-[500px] overflow-y-auto">
        <CardContent className="pt-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[350px] text-center">
              <Mic className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Press the microphone button below and speak in {currentLanguageInfo?.native_name}.
                Ask about policies, hospitals, claims, or wellness.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Examples:</p>
                <p className="italic">"Compare family health plans under ₹10,000"</p>
                <p className="italic">"Show hospitals near me"</p>
                <p className="italic">"What is waiting period?"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>

                    {message.role === 'user' && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.intent && (
                          <Badge variant="secondary" className="text-xs">
                            {message.intent.replace('_', ' ')}
                          </Badge>
                        )}
                        {message.emotion && message.emotion !== 'neutral' && (
                          <Badge variant="outline" className="text-xs">
                            {message.emotion}
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Current Processing Status */}
          {(isProcessing || currentTranscription) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end mt-4"
            >
              <div className="max-w-[80%] rounded-lg p-4 bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground italic">
                  {currentTranscription || 'Processing your voice...'}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Voice Input Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            {/* Audio Level Visualization */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full max-w-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${audioLevel * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(audioLevel * 100)}%
                    </span>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Listening... Speak now
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Microphone Button */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                size="lg"
                variant={isRecording ? 'destructive' : 'default'}
                className={`w-20 h-20 rounded-full ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || isPlaying}
              >
                {isProcessing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>

              {/* Recording Indicator Ring */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-destructive"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>

            {/* Status Text */}
            <div className="text-center">
              {!hasPermission ? (
                <p className="text-sm text-destructive">
                  Microphone access required. Please allow permissions.
                </p>
              ) : isProcessing ? (
                <p className="text-sm text-muted-foreground">
                  Processing your voice command...
                </p>
              ) : isPlaying ? (
                <p className="text-sm text-muted-foreground">
                  Playing response...
                </p>
              ) : isRecording ? (
                <p className="text-sm font-medium">
                  Tap again to stop recording
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tap microphone to speak
                </p>
              )}
            </div>

            {/* Language Info */}
            {currentLanguageInfo && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Speaking in {currentLanguageInfo.native_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentLanguageInfo.speaker_count}M+ speakers • {currentLanguageInfo.region}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { text: 'Compare plans', icon: '📊' },
              { text: 'Find hospitals', icon: '🏥' },
              { text: 'File claim', icon: '📝' },
              { text: 'Wellness status', icon: '💪' }
            ].map((action) => (
              <Button
                key={action.text}
                variant="outline"
                size="sm"
                className="justify-start"
                disabled={isRecording || isProcessing}
              >
                <span className="mr-2">{action.icon}</span>
                {action.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
