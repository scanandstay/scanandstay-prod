'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { LogIn, LogOut, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { lodge } from '@/lib/data'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function CheckInSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [showCode, setShowCode] = useState(false)

  return (
    <section id="checkin" className="bg-cream-50">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Informations pratiques
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Check-in & Check-out
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Time cards */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          <div className="bg-forest-700 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <LogIn size={16} className="text-forest-200" />
              <span className="text-forest-200 text-xs font-semibold uppercase tracking-wider">Arrivée</span>
            </div>
            <p className="font-serif text-3xl font-semibold">
              {lodge.checkIn.arrivalTime.replace(':', 'h')}
            </p>
            <p className="text-forest-200 text-xs mt-1">À partir de</p>
          </div>

          <div className="bg-white border border-cream-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <LogOut size={16} className="text-wood-500" />
              <span className="text-wood-600 text-xs font-semibold uppercase tracking-wider">Départ</span>
            </div>
            <p className="font-serif text-3xl font-semibold text-forest-900">
              {lodge.checkIn.departureTime.replace(':', 'h')}
            </p>
            <p className="text-stone-400 text-xs mt-1">Au plus tard</p>
          </div>
        </motion.div>

        {/* Key box */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.25 }}
          className="bg-white border border-cream-200 rounded-2xl p-4 mb-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-wood-100 rounded-lg flex items-center justify-center">
                <KeyRound size={15} className="text-wood-600" />
              </div>
              <div>
                <p className="font-semibold text-forest-900 text-sm">Boîte à clés</p>
                <p className="text-stone-400 text-xs">À droite de la porte d&apos;entrée</p>
              </div>
            </div>
          </div>

          <div className="bg-cream-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 mb-1">Code d&apos;accès</p>
              <p className="font-serif text-3xl font-bold tracking-[0.25em] text-forest-900">
                {showCode ? lodge.checkIn.keyBoxCode : '••••'}
              </p>
            </div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="w-9 h-9 rounded-xl bg-white border border-cream-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              {showCode ? <EyeOff size={15} className="text-stone-400" /> : <Eye size={15} className="text-stone-400" />}
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            Tournez la molette dans le sens horaire
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Instructions d&apos;arrivée
          </p>
          <div className="space-y-2.5">
            {lodge.checkIn.instructions.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex gap-3 items-start"
              >
                <div className="w-6 h-6 rounded-full bg-forest-700 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-forest-900 leading-relaxed">{step}</p>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              className="flex gap-3 items-center mt-4 pt-4 border-t border-cream-200"
            >
              <CheckCircle2 size={18} className="text-forest-600 flex-shrink-0" />
              <p className="text-sm text-forest-700 font-medium">
                Bonne installation — profitez bien de votre séjour !
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
