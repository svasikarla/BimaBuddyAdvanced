/**
 * Voice Assistant Types
 * Regional language voice interface for health insurance assistance
 */

export type VoiceLanguage =
  | 'en-IN' // English (India)
  | 'hi-IN' // Hindi
  | 'ta-IN' // Tamil
  | 'te-IN' // Telugu
  | 'bn-IN' // Bengali
  | 'mr-IN' // Marathi
  | 'gu-IN' // Gujarati
  | 'kn-IN' // Kannada
  | 'ml-IN' // Malayalam
  | 'pa-IN' // Punjabi

export type VoiceCommandIntent =
  | 'compare_plans'
  | 'find_hospital'
  | 'explain_term'
  | 'file_claim'
  | 'check_policy'
  | 'get_quote'
  | 'track_claim'
  | 'wellness_status'
  | 'general_query'
  | 'navigation'

export type VoiceEmotion =
  | 'neutral'
  | 'happy'
  | 'stressed'
  | 'confused'
  | 'frustrated'
  | 'urgent'

export interface VoiceCommand {
  id: string
  user_id?: string
  timestamp: Date

  // Input
  language: VoiceLanguage
  audio_url?: string
  transcription: string
  raw_text: string

  // Analysis
  intent: VoiceCommandIntent
  entities: VoiceEntity[]
  confidence: number // 0-1
  emotion?: VoiceEmotion

  // Response
  response_text: string
  response_audio_url?: string
  response_time_ms: number

  // Context
  conversation_id?: string
  previous_intent?: VoiceCommandIntent
  context?: Record<string, any>
}

export interface VoiceEntity {
  type: 'amount' | 'age' | 'location' | 'hospital' | 'disease' | 'policy_type' | 'date' | 'person'
  value: string
  normalized_value?: any
  confidence: number
}

export interface VoiceConversation {
  id: string
  user_id?: string
  language: VoiceLanguage
  started_at: Date
  ended_at?: Date

  messages: VoiceMessage[]
  intent_history: VoiceCommandIntent[]

  // Context tracking
  user_context: {
    name?: string
    age?: number
    location?: string
    family_size?: number
    existing_policy?: boolean
  }

  // Session metadata
  total_commands: number
  successful_commands: number
  average_confidence: number
  emotion_trend: VoiceEmotion[]
}

export interface VoiceMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: Date

  // Content
  text: string
  audio_url?: string
  language: VoiceLanguage

  // Analysis (for user messages)
  intent?: VoiceCommandIntent
  entities?: VoiceEntity[]
  emotion?: VoiceEmotion

  // Metadata
  processing_time_ms?: number
  tts_duration_ms?: number
}

export interface VoiceSettings {
  user_id: string

  // Preferences
  preferred_language: VoiceLanguage
  voice_speed: number // 0.5 - 2.0
  voice_gender: 'male' | 'female' | 'neutral'
  auto_play_responses: boolean

  // Accessibility
  hearing_assistance: boolean
  speech_assistance: boolean
  extended_pauses: boolean

  // Privacy
  save_recordings: boolean
  voice_authentication_enabled: boolean

  updated_at: Date
}

export interface VoiceAuthentication {
  user_id: string
  voiceprint_id: string

  // Biometric data
  voiceprint_hash: string // Encrypted voiceprint signature
  sample_count: number
  last_verified_at: Date

  // Security
  verification_threshold: number // 0-1
  failed_attempts: number
  locked_until?: Date

  // Metadata
  enrollment_date: Date
  last_updated: Date
}

// Intent patterns for voice command recognition
export interface VoiceIntentPattern {
  intent: VoiceCommandIntent
  patterns: string[] // Regex or keyword patterns
  required_entities?: string[]
  examples: Record<VoiceLanguage, string[]>
}

export const VOICE_INTENT_PATTERNS: VoiceIntentPattern[] = [
  {
    intent: 'compare_plans',
    patterns: [
      'compare.*plans?',
      'show.*policies',
      'best.*insurance',
      'तुलना.*योजना', // Hindi: compare plans
      'காட்டு.*திட்டங்கள்' // Tamil: show plans
    ],
    required_entities: ['amount', 'policy_type'],
    examples: {
      'en-IN': [
        'Compare family health plans under 10000 rupees',
        'Show me the best policies for senior citizens',
        'What are good insurance options for my family'
      ],
      'hi-IN': [
        'दस हजार रुपये से कम परिवार योजना दिखाएं',
        'मेरे परिवार के लिए अच्छी पॉलिसी बताएं'
      ],
      'ta-IN': [
        'பத்தாயிரம் ரூபாய்க்கு குடும்ப திட்டம் காட்டுங்கள்'
      ],
      'te-IN': [],
      'bn-IN': [],
      'mr-IN': [],
      'gu-IN': [],
      'kn-IN': [],
      'ml-IN': [],
      'pa-IN': []
    }
  },
  {
    intent: 'find_hospital',
    patterns: [
      'hospital.*near',
      'cashless.*facility',
      'network.*hospital',
      'अस्पताल.*पास', // Hindi: hospital near
      'மருத்துவமனை.*அருகில்' // Tamil: hospital near
    ],
    required_entities: ['location'],
    examples: {
      'en-IN': [
        'Show hospitals near me with cashless facility',
        'Find network hospitals in Bangalore',
        'Which hospitals accept my policy'
      ],
      'hi-IN': [
        'मेरे पास कैशलेस अस्पताल दिखाएं',
        'मुंबई में नेटवर्क हॉस्पिटल कहाँ हैं'
      ],
      'ta-IN': [
        'எனக்கு அருகில் காஷ்லெஸ் மருத்துவமனை காட்டுங்கள்'
      ],
      'te-IN': [],
      'bn-IN': [],
      'mr-IN': [],
      'gu-IN': [],
      'kn-IN': [],
      'ml-IN': [],
      'pa-IN': []
    }
  },
  {
    intent: 'explain_term',
    patterns: [
      'what.*is',
      'explain',
      'meaning.*of',
      'क्या.*है', // Hindi: what is
      'என்ன.*என்றால்' // Tamil: what is
    ],
    required_entities: [],
    examples: {
      'en-IN': [
        'What is waiting period',
        'Explain copayment',
        'What does pre-existing condition mean'
      ],
      'hi-IN': [
        'वेटिंग पीरियड क्या है',
        'को-पेमेंट समझाएं'
      ],
      'ta-IN': [
        'காத்திருப்பு காலம் என்றால் என்ன'
      ],
      'te-IN': [],
      'bn-IN': [],
      'mr-IN': [],
      'gu-IN': [],
      'kn-IN': [],
      'ml-IN': [],
      'pa-IN': []
    }
  },
  {
    intent: 'file_claim',
    patterns: [
      'file.*claim',
      'submit.*claim',
      'claim.*for',
      'दावा.*दर्ज', // Hindi: file claim
      'உரிமைக்கோரல்.*சமர்ப்பி' // Tamil: submit claim
    ],
    required_entities: ['disease'],
    examples: {
      'en-IN': [
        'I want to file a claim for my knee surgery',
        'How do I submit claim for hospitalization',
        'File claim for my father heart attack'
      ],
      'hi-IN': [
        'मैं अपने घुटने की सर्जरी के लिए दावा दर्ज करना चाहता हूं'
      ],
      'ta-IN': [
        'என் முழங்கால் அறுவை சிகிச்சைக்கு உரிமைக்கோரல் தாக்கல் செய்ய வேண்டும்'
      ],
      'te-IN': [],
      'bn-IN': [],
      'mr-IN': [],
      'gu-IN': [],
      'kn-IN': [],
      'ml-IN': [],
      'pa-IN': []
    }
  },
  {
    intent: 'wellness_status',
    patterns: [
      'wellness.*points',
      'fitness.*status',
      'discount',
      'वेलनेस.*अंक', // Hindi: wellness points
      'உடற்பயிற்சி.*நிலை' // Tamil: fitness status
    ],
    examples: {
      'en-IN': [
        'How many wellness points do I have',
        'What is my current premium discount',
        'Show my fitness tracker status'
      ],
      'hi-IN': [
        'मेरे कितने वेलनेस पॉइंट्स हैं',
        'मेरी डिस्काउंट कितनी है'
      ],
      'ta-IN': [],
      'te-IN': [],
      'bn-IN': [],
      'mr-IN': [],
      'gu-IN': [],
      'kn-IN': [],
      'ml-IN': [],
      'pa-IN': []
    }
  }
]

// Language metadata
export interface VoiceLanguageInfo {
  code: VoiceLanguage
  name: string
  native_name: string
  whisper_support: boolean
  elevenlabs_support: boolean
  speaker_count: number // in millions
  region: string
}

export const VOICE_LANGUAGES: VoiceLanguageInfo[] = [
  {
    code: 'en-IN',
    name: 'English',
    native_name: 'English',
    whisper_support: true,
    elevenlabs_support: true,
    speaker_count: 125,
    region: 'Pan-India'
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    native_name: 'हिन्दी',
    whisper_support: true,
    elevenlabs_support: true,
    speaker_count: 528,
    region: 'North India'
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    native_name: 'தமிழ்',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 75,
    region: 'South India'
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    native_name: 'తెలుగు',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 81,
    region: 'South India'
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    native_name: 'বাংলা',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 97,
    region: 'East India'
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    native_name: 'मराठी',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 83,
    region: 'West India'
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    native_name: 'ગુજરાતી',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 56,
    region: 'West India'
  },
  {
    code: 'kn-IN',
    name: 'Kannada',
    native_name: 'ಕನ್ನಡ',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 44,
    region: 'South India'
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    native_name: 'മലയാളം',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 38,
    region: 'South India'
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    native_name: 'ਪੰਜਾਬੀ',
    whisper_support: true,
    elevenlabs_support: false,
    speaker_count: 33,
    region: 'North India'
  }
]

// Emotion detection patterns (for empathetic responses)
export interface EmotionPattern {
  emotion: VoiceEmotion
  keywords: string[]
  response_tone: 'calm' | 'supportive' | 'encouraging' | 'urgent'
}

export const EMOTION_PATTERNS: EmotionPattern[] = [
  {
    emotion: 'stressed',
    keywords: ['urgent', 'emergency', 'help', 'quickly', 'asap', 'जल्दी', 'உடனடியாக'],
    response_tone: 'calm'
  },
  {
    emotion: 'confused',
    keywords: ['don\'t understand', 'confused', 'explain', 'समझ नहीं', 'குழப்பம்'],
    response_tone: 'supportive'
  },
  {
    emotion: 'frustrated',
    keywords: ['frustrated', 'again', 'still', 'परेशान', 'வருத்தம்'],
    response_tone: 'calm'
  },
  {
    emotion: 'happy',
    keywords: ['thank', 'great', 'perfect', 'good', 'धन्यवाद', 'நன்றி'],
    response_tone: 'encouraging'
  },
  {
    emotion: 'urgent',
    keywords: ['now', 'immediately', 'critical', 'serious', 'तुरंत', 'இப்போது'],
    response_tone: 'urgent'
  }
]
