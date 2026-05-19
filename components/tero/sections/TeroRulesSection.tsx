'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Eye, EyeOff, Wifi, Users, ArrowLeftRight, Package, Sparkles, CigaretteOff, Volume2, Car, Lock, Zap } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

const ICON_MAP: Record<string, React.ElementType> = {
  ArrowLeftRight, Package, Sparkles, CigaretteOff, Volume2, Car, Lock, Zap,
}

function RuleCard({ item, delay, isInView }: { item: { icon: string; title: string; text: string }; delay: number; isInView: boolean }) {
  const [open, setOpen] = useState(false)
  const Icon = ICON_MAP[item.icon] ?? Lock

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-stone-100 bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-tero-50 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-tero-700" />
        </div>
        <span className="flex-1 font-semibold text-stone-800 text-sm">{item.title}</span>
        <span className={`text-stone-400 transition-transform duration-200 text-base leading-none ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-stone-500 text-sm leading-relaxed pl-12">{item.text}</p>
        </div>
      )}
    </motion.div>
  )
}

export default function TeroRulesSection() {
  const { lang } = useLang()
  const tx = t[lang].rules
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [showPass, setShowPass] = useState(false)

  return (
    <section id="reglement" ref={ref} className="py-12 px-4 bg-stone-50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        {/* Wi-Fi card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-tero-700 p-5 mb-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={18} className="text-white" />
            <span className="text-white font-semibold text-sm">{tx.wifi}</span>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">{tx.network}</p>
              <p className="text-white font-semibold">{teroLodge.wifi.network}</p>
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">{tx.password}</p>
              <div className="flex items-center gap-3">
                <p className="text-white font-mono text-base tracking-wider flex-1">
                  {showPass ? teroLodge.wifi.password : '•'.repeat(teroLodge.wifi.password.length)}
                </p>
                <button
                  onClick={() => setShowPass(v => !v)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
                >
                  {showPass ? <EyeOff size={14} className="text-white/70" /> : <Eye size={14} className="text-white/70" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Check-in / out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-stone-100 bg-white p-4 mb-4"
        >
          <p className="text-stone-500 text-[10px] font-semibold tracking-widest uppercase mb-3">{tx.checkinTitle}</p>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl bg-tero-50 p-3 text-center">
              <p className="text-tero-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{tx.arrival}</p>
              <p className="font-bold text-tero-800 text-sm">{teroLodge.checkIn.arrival}</p>
            </div>
            <div className="flex-1 rounded-xl bg-stone-50 border border-stone-100 p-3 text-center">
              <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-wider mb-1">{tx.departure}</p>
              <p className="font-bold text-stone-700 text-sm">{teroLodge.checkIn.departureWeekday}</p>
              <p className="text-stone-400 text-[9px] mt-0.5">{teroLodge.checkIn.departureWeekend} (dim/ferie)</p>
            </div>
          </div>
        </motion.div>

        {/* Capacity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-stone-100 bg-white p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users size={15} className="text-tero-600" />
            <p className="text-stone-500 text-[10px] font-semibold tracking-widest uppercase">{tx.capacityTitle}</p>
          </div>
          <div className="flex gap-3">
            {[teroLodge.capacity.chasseurs, teroLodge.capacity.manoir].map((cap) => (
              <div key={cap.name} className="flex-1 rounded-xl bg-stone-50 border border-stone-100 p-3 text-center">
                <p className="font-bold text-tero-800 text-xl">{cap.guests}</p>
                <p className="text-stone-500 text-[10px] mt-0.5 leading-tight">{cap.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rules */}
        <div className="flex flex-col gap-2">
          {tx.items.map((item, i) => (
            <RuleCard key={item.title} item={item} delay={0.25 + i * 0.04} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
