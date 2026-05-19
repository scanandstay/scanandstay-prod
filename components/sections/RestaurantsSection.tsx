'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MapPin, Clock, Star, Navigation } from 'lucide-react'
import { lodge } from '@/lib/data'

const priceColor: Record<string, string> = {
  '€':    'text-emerald-600',
  '€€':   'text-forest-600',
  '€€€':  'text-wood-600',
  '€€€€': 'text-amber-700',
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function RestaurantsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="restaurants" className="bg-cream-50">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Nos coups de cœur
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">Restaurants</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {lodge.restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.name}
              variants={itemVariants}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${restaurant.recommended ? 'border-forest-200' : 'border-cream-200'}`}
            >
              {restaurant.recommended && (
                <div className="bg-forest-700 px-4 py-1.5 flex items-center gap-1.5">
                  <Star size={11} className="text-wood-300 fill-wood-300" />
                  <span className="text-white text-[10px] font-semibold uppercase tracking-widest">
                    Recommandé par les propriétaires
                  </span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-forest-900 text-[15px]">{restaurant.name}</h3>
                    <p className="text-stone-400 text-xs mt-0.5">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`font-bold text-sm ${priceColor[restaurant.price]}`}>
                      {restaurant.price}
                    </span>
                    <span className="text-[10px] bg-cream-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
                      {restaurant.distance}
                    </span>
                  </div>
                </div>

                {restaurant.specialty && (
                  <p className="text-xs text-forest-700 italic mb-3 bg-forest-50 rounded-lg px-3 py-2">
                    ✦ {restaurant.specialty}
                  </p>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-500">
                    <MapPin size={12} className="flex-shrink-0 text-stone-400" />
                    <span className="text-xs">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <Clock size={12} className="flex-shrink-0 text-stone-400" />
                    <span className="text-xs">{restaurant.hours}</span>
                  </div>
                </div>

                <a
                  href={`tel:${restaurant.phone}`}
                  className="mt-3 flex items-center gap-2 bg-cream-50 hover:bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 transition-colors"
                >
                  <Phone size={13} className="text-forest-600" />
                  <span className="text-forest-700 text-sm font-medium">{restaurant.phone}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
