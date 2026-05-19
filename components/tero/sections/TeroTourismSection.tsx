'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Globe, Mail, Flag, Gamepad2, Bike, Wine, Landmark, Church, Mountain, TreePine, Star, CloudRain } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

const ICON_MAP: Record<string, React.ElementType> = {
  Flag, Gamepad2, Bike, Wine, Landmark, Church, Mountain, TreePine,
}

const ACTIVITY_CATEGORY: Record<string, string> = {
  karting: 'Sport',
  fungalaxy: 'Famille',
  bike: 'Vélo',
  wine: 'Dégustation',
  chateau: 'Culture',
  orval: 'Culture',
  ardoise: 'Nature',
  aventure: 'Aventure',
}

const CATEGORY_COLORS: Record<string, string> = {
  Sport: 'bg-orange-50 text-orange-600',
  Famille: 'bg-purple-50 text-purple-600',
  Vélo: 'bg-tero-50 text-tero-700',
  Dégustation: 'bg-red-50 text-red-600',
  Culture: 'bg-amber-50 text-amber-700',
  Nature: 'bg-green-50 text-green-700',
  Aventure: 'bg-teal-50 text-teal-700',
}

export default function TeroTourismSection() {
  const { lang } = useLang()
  const tx = t[lang].tourism
  const descs = tx.descs as Record<string, string>
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="tourisme" ref={ref} className="py-12 px-4 bg-stone-50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {teroLodge.activities.map((activity, i) => {
            const Icon = ICON_MAP[activity.icon] ?? Landmark
            const cat = ACTIVITY_CATEGORY[activity.id] ?? 'Culture'
            const colorClass = CATEGORY_COLORS[cat] ?? 'bg-stone-50 text-stone-600'

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-stone-100 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-800 text-sm leading-tight">{activity.name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorClass}`}>
                            {tx.category[cat]}
                          </span>
                          {activity.highlight && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 flex items-center gap-0.5">
                              <Star size={9} className="fill-amber-500 text-amber-500" />
                              {tx.recommended}
                            </span>
                          )}
                          {activity.badWeather && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-500 flex items-center gap-0.5">
                              <CloudRain size={9} />
                              {tx.badWeather}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {activity.phone && (
                          <a href={`tel:${activity.phone}`} className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                            <Phone size={13} className="text-stone-500" />
                          </a>
                        )}
                        {activity.email && (
                          <a href={`mailto:${activity.email}`} className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                            <Mail size={13} className="text-stone-500" />
                          </a>
                        )}
                        {activity.website && (
                          <a href={`https://${activity.website}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                            <Globe size={13} className="text-stone-500" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-stone-500 text-xs leading-relaxed">{descs[activity.id]}</p>
                    {(activity.address || activity.contactName) && (
                      <p className="text-stone-400 text-[10px] mt-1.5">
                        {activity.contactName && <span>{activity.contactName}{activity.address ? ' · ' : ''}</span>}
                        {activity.address}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
