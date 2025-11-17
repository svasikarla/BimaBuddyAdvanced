/**
 * Language formatting utilities
 * Handles currency, dates, numbers formatting for different languages
 */

export type SupportedLanguage =
  | "english"
  | "hindi"
  | "tamil"
  | "telugu"
  | "bengali"
  | "marathi"
  | "gujarati"
  | "kannada"
  | "malayalam"
  | "punjabi"

/**
 * Format currency based on language
 */
export function formatCurrency(
  amount: number,
  language: SupportedLanguage = "english"
): string {
  // Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })

  return formatter.format(amount)
}

/**
 * Format number in Indian style (lakhs)
 */
export function formatNumber(
  num: number,
  language: SupportedLanguage = "english"
): string {
  if (num >= 100000) {
    // Format in lakhs
    return `${(num / 100000).toFixed(2)}L`
  } else if (num >= 1000) {
    // Format in thousands
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Format date based on language
 */
export function formatDate(
  date: Date,
  language: SupportedLanguage = "english"
): string {
  const localeMap: Record<SupportedLanguage, string> = {
    english: 'en-IN',
    hindi: 'hi-IN',
    tamil: 'ta-IN',
    telugu: 'te-IN',
    bengali: 'bn-IN',
    marathi: 'mr-IN',
    gujarati: 'gu-IN',
    kannada: 'kn-IN',
    malayalam: 'ml-IN',
    punjabi: 'pa-IN'
  }

  return new Intl.DateTimeFormat(localeMap[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Get language-specific greetings based on time of day
 */
export function getGreeting(language: SupportedLanguage = "english"): string {
  const hour = new Date().getHours()

  const greetings: Record<SupportedLanguage, { morning: string; afternoon: string; evening: string }> = {
    english: {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening"
    },
    hindi: {
      morning: "सुप्रभात",
      afternoon: "नमस्ते",
      evening: "शुभ संध्या"
    },
    tamil: {
      morning: "காலை வணக்கம்",
      afternoon: "மதிய வணக்கம்",
      evening: "மாலை வணக்கம்"
    },
    telugu: {
      morning: "శుభోదయం",
      afternoon: "శుభ మధ్యాహ్నం",
      evening: "శుభ సాయంకాలం"
    },
    bengali: {
      morning: "সুপ্রভাত",
      afternoon: "শুভ অপরাহ্ন",
      evening: "শুভ সন্ধ্যা"
    },
    marathi: {
      morning: "सुप्रभात",
      afternoon: "शुभ दुपार",
      evening: "शुभ संध्याकाळ"
    },
    gujarati: {
      morning: "સુપ્રભાત",
      afternoon: "શુભ બપોર",
      evening: "શુભ સાંજ"
    },
    kannada: {
      morning: "ಶುಭೋದಯ",
      afternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
      evening: "ಶುಭ ಸಂಜೆ"
    },
    malayalam: {
      morning: "സുപ്രഭാതം",
      afternoon: "ശുഭ ഉച്ച",
      evening: "ശുഭ സന്ധ്യ"
    },
    punjabi: {
      morning: "ਸ਼ੁਭ ਸਵੇਰ",
      afternoon: "ਸ਼ੁਭ ਦੁਪਿਹਰ",
      evening: "ਸ਼ੁਭ ਸ਼ਾਮ"
    }
  }

  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  return greetings[language][timeOfDay]
}

/**
 * Get language direction (LTR or RTL)
 */
export function getTextDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
  // All Indian languages use LTR
  // Add RTL languages here if needed (e.g., Urdu)
  return 'ltr'
}

/**
 * Get native language name
 */
export function getNativeLanguageName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ"
  }

  return names[language]
}

/**
 * Format phone number for Indian format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // Indian format: +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`
  }

  return phone
}

/**
 * Validate Indian PIN code
 */
export function validatePincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode)
}

/**
 * Get language-specific error messages
 */
export function getErrorMessage(
  errorCode: string,
  language: SupportedLanguage = "english"
): string {
  const errorMessages: Record<SupportedLanguage, Record<string, string>> = {
    english: {
      invalidAge: "Please enter a valid age between 18 and 100",
      invalidPhone: "Please enter a valid 10-digit mobile number",
      invalidPincode: "Please enter a valid 6-digit PIN code",
      invalidEmail: "Please enter a valid email address",
      required: "This field is required",
      networkError: "Network error. Please check your connection",
      serverError: "Server error. Please try again later"
    },
    hindi: {
      invalidAge: "कृपया 18 से 100 के बीच एक मान्य आयु दर्ज करें",
      invalidPhone: "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें",
      invalidPincode: "कृपया एक मान्य 6-अंकीय पिन कोड दर्ज करें",
      invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें",
      required: "यह फील्ड आवश्यक है",
      networkError: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें",
      serverError: "सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें"
    },
    // Add more languages as needed
    tamil: {},
    telugu: {},
    bengali: {},
    marathi: {},
    gujarati: {},
    kannada: {},
    malayalam: {},
    punjabi: {}
  }

  return errorMessages[language][errorCode] || errorMessages.english[errorCode] || errorCode
}
