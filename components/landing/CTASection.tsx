'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  const handleWrite = () => {
    window.location.href = `mailto:romthomas@icloud.com?subject=${encodeURIComponent('Question ScanAndStay')}`
  }

  return (
    <section id="contact" ref={ref} className="py-20 px-5 bg-forest-900 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-forest-700/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-forest-800/40 blur-2xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-forest-400 text-xs font-semibold tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Une question avant de vous lancer ?
          </h2>
          <p className="text-forest-300 text-sm mb-8">On vous répond sous 24h ouvrables.</p>

          <button
            type="button"
            onClick={handleWrite}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cream-400 text-forest-900 font-semibold text-sm hover:bg-cream-300 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <Mail size={16} />
            Nous écrire
          </button>

          <p className="text-forest-600 text-xs mt-4">Ou choisissez directement votre offre ci-dessus</p>
        </motion.div>
      </div>
    </section>
  )
}
