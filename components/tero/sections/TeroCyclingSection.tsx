'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bike, Timer, Ruler, MapPin } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', dot: 'bg-green-500' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
  hard: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' },
}

export default function TeroCyclingSection() {
  const { lang } = useLang()
  const tx = t[lang].cycling
  const descs = tx.descs as Record<string, string>
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="velo" ref={ref} className="py-12 px-4 bg-stone-50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {teroLodge.cycling.map((route, i) => {
            const colors = DIFFICULTY_COLORS[route.difficulty]
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-2xl border ${colors.border} ${colors.bg} p-4`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0 mt-1`} />
                    <h3 className="font-semibold text-stone-800 text-sm leading-snug">{route.name}</h3>
                  </div>
                  <a
                    href={route.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[10px] font-semibold text-stone-600 flex-shrink-0"
                  >
                    <MapPin size={10} />
                    {tx.openMaps}
                  </a>
                </div>

                {/* Bike type badge */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Bike size={12} className={colors.text} />
                  <span className={`text-xs font-medium ${colors.text}`}>{route.bikeType}</span>
                </div>

                <p className={`text-xs mb-3 leading-relaxed ${colors.text}`}>{descs[route.id]}</p>

                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-white/70 p-2.5 text-center">
                    <Ruler size={13} className="text-stone-400 mx-auto mb-1" />
                    <p className="font-bold text-stone-700 text-sm">{route.distance}</p>
                    <p className="text-stone-400 text-[10px]">{tx.distance}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/70 p-2.5 text-center">
                    <Timer size={13} className="text-stone-400 mx-auto mb-1" />
                    <p className="font-bold text-stone-700 text-sm">{route.duration}</p>
                    <p className="text-stone-400 text-[10px]">{tx.duration}</p>
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
