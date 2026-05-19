'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  CigaretteOff, PartyPopper, Moon, Dog, Recycle,
  Flame, Droplets, KeyRound, Leaf, Lock,
} from 'lucide-react'
import { lodge } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = {
  CigaretteOff, PartyPopper, Moon, Dog, Recycle,
  Flame, Droplets, KeyRound, Leaf, Lock,
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export default function HouseRulesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="regles" className="bg-cream-50">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Pour un séjour harmonieux
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Règlement de la maison
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Rules list */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-2.5 mb-8"
        >
          {lodge.houseRules.map((rule, i) => {
            const Icon = iconMap[rule.icon] || Leaf
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-3 bg-white border border-cream-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="w-8 h-8 bg-forest-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-forest-700" />
                </div>
                <p className="text-forest-900 text-sm">{rule.text}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Environmental note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-forest-700 text-white rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Leaf size={18} className="text-forest-200 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Engagement écologique</p>
              <p className="text-forest-200 text-xs leading-relaxed">
                Le Refuge des Ardennes est engagé dans une démarche respectueuse de l&apos;environnement.
                Chauffage au bois local, panneaux solaires, récupération d&apos;eau de pluie.
                Merci de contribuer à cet effort durant votre séjour.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
