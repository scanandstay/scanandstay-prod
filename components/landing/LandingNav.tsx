'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className={`font-serif text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-forest-800' : 'text-white'}`}>
            ScanAndStay
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/guide"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            scrolled
              ? 'bg-forest-600 text-white'
              : 'bg-white/15 text-white border border-white/30 backdrop-blur-sm'
          }`}
        >
          Voir la démo
        </Link>
      </div>
    </motion.header>
  )
}
