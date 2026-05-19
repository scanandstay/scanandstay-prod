'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { X, Check } from 'lucide-react'

const comparisons = [
  {
    problem: 'Imprimé, pas à jour, pas mobile',
    solution: 'QR code, modifiable en temps réel, app-like',
  },
  {
    problem: 'Aucune information locale',
    solution: 'Restos, balades, activités intégrés',
  },
  {
    problem: 'Zéro personnalisation',
    solution: 'Aux couleurs de votre établissement',
  },
]

export default function ProblemSection() {
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
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
            Fini le PDF que personne ne lit
          </h2>
          <p className="text-stone-500 text-base">Comparez l'expérience pour vos voyageurs</p>
        </motion.div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-3 mb-3 px-1"
        >
          <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-stone-100">
            <X size={14} className="text-red-500" />
            <span className="font-semibold text-stone-600 text-sm">PDF classique</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-forest-50">
            <Check size={14} className="text-forest-600" />
            <span className="font-semibold text-forest-700 text-sm">Guide ScanAndStay</span>
          </div>
        </motion.div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {comparisons.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 flex items-start gap-2.5">
                <X size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-stone-500 text-sm leading-snug">{row.problem}</p>
              </div>
              <div className="rounded-2xl border border-forest-100 bg-forest-50 p-4 flex items-start gap-2.5">
                <Check size={15} className="text-forest-600 flex-shrink-0 mt-0.5" />
                <p className="text-forest-800 text-sm font-medium leading-snug">{row.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
