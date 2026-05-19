'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Footprints, Bike, Clock, Navigation, TrendingUp, MapPin, ChevronRight } from 'lucide-react'
import { lodge } from '@/lib/data'

const difficultyStyle: Record<string, { bg: string; text: string }> = {
  Facile:   { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Moyen:    { bg: 'bg-amber-100',   text: 'text-amber-700' },
  Difficile:{ bg: 'bg-red-100',     text: 'text-red-600' },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function WalksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  const hiking = lodge.walks.filter(w => w.type === 'hiking')
  const cycling = lodge.walks.filter(w => w.type === 'cycling')

  return (
    <section id="balades" className="bg-white">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Explorez la nature
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Balades & Randonnées
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Hiking */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="w-7 h-7 bg-forest-700 rounded-lg flex items-center justify-center">
            <Footprints size={14} className="text-white" />
          </div>
          <p className="font-semibold text-forest-900 text-sm">À pied</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-3 mb-8"
        >
          {hiking.map((walk) => <WalkCard key={walk.name} walk={walk} />)}
        </motion.div>

        {/* Cycling */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="w-7 h-7 bg-wood-600 rounded-lg flex items-center justify-center">
            <Bike size={14} className="text-white" />
          </div>
          <p className="font-semibold text-forest-900 text-sm">À vélo</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {cycling.map((walk) => <WalkCard key={walk.name} walk={walk} />)}
        </motion.div>

        {/* Bike note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <Bike size={16} className="text-wood-500 flex-shrink-0" />
          <p className="text-sm text-stone-600">
            <span className="font-semibold text-forest-900">4 vélos</span> sont mis à disposition gratuitement dans le garage.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function WalkCard({ walk }: { walk: (typeof lodge.walks)[0] }) {
  const diff = difficultyStyle[walk.difficulty] ?? { bg: 'bg-stone-100', text: 'text-stone-600' }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="bg-cream-50 border border-cream-200 rounded-2xl p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-forest-900 text-[15px] leading-tight">{walk.name}</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${diff.bg} ${diff.text}`}>
          {walk.difficulty}
        </span>
      </div>

      <p className="text-stone-500 text-xs leading-relaxed mb-3">{walk.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { icon: Navigation, label: 'Distance', value: walk.distance },
          { icon: Clock,      label: 'Durée',    value: walk.duration },
          { icon: TrendingUp, label: 'Dénivelé', value: walk.elevation },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-cream-200 rounded-xl p-2 text-center">
            <Icon size={12} className="text-forest-500 mx-auto mb-1" />
            <p className="text-forest-900 font-semibold text-xs">{value}</p>
            <p className="text-stone-400 text-[10px]">{label}</p>
          </div>
        ))}
      </div>

      {/* Start point */}
      <div className="flex items-center gap-1.5 text-stone-400 mb-2">
        <MapPin size={11} />
        <span className="text-[11px]">Départ : {walk.startPoint}</span>
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-1.5">
        {walk.highlights.map((h) => (
          <span key={h} className="text-[10px] bg-forest-50 text-forest-700 border border-forest-100 rounded-full px-2.5 py-0.5 font-medium">
            {h}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
