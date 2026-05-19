'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TestimonialsSection() {
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
          <p className="text-forest-600 text-xs font-semibold tracking-widest uppercase mb-2">Clients</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
            Ils nous font confiance
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white border border-stone-100 overflow-hidden shadow-sm"
        >
          {/* Image banner */}
          <div className="relative h-48 sm:h-56">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75"
              alt="Tero Lodge Herbeumont"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <p className="text-white font-serif text-xl font-bold">Tero Lodge</p>
              <p className="text-white/70 text-sm">Herbeumont · Ardennes</p>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[10px] font-semibold backdrop-blur-sm">
                Premium · FR / EN / NL
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-stone-600 text-sm leading-relaxed mb-5">
              "Guide trilingue FR/EN/NL pour leur lodge premium en Ardennes — balades, activités, urgences et galerie photo, tout en un QR code."
            </p>
            <Link
              href="/tero"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition-colors"
            >
              Voir le guide
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
