'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ClipboardList, Wrench, QrCode, Smile } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: "Vous remplissez notre formulaire d'onboarding",
    desc: 'Infos pratiques, règles, activités, photos — on guide tout.',
  },
  {
    icon: Wrench,
    title: 'On construit votre guide en 5 jours',
    desc: 'Design aux couleurs de votre établissement, trilingue, mobile-first.',
  },
  {
    icon: QrCode,
    title: 'Vous recevez votre QR code + plaque en bois gravée',
    desc: "À poser dans le lodge. Vos voyageurs scannent dès l'arrivée.",
  },
  {
    icon: Smile,
    title: 'Vos voyageurs scannent et profitent',
    desc: 'Guide accessible en 1 clic, sur tous les téléphones, sans app.',
  },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section ref={ref} className="py-20 px-5 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-forest-600 text-xs font-semibold tracking-widest uppercase mb-2">Processus</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
            Comment ça marche
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 rounded-2xl bg-white border border-stone-100 p-5"
              >
                {/* Step number + icon */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-forest-400 tracking-wider">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-forest-900 text-sm mb-1">{step.title}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
