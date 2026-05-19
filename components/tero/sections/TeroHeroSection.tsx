'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'
import type { Lang } from '@/lib/tero-data'

const LANGS: Lang[] = ['fr', 'en', 'nl']

export default function TeroHeroSection() {
  const { lang, setLang } = useLang()
  const tx = t[lang].hero
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [showPhone, setShowPhone] = useState(false)

  return (
    <section id="accueil" className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
          alt="Tero Lodge Herbeumont"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tero-900/60 via-tero-800/40 to-tero-900/80" />
      </div>

      {/* Language selector */}
      <div className="relative z-10 flex justify-end pt-5 pr-5">
        <div className="flex gap-1 bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                lang === l
                  ? 'bg-white text-tero-800'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div ref={ref} className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 max-w-sm"
        >
          {/* Badge */}
          <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">
            {tx.badge}
          </span>

          {/* Logo / Name */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-tero-700/70 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-white tracking-wide">T</span>
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium">{tx.welcome}</p>
              <h1 className="font-serif text-4xl font-bold text-white leading-tight">
                Tero Lodge
              </h1>
              <p className="text-white/60 text-sm mt-0.5 tracking-wider">Herbeumont · Ardennes</p>
            </div>
          </div>

          {/* Address pill */}
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-white/80 text-xs text-center">
            {teroLodge.address.line1}<br />
            {teroLodge.address.postalCode} {teroLodge.address.city}
          </div>
        </motion.div>
      </div>

      {/* Emergency contact card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-4 mb-6"
      >
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 max-w-sm mx-auto">
          <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mb-3">
            {tx.emergencyContact}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">{teroLodge.emergency.name}</p>
              <p className="text-white/60 text-xs mt-0.5">{teroLodge.emergency.email}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${teroLodge.emergency.phone}`}
                className="w-9 h-9 rounded-full bg-tero-500/60 flex items-center justify-center border border-white/20"
              >
                <Phone size={14} className="text-white" />
              </a>
              <a
                href={`mailto:${teroLodge.emergency.email}`}
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20"
              >
                <Mail size={14} className="text-white" />
              </a>
            </div>
          </div>
          {showPhone && (
            <p className="mt-2 text-center text-white font-mono text-base tracking-wider">
              {teroLodge.emergency.phone}
            </p>
          )}
          <button
            onClick={() => setShowPhone(v => !v)}
            className="mt-2 w-full text-center text-white/40 text-[10px] underline underline-offset-2"
          >
            {showPhone ? '−' : teroLodge.emergency.phone}
          </button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  )
}
