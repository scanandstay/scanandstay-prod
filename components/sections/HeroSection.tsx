'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, ChevronDown } from 'lucide-react'
import { lodge } from '@/lib/data'

export default function HeroSection() {
  return (
    <section id="accueil" className="relative h-screen overflow-hidden">
      {/* Background */}
      <Image
        src="https://picsum.photos/id/1018/1920/1080"
        alt="Paysage ardennais"
        fill
        priority
        sizes="100vw"
        className="object-cover scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/55 via-forest-950/25 to-forest-950/88" />

      {/* Top badge */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-5 py-1.5"
        >
          <span className="text-white/85 text-[10px] font-semibold tracking-[0.25em] uppercase">
            ScanAndStay · Guide Numérique
          </span>
        </motion.div>
      </div>

      {/* Hero text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6 text-center -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <p className="text-wood-300 text-[11px] font-semibold tracking-[0.3em] uppercase mb-5">
            Bienvenue au
          </p>
          <h1 className="font-serif text-[42px] leading-[1.15] font-semibold">
            Le Refuge
            <br />
            <span className="text-wood-300 italic">des Ardennes</span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-14 h-px bg-wood-400/70 mx-auto my-6"
            style={{ transformOrigin: 'center' }}
          />

          <div className="flex items-center justify-center gap-1.5 text-white/65 text-sm">
            <MapPin size={13} />
            <span className="font-light tracking-wide">La Roche-en-Ardenne · Belgique</span>
          </div>
        </motion.div>
      </div>

      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-20 left-4 right-4 z-10 max-w-md mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
          <p className="text-white/90 text-[13px] leading-relaxed italic font-light">
            &ldquo;{lodge.ownerMessage.substring(0, 155)}&hellip;&rdquo;
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-wood-300 text-[11px] font-semibold tracking-wide">
              — {lodge.owners}
            </p>
            <div className="w-6 h-px bg-wood-400/50" />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-7 left-0 right-0 z-10 flex justify-center"
      >
        <ChevronDown className="text-white/40" size={22} />
      </motion.div>
    </section>
  )
}
