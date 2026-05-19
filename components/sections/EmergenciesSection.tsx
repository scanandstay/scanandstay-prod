'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Shield, Flame, AlertTriangle, Hospital, Pill, Stethoscope, User, Mail, MessageCircle } from 'lucide-react'
import { lodge } from '@/lib/data'

const emergencyStyle: Record<string, { bg: string; icon: React.ElementType }> = {
  red:    { bg: 'bg-red-600',    icon: Phone },
  blue:   { bg: 'bg-blue-700',   icon: Shield },
  orange: { bg: 'bg-orange-600', icon: Flame },
  yellow: { bg: 'bg-amber-500',  icon: AlertTriangle },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function EmergenciesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const { emergencies } = lodge

  return (
    <section id="urgences" className="bg-cream-50">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            En cas de besoin
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">
            Contacts & Urgences
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Emergency numbers */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-2.5 mb-7"
        >
          {emergencies.numbers.map((item) => {
            const { bg, icon: Icon } = emergencyStyle[item.color] ?? emergencyStyle.red
            return (
              <motion.a
                key={item.name}
                variants={itemVariants}
                href={`tel:${item.number.replace(/\s/g, '')}`}
                className={`${bg} text-white rounded-2xl p-4 flex flex-col gap-1 active:opacity-80 transition-opacity`}
              >
                <Icon size={20} className="opacity-80" />
                <p className="font-serif font-bold text-2xl tracking-wide leading-none mt-1">
                  {item.number}
                </p>
                <p className="font-semibold text-xs opacity-90">{item.name}</p>
                <p className="text-[10px] opacity-70">{item.description}</p>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Contact cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Contacts locaux
          </p>

          {/* Owner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-forest-700 text-white rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <User size={15} className="text-forest-200" />
              <p className="text-forest-200 text-xs font-semibold uppercase tracking-wider">Propriétaire</p>
            </div>
            <p className="font-semibold text-[15px] mb-3">{emergencies.owner.name}</p>
            <div className="flex gap-2">
              <a href={`tel:${emergencies.owner.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-xl py-2.5 transition-colors text-sm font-medium">
                <Phone size={13} />
                Appeler
              </a>
              <a href={`https://wa.me/${emergencies.owner.phone.replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-xl py-2.5 transition-colors text-sm font-medium">
                <MessageCircle size={13} />
                WhatsApp
              </a>
              <a href={`mailto:${emergencies.owner.email}`}
                className="flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2.5 transition-colors">
                <Mail size={13} />
              </a>
            </div>
          </motion.div>

          {/* Hospital */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border border-cream-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Hospital size={18} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-forest-900 text-sm">{emergencies.hospital.name}</p>
                <p className="text-stone-400 text-xs">{emergencies.hospital.address}</p>
                <p className="text-stone-400 text-xs mt-0.5">{emergencies.hospital.distance}</p>
              </div>
            </div>
            <a href={`tel:${emergencies.hospital.phone}`}
              className="mt-3 flex items-center gap-2 bg-red-50 hover:bg-red-100 rounded-xl px-3 py-2.5 transition-colors">
              <Phone size={13} className="text-red-500" />
              <span className="text-red-600 font-medium text-sm">{emergencies.hospital.phone}</span>
            </a>
          </motion.div>

          {/* Pharmacy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white border border-cream-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Pill size={18} className="text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-forest-900 text-sm">{emergencies.pharmacy.name}</p>
                <p className="text-stone-400 text-xs">{emergencies.pharmacy.address}</p>
                <p className="text-stone-400 text-xs">{emergencies.pharmacy.hours}</p>
                <p className="text-stone-400 text-xs mt-0.5">{emergencies.pharmacy.distance}</p>
              </div>
            </div>
            <a href={`tel:${emergencies.pharmacy.phone}`}
              className="mt-3 flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-3 py-2.5 transition-colors">
              <Phone size={13} className="text-emerald-600" />
              <span className="text-emerald-700 font-medium text-sm">{emergencies.pharmacy.phone}</span>
            </a>
          </motion.div>

          {/* Doctor */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white border border-cream-200 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Stethoscope size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-forest-900 text-sm">{emergencies.doctor.name}</p>
                <p className="text-stone-400 text-xs">{emergencies.doctor.address}</p>
                <p className="text-stone-400 text-xs">{emergencies.doctor.hours}</p>
                <p className="text-stone-400 text-xs mt-0.5">{emergencies.doctor.distance}</p>
              </div>
            </div>
            <a href={`tel:${emergencies.doctor.phone}`}
              className="mt-3 flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2.5 transition-colors">
              <Phone size={13} className="text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">{emergencies.doctor.phone}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
