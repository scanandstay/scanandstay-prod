export type Offer = 'starter' | 'premium' | 'multi' | ''

export interface Business {
  type: string
  name: string
  address: string
  phone: string
  description: string
  recommended: boolean
}

export interface Activity {
  type: string
  name: string
  description: string
  distance: string
  duration: string
  contact: string
}

export interface OnboardingData {
  // Step 1
  establishmentName: string
  type: string
  address: string
  ownerName: string
  email: string
  phone: string
  website: string
  // Step 2
  languages: string[]
  primaryColor: string
  secondaryColor: string
  logoName: string
  style: string
  // Step 3
  checkInTime: string
  checkOutTime: string
  accessType: string
  accessInstructions: string
  maxCapacity: string
  wifiName: string
  wifiPassword: string
  // Step 4
  amenities: string[]
  // Step 5
  rules: string[]
  customRules: string
  hasEcoCommitment: boolean
  ecoCommitment: string
  // Step 6
  localResearchMode: 'self' | 'scanandstay'
  businesses: Business[]
  // Step 7
  activitiesResearchMode: 'self' | 'scanandstay'
  activities: Activity[]
  // Step 8
  photoNames: string[]
  emergencyPhone: string
  hospital: string
  doctor: string
  pharmacy: string
  // QR plates
  qrPlates: number
  // Billing
  billingName: string
  billingAddress: string
  billingPostalCity: string
  billingCountry: string
  billingEmail: string
  billingVat: string
  billingIban: string
  // Offer
  offer: Offer
}

export const defaultData: OnboardingData = {
  establishmentName: '', type: '', address: '', ownerName: '', email: '', phone: '', website: '',
  languages: ['FR'], primaryColor: '#2d741c', secondaryColor: '#faf5eb', logoName: '', style: '',
  checkInTime: '', checkOutTime: '', accessType: '', accessInstructions: '', maxCapacity: '', wifiName: '', wifiPassword: '',
  amenities: [],
  rules: [], customRules: '', hasEcoCommitment: false, ecoCommitment: '',
  localResearchMode: 'self', businesses: [],
  activitiesResearchMode: 'self', activities: [],
  photoNames: [], emergencyPhone: '', hospital: '', doctor: '', pharmacy: '',
  qrPlates: 0,
  billingName: '', billingAddress: '', billingPostalCity: '', billingCountry: 'Belgique',
  billingEmail: '', billingVat: '', billingIban: '',
  offer: '',
}

export const STEP_LABELS = [
  'Votre établissement',
  'Identité visuelle',
  'Arrivée & Départ',
  'Équipements',
  'Règles',
  'Commerces',
  'Activités',
  'Photos & Urgences',
]

export const inp = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all duration-200'
export const lbl = 'block text-sm font-semibold text-stone-700 mb-2'
