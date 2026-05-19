'use client'

import type { OnboardingData } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const CATEGORIES = [
  {
    label: 'Intérieur',
    items: ['Cheminée à bois', 'Télévision', 'Bibliothèque', 'Jeux de société', 'Billard', 'Home cinéma'],
  },
  {
    label: 'Cuisine',
    items: ['Cuisine équipée', 'Lave-vaisselle', 'Cafetière Nespresso', 'Raclette & fondue', 'Cave à vins', 'Micro-ondes'],
  },
  {
    label: 'Extérieur',
    items: ['Terrasse', 'Barbecue', 'Salon de jardin', 'Hamac', 'Parking privé', 'Piscine', 'Jacuzzi', 'Sauna'],
  },
  {
    label: 'Sport & Bien-être',
    items: ['Vélos disponibles', 'Équipement randonnée', 'Salle de sport', 'Kayak / canoë'],
  },
]

export default function Step4({ data, update }: Props) {
  const toggle = (item: string) => {
    const next = data.amenities.includes(item)
      ? data.amenities.filter(a => a !== item)
      : [...data.amenities, item]
    update({ amenities: next })
  }

  return (
    <div className="flex flex-col gap-7">
      {CATEGORIES.map(cat => (
        <div key={cat.label}>
          <p className="text-xs font-semibold text-forest-600 uppercase tracking-widest mb-3">{cat.label}</p>
          <div className="grid grid-cols-2 gap-2">
            {cat.items.map(item => {
              const checked = data.amenities.includes(item)
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    checked
                      ? 'bg-forest-50 border-forest-300 text-forest-800'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-forest-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                    checked ? 'bg-forest-600 border-forest-600' : 'border-stone-300'
                  }`}>
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="leading-tight">{item}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {data.amenities.length > 0 && (
        <p className="text-xs text-stone-400 text-center">{data.amenities.length} équipement{data.amenities.length > 1 ? 's' : ''} sélectionné{data.amenities.length > 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
