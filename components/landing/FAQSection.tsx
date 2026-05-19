'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Combien de temps pour recevoir mon guide ?',
    a: "5 à 7 jours ouvrables après réception de votre formulaire d'onboarding complété. En cas d'urgence, un délai accéléré est possible sur demande.",
  },
  {
    q: 'Puis-je modifier le contenu après livraison ?',
    a: 'Oui, les mises à jour sont incluses dans votre abonnement mensuel. Envoyez vos modifications par email ou via notre formulaire et elles sont appliquées sous 48h.',
  },
  {
    q: 'Le guide fonctionne sur tous les téléphones ?',
    a: "Oui, le guide est optimisé pour iOS et Android, sans installation d'application. Il s'ouvre directement dans le navigateur en scannant le QR code.",
  },
  {
    q: "Que se passe-t-il si j'arrête l'abonnement ?",
    a: "Le guide reste en ligne 30 jours après la fin de l'abonnement, puis est archivé. Vous pouvez le réactiver à tout moment en reprenant un abonnement.",
  },
]

function FAQItem({ item, i, isInView }: { item: typeof faqs[0]; i: number; isInView: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-stone-100 bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
      >
        <span className="font-semibold text-forest-900 text-sm leading-snug">{item.q}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-forest-600' : 'bg-stone-100'}`}>
          {open
            ? <Minus size={13} className="text-white" />
            : <Plus size={13} className="text-stone-500" />
          }
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-stone-500 text-sm leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
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
          <p className="text-forest-600 text-xs font-semibold tracking-widest uppercase mb-2">Questions fréquentes</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">FAQ</h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} item={item} i={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
