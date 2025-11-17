/**
 * Voice Service
 * Handles speech-to-text, intent recognition, and text-to-speech for regional languages
 * Uses Whisper API + GPT-4 + ElevenLabs
 */

import type {
  VoiceCommand,
  VoiceCommandIntent,
  VoiceEntity,
  VoiceEmotion,
  VoiceLanguage,
  VoiceMessage,
  VOICE_INTENT_PATTERNS,
  EMOTION_PATTERNS
} from './types/voice'

export class VoiceService {
  private whisperApiKey: string
  private openaiApiKey: string
  private elevenlabsApiKey: string

  constructor() {
    this.whisperApiKey = process.env.OPENAI_API_KEY || ''
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
    this.elevenlabsApiKey = process.env.ELEVENLABS_API_KEY || ''
  }

  /**
   * Convert speech to text using Whisper API
   * Supports 10 Indian languages
   */
  async speechToText(params: {
    audio_blob: Blob
    language: VoiceLanguage
  }): Promise<{ text: string; confidence: number; language: string }> {
    try {
      const formData = new FormData()
      formData.append('file', params.audio_blob, 'audio.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', params.language.split('-')[0]) // 'en-IN' -> 'en'

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.whisperApiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Whisper API error')
      }

      const data = await response.json()

      return {
        text: data.text || '',
        confidence: 0.95, // Whisper doesn't provide confidence, using high default
        language: data.language || params.language
      }
    } catch (error: any) {
      console.error('Speech to text error:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  /**
   * Analyze intent and entities from transcribed text using GPT-4
   */
  async analyzeIntent(params: {
    text: string
    language: VoiceLanguage
    conversation_context?: any
  }): Promise<{
    intent: VoiceCommandIntent
    entities: VoiceEntity[]
    confidence: number
    emotion?: VoiceEmotion
  }> {
    try {
      // First, detect emotion from text
      const emotion = this.detectEmotion(params.text)

      // Use GPT-4 for intent classification and entity extraction
      const systemPrompt = `You are an AI assistant helping with health insurance queries in India.
Analyze the user's query and extract:
1. Intent: One of [compare_plans, find_hospital, explain_term, file_claim, check_policy, get_quote, track_claim, wellness_status, general_query, navigation]
2. Entities: Extract amounts, ages, locations, hospitals, diseases, policy types, dates, person names
3. Provide confidence score (0-1)

Return JSON format:
{
  "intent": "compare_plans",
  "entities": [{"type": "amount", "value": "10000", "normalized_value": 10000, "confidence": 0.95}],
  "confidence": 0.9
}`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Query: "${params.text}"\nLanguage: ${params.language}` }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        throw new Error('GPT-4 API error')
      }

      const data = await response.json()
      const analysis = JSON.parse(data.choices[0].message.content)

      return {
        intent: analysis.intent || 'general_query',
        entities: analysis.entities || [],
        confidence: analysis.confidence || 0.7,
        emotion
      }
    } catch (error: any) {
      console.error('Intent analysis error:', error)

      // Fallback to pattern matching
      return this.fallbackIntentAnalysis(params.text, emotion)
    }
  }

  /**
   * Detect emotion from text using keyword patterns
   */
  private detectEmotion(text: string): VoiceEmotion {
    const lowerText = text.toLowerCase()

    // Import emotion patterns (defined in types)
    const emotionPatterns = [
      {
        emotion: 'stressed' as VoiceEmotion,
        keywords: ['urgent', 'emergency', 'help', 'quickly', 'asap', 'जल्दी', 'உடனடியாக']
      },
      {
        emotion: 'confused' as VoiceEmotion,
        keywords: ['don\'t understand', 'confused', 'explain', 'समझ नहीं', 'குழப்பம்']
      },
      {
        emotion: 'frustrated' as VoiceEmotion,
        keywords: ['frustrated', 'again', 'still', 'परेशान', 'வருத்தம்']
      },
      {
        emotion: 'happy' as VoiceEmotion,
        keywords: ['thank', 'great', 'perfect', 'good', 'धन्यवाद', 'நன்றி']
      },
      {
        emotion: 'urgent' as VoiceEmotion,
        keywords: ['now', 'immediately', 'critical', 'serious', 'तुरंत', 'இப்போது']
      }
    ]

    for (const pattern of emotionPatterns) {
      for (const keyword of pattern.keywords) {
        if (lowerText.includes(keyword)) {
          return pattern.emotion
        }
      }
    }

    return 'neutral'
  }

  /**
   * Fallback intent analysis using pattern matching
   */
  private fallbackIntentAnalysis(
    text: string,
    emotion?: VoiceEmotion
  ): {
    intent: VoiceCommandIntent
    entities: VoiceEntity[]
    confidence: number
    emotion?: VoiceEmotion
  } {
    const lowerText = text.toLowerCase()

    // Simple pattern matching for common intents
    if (lowerText.includes('compare') || lowerText.includes('तुलना')) {
      return {
        intent: 'compare_plans',
        entities: [],
        confidence: 0.6,
        emotion
      }
    }

    if (lowerText.includes('hospital') || lowerText.includes('अस्पताल')) {
      return {
        intent: 'find_hospital',
        entities: [],
        confidence: 0.6,
        emotion
      }
    }

    if (lowerText.includes('claim') || lowerText.includes('दावा')) {
      return {
        intent: 'file_claim',
        entities: [],
        confidence: 0.6,
        emotion
      }
    }

    if (lowerText.includes('wellness') || lowerText.includes('fitness')) {
      return {
        intent: 'wellness_status',
        entities: [],
        confidence: 0.6,
        emotion
      }
    }

    return {
      intent: 'general_query',
      entities: [],
      confidence: 0.5,
      emotion
    }
  }

  /**
   * Generate response based on intent and context using GPT-4
   */
  async generateResponse(params: {
    intent: VoiceCommandIntent
    entities: VoiceEntity[]
    user_query: string
    language: VoiceLanguage
    emotion?: VoiceEmotion
    conversation_context?: any
  }): Promise<string> {
    try {
      const languageNames: Record<string, string> = {
        'en-IN': 'English',
        'hi-IN': 'Hindi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
        'bn-IN': 'Bengali',
        'mr-IN': 'Marathi',
        'gu-IN': 'Gujarati',
        'kn-IN': 'Kannada',
        'ml-IN': 'Malayalam',
        'pa-IN': 'Punjabi'
      }

      const emotionTone = params.emotion === 'stressed' || params.emotion === 'frustrated'
        ? 'Use a calm, reassuring tone.'
        : params.emotion === 'confused'
        ? 'Explain clearly and simply.'
        : params.emotion === 'urgent'
        ? 'Respond quickly and directly.'
        : 'Use a friendly, helpful tone.'

      const systemPrompt = `You are BimaBuddy's voice assistant helping with health insurance in India.
Language: ${languageNames[params.language]}
Intent: ${params.intent}
${emotionTone}

Guidelines:
- Keep responses concise (2-3 sentences for voice)
- Use simple language appropriate for the elderly
- Be empathetic and supportive
- Provide actionable next steps
- Respond in ${languageNames[params.language]} language only`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: params.user_query }
          ],
          temperature: 0.7,
          max_tokens: 200 // Keep voice responses concise
        })
      })

      if (!response.ok) {
        throw new Error('GPT-4 API error')
      }

      const data = await response.json()
      return data.choices[0].message.content || 'I apologize, I could not process your request.'
    } catch (error: any) {
      console.error('Response generation error:', error)
      return this.getFallbackResponse(params.intent, params.language)
    }
  }

  /**
   * Fallback responses when API fails
   */
  private getFallbackResponse(intent: VoiceCommandIntent, language: VoiceLanguage): string {
    const responses: Record<VoiceCommandIntent, Record<string, string>> = {
      compare_plans: {
        'en-IN': 'I can help you compare health insurance plans. Please tell me your budget and family size.',
        'hi-IN': 'मैं आपको स्वास्थ्य बीमा योजनाओं की तुलना करने में मदद कर सकता हूं। कृपया अपना बजट और परिवार का आकार बताएं।'
      },
      find_hospital: {
        'en-IN': 'I can help you find network hospitals. Please share your location.',
        'hi-IN': 'मैं आपको नेटवर्क अस्पताल खोजने में मदद कर सकता हूं। कृपया अपना स्थान साझा करें।'
      },
      file_claim: {
        'en-IN': 'I can guide you through the claim filing process. What type of treatment did you have?',
        'hi-IN': 'मैं दावा दाखिल करने की प्रक्रिया में आपका मार्गदर्शन कर सकता हूं। आपका किस प्रकार का उपचार हुआ था?'
      },
      wellness_status: {
        'en-IN': 'Let me check your wellness points and premium discount.',
        'hi-IN': 'मैं आपके वेलनेस पॉइंट्स और प्रीमियम डिस्काउंट की जांच करता हूं।'
      },
      general_query: {
        'en-IN': 'I\'m here to help with health insurance. How can I assist you today?',
        'hi-IN': 'मैं स्वास्थ्य बीमा में मदद के लिए यहां हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?'
      },
      explain_term: {
        'en-IN': 'I can explain insurance terms. Which term would you like to understand?',
        'hi-IN': ''
      },
      check_policy: {
        'en-IN': 'I can check your policy details. Please provide your policy number.',
        'hi-IN': ''
      },
      get_quote: {
        'en-IN': 'I can get you a quote. Tell me your age and coverage amount needed.',
        'hi-IN': ''
      },
      track_claim: {
        'en-IN': 'Let me track your claim status. What is your claim number?',
        'hi-IN': ''
      },
      navigation: {
        'en-IN': 'Where would you like to go in the app?',
        'hi-IN': ''
      }
    }

    return responses[intent]?.[language] || responses[intent]?.['en-IN'] || 'How can I help you?'
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  async textToSpeech(params: {
    text: string
    language: VoiceLanguage
    voice_gender?: 'male' | 'female'
  }): Promise<Blob> {
    try {
      // ElevenLabs voice IDs (using multilingual voices)
      const voiceId = params.voice_gender === 'male'
        ? '21m00Tcm4TlvDq8ikWAM' // Rachel (can be used for multiple languages)
        : 'EXAVITQu4vr4xnSDxMaL' // Bella

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.elevenlabsApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: params.text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error('ElevenLabs API error')
      }

      return await response.blob()
    } catch (error: any) {
      console.error('Text to speech error:', error)
      throw new Error('Failed to generate speech')
    }
  }

  /**
   * Process complete voice command
   * End-to-end: audio -> text -> intent -> response -> audio
   */
  async processVoiceCommand(params: {
    audio_blob: Blob
    language: VoiceLanguage
    user_id?: string
    conversation_context?: any
  }): Promise<VoiceCommand> {
    const startTime = Date.now()

    try {
      // 1. Speech to text
      const transcription = await this.speechToText({
        audio_blob: params.audio_blob,
        language: params.language
      })

      // 2. Analyze intent and entities
      const analysis = await this.analyzeIntent({
        text: transcription.text,
        language: params.language,
        conversation_context: params.conversation_context
      })

      // 3. Generate response
      const responseText = await this.generateResponse({
        intent: analysis.intent,
        entities: analysis.entities,
        user_query: transcription.text,
        language: params.language,
        emotion: analysis.emotion,
        conversation_context: params.conversation_context
      })

      // 4. Text to speech for response
      // (Optional - can be done asynchronously)
      // const responseAudio = await this.textToSpeech({
      //   text: responseText,
      //   language: params.language
      // })

      const responseTime = Date.now() - startTime

      return {
        id: `cmd_${Date.now()}`,
        user_id: params.user_id,
        timestamp: new Date(),
        language: params.language,
        transcription: transcription.text,
        raw_text: transcription.text,
        intent: analysis.intent,
        entities: analysis.entities,
        confidence: analysis.confidence,
        emotion: analysis.emotion,
        response_text: responseText,
        response_time_ms: responseTime
      }
    } catch (error: any) {
      console.error('Voice command processing error:', error)
      throw error
    }
  }

  /**
   * Validate if language is supported
   */
  isLanguageSupported(language: VoiceLanguage): boolean {
    const supported: VoiceLanguage[] = [
      'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN',
      'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'
    ]
    return supported.includes(language)
  }

  /**
   * Get microphone permission status
   */
  async getMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      return false
    }
  }
}

// Export singleton instance
export const voiceService = new VoiceService()
