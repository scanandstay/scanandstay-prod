'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home, MapPin, Key, Wifi, BookOpen,
  Compass, Utensils, Map, Phone, Camera,
} from 'lucide-react'

const navItems = [
  { id: 'accueil',      label: 'Accueil',   Icon: Home },
  { id: 'acces',        label: 'Accès',     Icon: MapPin },
  { id: 'checkin',      label: 'Check-in',  Icon: Key },
  { id: 'equipements',  label: 'Équip.',    Icon: Wifi },
  { id: 'regles',       label: 'Règles',    Icon: BookOpen },
  { id: 'activites',    label: 'Activités', Icon: Compass },
  { id: 'restaurants',  label: 'Restau.',   Icon: Utensils },
  { id: 'balades',      label: 'Balades',   Icon: Map },
  { id: 'urgences',     label: 'Urgences',  Icon: Phone },
  { id: 'galerie',      label: 'Galerie',   Icon: Camera },
]

export default function BottomNav() {
  const [active, setActive] = useState('accueil')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-cream-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-0.5 max-w-lg mx-auto">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200 flex-shrink-0 min-w-[58px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-forest-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-forest-700' : 'text-stone-400'}`}
              />
              <span
                className={`relative z-10 text-[9.5px] font-medium transition-colors duration-200 ${isActive ? 'text-forest-700' : 'text-stone-400'}`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
