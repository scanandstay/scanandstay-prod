'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, Copy, Check, ExternalLink } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

export default function TeroAccessSection() {
  const { lang } = useLang()
  const tx = t[lang].access
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(teroLodge.address.full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="acces" ref={ref} className="py-12 px-4 bg-white">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border border-stone-100 mb-4 shadow-sm"
        >
          <iframe
            src={teroLodge.address.mapsEmbed}
            width="100%"
            height="200"
            className="block"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Address card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-stone-100 bg-stone-50 p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-tero-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={16} className="text-tero-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm">{teroLodge.address.line1}</p>
              <p className="text-stone-500 text-sm">{teroLodge.address.postalCode} {teroLodge.address.city}, {teroLodge.address.country}</p>
            </div>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              {copied
                ? <Check size={14} className="text-tero-600" />
                : <Copy size={14} className="text-stone-400" />
              }
            </button>
          </div>
          <a
            href={teroLodge.address.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-tero-700 text-white text-sm font-semibold"
          >
            <ExternalLink size={14} />
            {tx.openMaps}
          </a>
        </motion.div>

        {/* Travel times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-stone-500 text-xs font-semibold tracking-widest uppercase mb-3">{tx.travelTimes}</p>
          <div className="flex gap-3">
            {teroLodge.travelTimes.map((tt, i) => (
              <motion.div
                key={tt.city}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 rounded-2xl bg-tero-50 border border-tero-100 p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock size={12} className="text-tero-500" />
                  <span className="font-bold text-tero-800 text-base">{tt.time}</span>
                </div>
                <p className="text-tero-700 font-semibold text-xs">{tt.city}</p>
                <p className="text-tero-500 text-[10px] mt-0.5">{tt.km}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
