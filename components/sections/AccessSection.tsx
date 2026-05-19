'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, Navigation, Copy, Check, Car } from 'lucide-react'
import { lodge } from '@/lib/data'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function AccessSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(lodge.address.full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="acces" className="bg-white">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Comment nous trouver
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">Plan d&apos;accès</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Address card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
          className="bg-cream-50 border border-cream-200 rounded-2xl p-4 mb-4 flex items-start justify-between gap-3"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-forest-900 text-sm">{lodge.address.line1}</p>
              <p className="text-stone-500 text-sm">{lodge.address.postalCode} {lodge.address.city}</p>
              <p className="text-stone-400 text-xs mt-0.5">{lodge.address.country}</p>
            </div>
          </div>
          <button
            onClick={copyAddress}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-cream-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            {copied ? <Check size={14} className="text-forest-600" /> : <Copy size={14} className="text-stone-400" />}
          </button>
        </motion.div>

        {/* Map */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.25 }}
          className="rounded-2xl overflow-hidden border border-cream-200 mb-4 shadow-sm"
        >
          <iframe
            src={lodge.address.mapsEmbed}
            width="100%"
            height="240"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte Google Maps — Le Refuge des Ardennes"
          />
        </motion.div>

        {/* Travel times */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Temps de trajet
          </p>
          <div className="grid grid-cols-2 gap-2">
            {lodge.travelTimes.map((item) => (
              <div
                key={item.city}
                className="bg-cream-50 border border-cream-200 rounded-xl p-3 flex items-center gap-2.5"
              >
                <Car size={14} className="text-wood-500 flex-shrink-0" />
                <div>
                  <p className="text-forest-900 font-semibold text-sm">{item.city}</p>
                  <p className="text-stone-400 text-xs">{item.time} · {item.km}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.a
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.45 }}
          href={lodge.address.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
        >
          <Navigation size={16} />
          Ouvrir dans Google Maps
        </motion.a>
      </div>
    </section>
  )
}
