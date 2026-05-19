'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    slug: 'starter',
    price: '299€',
    monthly: '+ 19€/mois',
    target: 'Airbnb, petits gîtes',
    highlight: false,
    desc: 'QR code livré en PDF — à imprimer et plastifier',
    features: [
      'Guide web responsive',
      'QR code inclus',
      'FR + EN',
      'Hébergement inclus',
    ],
  },
  {
    name: 'Premium',
    slug: 'premium',
    price: '599€',
    monthly: '+ 29€/mois',
    target: 'Lodges, B&B haut de gamme',
    highlight: true,
    badge: 'Le plus populaire',
    desc: 'Plaque en bois gravée avec votre QR code — livrée chez vous',
    features: [
      'Tout ce qui est dans Starter',
      'Design aux couleurs du lodge',
      'Plaque en bois gravée incluse',
      '3 langues',
      'Mises à jour illimitées',
    ],
  },
  {
    name: 'Multi-propriétés',
    slug: 'multi',
    price: 'Sur devis',
    monthly: '',
    target: 'Groupes hôteliers',
    highlight: false,
    features: [
      'Tout ce qui est dans Premium',
      'Plusieurs propriétés',
      'Tableau de bord admin',
      'Support dédié',
    ],
  },
]

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section ref={ref} className="py-20 px-5 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-forest-600 text-xs font-semibold tracking-widest uppercase mb-2">Tarifs</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
            Les 3 offres
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl p-6 ${
                plan.highlight
                  ? 'bg-forest-800 border-2 border-forest-600'
                  : 'bg-stone-50 border border-stone-100'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-cream-400 text-forest-900 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Star size={9} className="fill-forest-800" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className={`font-serif text-xl font-bold mb-0.5 ${plan.highlight ? 'text-white' : 'text-forest-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-medium ${plan.highlight ? 'text-forest-300' : 'text-stone-400'}`}>
                    {plan.target}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-2xl ${plan.highlight ? 'text-white' : 'text-forest-900'}`}>
                    {plan.price}
                  </p>
                  {plan.monthly && (
                    <p className={`text-xs ${plan.highlight ? 'text-forest-300' : 'text-stone-400'}`}>
                      {plan.monthly}
                    </p>
                  )}
                </div>
              </div>

              {'desc' in plan && plan.desc && (
                <p className={`text-xs italic mb-4 -mt-2 ${plan.highlight ? 'text-forest-300' : 'text-stone-400'}`}>
                  {plan.desc}
                </p>
              )}

              <ul className="flex flex-col gap-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-forest-300' : 'text-forest-600'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-forest-100' : 'text-stone-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/onboarding?offre=${plan.slug}`}
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-forest-800 hover:bg-forest-50'
                    : 'bg-forest-600 text-white hover:bg-forest-700'
                }`}
              >
                {plan.price === 'Sur devis' ? 'Nous contacter' : 'Choisir cette offre'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
