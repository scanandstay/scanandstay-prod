'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, QrCode } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-5 overflow-hidden pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80"
          alt="Forêt ardennaise"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950/80 via-forest-900/70 to-forest-950/75" />
      </div>

      {/* Two-column layout */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left — text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6"
          >
            <QrCode size={13} className="text-forest-300" />
            <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">Guide digital sur QR code</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-5"
          >
            Le guide d'accueil digital qui impressionne vos voyageurs
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg"
          >
            Transformez votre PDF en guide premium accessible par QR code&nbsp;—&nbsp;en 7 jours
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-3"
          >
            <Link
              href="/guide"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-forest-800 font-semibold text-sm hover:bg-forest-50 transition-colors w-full sm:w-auto justify-center"
            >
              Voir la démo
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Right — plaque photo */}
        <motion.div
          initial={{ opacity: 0, y: 32, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 w-52 sm:w-60 lg:w-64"
        >
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '3/4',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <Image
              src="/plaque.jpg"
              alt="Plaque en bois gravée ScanAndStay"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

      </div>

      {/* Scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-6 h-9 rounded-full border-2 border-white/25 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
