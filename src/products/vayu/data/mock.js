// Mock data for Vayu smart glasses website

export const productVariants = [
  {
    id: 'standard',
    name: 'Vayu X Essential',
    description: 'Everyday AI companion for quick answers, translation, notes, and reminders',
    price: 59999,
    originalPrice: 69999,
    features: [
      'Private heads-up display',
      'Voice-based interaction',
      'Real-time translation (40+ languages)',
      '12+ hours battery life',
      'Conversation notes and reminders',
      '6-month warranty'
    ],
    targetAudience: 'Professionals & Students',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'healthcare',
    name: 'Vayu X MedPro',
    description: 'Designed for clinicians: handoffs, dictation, summaries, protocol prompts',
    price: 119999,
    originalPrice: 129999,
    features: [
      'Medical terminology recognition',
      'Clinical workflow assistance',
      'Patient handoff summaries',
      'Extended 12+ hour battery',
      'Prescription lens compatible',
      'For trained professionals only',
      '1-year warranty + priority support'
    ],
    targetAudience: 'Healthcare Professionals',
    color: 'from-green-500 to-teal-600',
    popular: true
  },
  {
    id: 'legal',
    name: 'Vayu X LegalEdge',
    description: 'Designed for legal workflows: notes, structured summaries, document retrieval',
    price: 89999,
    originalPrice: 99999,
    features: [
      'Legal terminology database',
      'Case law quick reference',
      'Meeting transcription & notes',
      'Drafting support tools',
      'Secure encrypted storage',
      'Workflow assistance',
      '9-month warranty'
    ],
    targetAudience: 'Legal Professionals',
    color: 'from-amber-500 to-orange-600'
  }
];

export const features = [
  {
    title: 'Fast answers',
    subtitle: 'when you need them',
    description: 'Vayu helps you get quick answers in under a second. Try asking "What were India\'s Q4 GDP numbers?"',
    image: 'https://images.unsplash.com/photo-1562330744-0e81c1e9dd88?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdsYXNzZXN8ZW58MHx8fHwxNzU5MzQzOTI0fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    title: 'Helps you stay informed',
    description: 'Get helpful answers to complex questions and simple queries. Vayu assists you throughout your day.',
    image: 'https://images.unsplash.com/photo-1676743267273-c41e40d77bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwcm9mZXNzaW9uYWxzfGVufDB8fHx8MTc1OTM0MzkyOXww&ixlib=rb-4.1.0&q=85'
  },
  {
    title: 'Conversation memory',
    description: 'Vayu helps you recall important details from your conversations. Ask "Who did I talk to on Friday?" or review meeting notes.',
    image: 'https://images.pexels.com/photos/7580750/pexels-photo-7580750.jpeg'
  }
];

export const aiCapabilities = [
  {
    title: 'Real Time News',
    description: 'Get instant updates on current events and breaking news'
  },
  {
    title: 'Realtime Translation',
    description: 'Translate 40+ languages including English, Chinese, German, French, Russian, Hindi, Marathi, Spanish, Italian, Japanese, Korean, Hebrew, Arabic, Bengali, Gujarati, Tamil, Telugu, Polish, Vietnamese, and more international languages instantly'
  },
  {
    title: 'Complex Calculations',
    description: 'Solve mathematical problems and financial calculations instantly'
  }
];

export const faqData = [
  {
    question: 'What is the hardware like?',
    answer: 'Vayu X features a private heads-up display, microphone, and lasts 12+ hours on a single charge. No camera. The display is fully private—it\'s not visible to others around you.'
  },
  {
    question: 'How do you handle privacy?',
    answer: 'We take your privacy seriously. Your conversations are never used for training or sold. All audio is instantly and permanently deleted, and only the transcription is saved. We are SOC II compliant, meaning your data is handled with the highest level of care.'
  },
  {
    question: 'What can they do for me?',
    answer: 'Vayu X helps you answer questions, translate 40+ languages in real time, solve math problems, and recall important details from your conversations. MedPro and LegalEdge variants have specialized features for their respective fields.'
  },
  {
    question: 'How does Vayu X work?',
    answer: 'Vayu X listens throughout the day and proactively offers relevant help. It personalizes assistance to your habits, preferences, and professional needs.'
  },
  {
    question: 'Can I order with a prescription?',
    answer: 'Yes! All Vayu X variants ship with an option to specify your prescription at no additional cost.'
  },
  {
    question: 'What is the return policy?',
    answer: 'We offer a 7-day return policy if you don\'t like them or there\'s a functionality issue. Please contact us within 7 days of delivery to arrange a return.'
  },
  {
    question: 'When does it ship?',
    answer: 'Vayu X starts shipping March 2026. Pre-orders are fully refundable until delivery.'
  },
  {
    question: 'What languages can I use?',
    answer: 'Vayu X supports 40+ languages including English, Chinese, German, French, Russian, Hindi, Marathi, Spanish, Italian, Japanese, Korean, Hebrew, Arabic, Bengali, Gujarati, Tamil, Telugu, Polish, Vietnamese, and more international languages.'
  },
  {
    question: 'How does this compare to Ray-Ban Meta AI Glasses, B glasses from Lenskart, JioFrames, and Quark AI Glasses by Alibaba?',
    answer: 'Vayu X is built in India and designed for professional workflows. Unlike products that primarily respond to direct queries, Vayu X listens throughout your day and proactively offers relevant help. It personalizes assistance to your habits, preferences, and professional needs. Essential, MedPro, and LegalEdge editions are tailored for specific professional use cases with specialized features.'
  }
];

export const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Cardiologist, Apollo Hospitals',
    content: 'Vayu X MedPro helps me with patient handoffs and clinical notes. The workflow assistance is valuable for my practice.',
    avatar: 'https://images.pexels.com/photos/7580778/pexels-photo-7580778.jpeg',
    variant: 'healthcare'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Senior Advocate, Delhi High Court',
    content: 'The legal database access and case law references in LegalEdge help me stay organized during court proceedings.',
    avatar: 'https://images.unsplash.com/photo-1676743267273-c41e40d77bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwcm9mZXNzaW9uYWxzfGVufDB8fHx8MTc1OTM0MzkyOXww&ixlib=rb-4.1.0&q=85',
    variant: 'legal'
  },
  {
    name: 'Anita Desai',
    role: 'Product Manager, Tech Mahindra',
    content: 'Vayu X Essential works well for my daily meetings. The conversation notes help me stay on top of important details.',
    avatar: 'https://images.unsplash.com/photo-1562330744-0e81c1e9dd88?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdsYXNzZXN8ZW58MHx8fHwxNzU5MzQzOTI0fDA&ixlib=rb-4.1.0&q=85',
    variant: 'standard'
  }
];