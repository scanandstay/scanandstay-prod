'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Wifi, Flame, Thermometer, Tv, BookOpen, Gamepad2,
  ChefHat, Waves, Coffee, Utensils, Wine, Zap,
  TreePine, Armchair, Moon, Car, Bike, Droplets,
  RefreshCw, MapPin, ShieldCheck, Eye, EyeOff,
} from 'lucide-react'
import { lodge } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = {
  Wifi, Flame, Thermometer, Tv, BookOpen, Gamepad2,
  ChefHat, Waves, Coffee, Utensils, Wine, Zap,
  TreePine, Armchair, Moon, Car, Bike, Droplets,
  RefreshCw, MapPin, ShieldCheck, Logs: Flame,
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

function CategoryBlock({ category, delay }: { category: (typeof lodge.amenities)[0]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <div ref={ref}>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay }}
        className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3"
      >
        {category.category}
      </motion.p>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-3 gap-2"
      >
        {category.items.map((item) => {
          const Icon = iconMap[item.icon] ?? Wifi
          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              className="bg-cream-50 border border-cream-200 rounded-xl p-3 flex flex-col items-center text-center gap-1.5"
            >
              <div className="w-8 h-8 bg-forest-50 rounded-lg flex items-center justify-center">
                <Icon size={15} className="text-forest-700" />
              </div>
              <p className="text-forest-900 text-[11px] font-medium leading-tight">{item.name}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default function AmenitiesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section id="equipements" className="bg-white">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            Tout ce qu&apos;il faut
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Équipements & La maison
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* WiFi card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-forest-700 rounded-2xl p-4 mb-7 text-white shadow-md"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wifi size={18} className="text-forest-200" />
            <span className="text-forest-200 text-xs font-semibold uppercase tracking-wider">Wi-Fi</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-forest-200 uppercase tracking-widest mb-0.5">Réseau</p>
              <p className="font-semibold text-sm">{lodge.wifi.network}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2.5 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-forest-200 uppercase tracking-widest mb-0.5">Mot de passe</p>
                <p className="font-semibold text-sm font-mono tracking-wide">
                  {showPassword ? lodge.wifi.password : '••••••••••••••'}
                </p>
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category blocks */}
        <div className="space-y-7">
          {lodge.amenities.map((category, i) => (
            <CategoryBlock key={category.category} category={category} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  )
}
