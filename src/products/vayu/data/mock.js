// Mock data for Vayu smart glasses website

export const productVariants = [
  {
    id: 'standard',
    name: 'Vayu Essential',
    description: 'Perfect for everyday productivity and smart assistance',
    price: 49999,
    originalPrice: 59999,
    features: [
      'Real-time AI assistance',
      'Voice commands & responses', 
      'Basic memory recall',
      '8-hour battery life',
      'Multi-language support',
      '6-month warranty'
    ],
    targetAudience: 'Professionals & Students',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'healthcare',
    name: 'Vayu MedPro',
    description: 'Advanced features for healthcare professionals',
    price: 79999,
    originalPrice: 89999,
    features: [
      'Medical terminology recognition',
      'Patient data integration',
      'HIPAA compliant privacy',
      'Extended 12-hour battery',
      'Prescription lens compatible',
      'Medical database access',
      '1-year warranty + priority support'
    ],
    targetAudience: 'Healthcare Professionals',
    color: 'from-green-500 to-teal-600',
    popular: true
  },
  {
    id: 'legal',
    name: 'Vayu LegalEdge',
    description: 'Specialized for legal professionals and consultants',
    price: 59999,
    originalPrice: 69999,
    features: [
      'Legal terminology database',
      'Case law quick reference',
      'Meeting transcription & notes',
      '10-hour battery life',
      'Secure encrypted storage',
      'Legal document scanning',
      '9-month warranty'
    ],
    targetAudience: 'Legal Professionals',
    color: 'from-amber-500 to-orange-600'
  }
];

export const features = [
  {
    title: 'Superhuman Intelligence',
    subtitle: 'in under a second',
    description: 'Built for speed, Vayu can respond to questions in <900ms. Try asking "What were India\'s Q4 GDP numbers?"',
    image: 'https://images.unsplash.com/photo-1562330744-0e81c1e9dd88?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdsYXNzZXN8ZW58MHx8fHwxNzU5MzQzOTI0fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    title: 'Never lose another debate',
    description: 'Get expert-level answers instantly. From complex problems to simple questions, Vayu makes you the smartest person in any room.',
    image: 'https://images.unsplash.com/photo-1676743267273-c41e40d77bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwcm9mZXNzaW9uYWxzfGVufDB8fHx8MTc1OTM0MzkyOXww&ixlib=rb-4.1.0&q=85'
  },
  {
    title: 'Infinite Memory',
    description: 'Vayu remembers everything you tell it. Ask it "Who did I talk to on Friday?" or recall important meeting details.',
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
    description: 'Translate 40+ languages including Hindi, Tamil, Bengali instantly'
  },
  {
    title: 'Complex Calculations',
    description: 'Solve mathematical problems and financial calculations instantly'
  }
];

export const faqData = [
  {
    question: 'What is the hardware like?',
    answer: 'Vayu glasses feature a waveguide display, microphone, and last 8-12 hours on a single charge depending on the variant. No camera for complete privacy. The display is fully private--it\'s not visible to others around you.'
  },
  {
    question: 'How do you handle privacy?',
    answer: 'We take your privacy seriously. Your conversations are never used for training or sold. All audio is instantly and permanently deleted, and only the transcription is saved. We are SOC II compliant, meaning your data is handled with the highest level of care.'
  },
  {
    question: 'What can they do for me?',
    answer: 'They can answer any question, translate any language in real time, do math instantly, and give you perfect memory of everything you\'ve discussed. Healthcare and Legal variants have specialized features for their respective fields.'
  },
  {
    question: 'What\'s the difference from other smart glasses?',
    answer: 'Unlike other smart glasses that only help when you directly ask, Vayu AI glasses listen throughout the day—proactively offering relevant help and deeply personalizing assistance to your habits, preferences, and professional needs.'
  },
  {
    question: 'Can I order with a prescription?',
    answer: 'Yes! All Vayu variants ship with an option to specify your prescription at no additional cost.'
  },
  {
    question: 'What is the return policy?',
    answer: 'We accept returns only for defective products. If you receive an item that is damaged or not functioning properly, please contact us within 30 days of delivery to arrange a return.'
  },
  {
    question: 'When does it ship?',
    answer: 'Vayu glasses start shipping March 2026. Pre-orders are fully refundable until delivery.'
  },
  {
    question: 'What languages can I use?',
    answer: 'Vayu supports 40+ languages including English, Hindi, Tamil, Bengali, Marathi, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Urdu, and major international languages.'
  }
];

export const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Cardiologist, Apollo Hospitals',
    content: 'Vayu MedPro has revolutionized my patient consultations. The instant medical reference and note-taking capabilities are incredible.',
    avatar: 'https://images.pexels.com/photos/7580778/pexels-photo-7580778.jpeg',
    variant: 'healthcare'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Senior Advocate, Delhi High Court',
    content: 'The legal database access and real-time case law references in LegalEdge have made me more efficient in court proceedings.',
    avatar: 'https://images.unsplash.com/photo-1676743267273-c41e40d77bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwcm9mZXNzaW9uYWxzfGVufDB8fHx8MTc1OTM0MzkyOXww&ixlib=rb-4.1.0&q=85',
    variant: 'legal'
  },
  {
    name: 'Anita Desai',
    role: 'Product Manager, Tech Mahindra',
    content: 'Vayu Essential is perfect for my daily meetings and brainstorming sessions. The memory recall feature is a game-changer.',
    avatar: 'https://images.unsplash.com/photo-1562330744-0e81c1e9dd88?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdsYXNzZXN8ZW58MHx8fHwxNzU5MzQzOTI0fDA&ixlib=rb-4.1.0&q=85',
    variant: 'standard'
  }
];