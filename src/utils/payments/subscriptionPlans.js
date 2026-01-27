/**
 * Subscription plans configuration
 * Source of truth for pricing plans
 */
export const SUBSCRIPTION_PLANS = [
  {
    id: 'byonco-pro',
    name: 'ByOnco PRO',
    subtitle: 'For Patients & Families',
    amount: 99,
    currency: 'INR',
    period: '/week',
    description: 'Complete access to AI-powered oncology navigation',
    features: [
      'Real-time bed & queue visibility across India',
      'AI hospital and doctor matching',
      'Subsidy and trial matching',
      'Fast second opinions (<12h)',
      'Multilingual app support',
      'Treatment cost estimates',
      'Medical tourism packages',
      'Dedicated care coordinator',
    ],
    popular: true,
    color: 'from-purple-500 to-violet-600',
    serviceType: 'subscription_byonco_pro'
  },
  {
    id: 'hospital-saas',
    name: 'Hospital SaaS',
    subtitle: 'For Cancer Centers',
    amount: 15000,
    currency: 'INR',
    period: '/month',
    description: 'Enterprise dashboard for qualified international referrals',
    features: [
      'Qualified international patient referrals',
      'Complete case documentation packets',
      'Real-time bed & queue analytics',
      'Patient conversion tracking',
      'Revenue forecasting tools',
      'Referral performance reporting',
      'EMR integration support',
      'Dedicated account manager',
    ],
    popular: false,
    color: 'from-cyan-500 to-blue-600',
    serviceType: 'subscription_hospital_saas',
    cta: 'Request Demo' // This one stays as Request Demo
  }
];

/**
 * Get plan by ID
 */
export function getPlanById(planId) {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

/**
 * Get plan by service type
 */
export function getPlanByServiceType(serviceType) {
  return SUBSCRIPTION_PLANS.find(plan => plan.serviceType === serviceType);
}

