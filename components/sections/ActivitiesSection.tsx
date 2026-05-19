'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Waves, Mountain, Landmark, MapPin, Snowflake, Clock, Navigation } from 'lucide-react'
import { lodge } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = {
  Waves, Mountain, Landmark, MapPin, Snowflake,
}

const categoryColors: Record<string, string> = {
  Eau:        'bg-sky-100 text-sky-700',
  Randonnée:  'bg-emerald-100 text-emerald-700',
  Culture:    'bg-purple-100 text-purple-700',
  Nature:     'bg-forest-100 text-forest-700',
  Famille:    'bg-amber-100 text-amber-700',
  Hiver:      'bg-blue-100 text-blue-700',
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function ActivitiesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="activites" className="bg-white">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Dans la région
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Activités à proximité
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Mini map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-cream-200 mb-6 shadow-sm"
        >
          <iframe
            src="https://maps.google.com/maps?q=La+Roche-en-Ardenne,+Belgium&t=&z=10&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte des activités"
          />
        </motion.div>

        {/* Activities */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {lodge.activities.map((activity) => {
            const Icon = iconMap[activity.icon] || MapPin
            const colorClass = categoryColors[activity.category] || 'bg-stone-100 text-stone-600'
            return (
              <motion.div
                key={activity.name}
                variants={itemVariants}
                className={`bg-cream-50 border rounded-2xl p-4 ${activity.highlight ? 'border-forest-200 bg-forest-50' : 'border-cream-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.highlight ? 'bg-forest-700' : 'bg-white border border-cream-200'}`}>
                    <Icon size={18} className={activity.highlight ? 'text-white' : 'text-forest-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-forest-900 text-sm leading-tight">
                        {activity.name}
                      </p>
                      {activity.highlight && (
                        <span className="text-[9px] bg-wood-500 text-white font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide">
                          Top
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-xs leading-relaxed mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                        {activity.category}
                      </span>
                      <div className="flex items-center gap-1 text-stone-400">
                        <Navigation size={10} />
                        <span className="text-[11px]">{activity.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400">
                        <Clock size={10} />
                        <span className="text-[11px]">{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {activity.phone && (
                  <a
                    href={`tel:${activity.phone}`}
                    className="mt-3 flex items-center gap-1.5 text-forest-700 text-xs font-medium hover:underline"
                  >
                    <span>{activity.phone}</span>
                  </a>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
