'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, Building2, User, Pill, Shield, Smile } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

const MAIN_NUMBER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  red:   { bg: 'bg-red-500',  text: 'text-white', border: 'border-red-400' },
  blue:  { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500' },
  amber: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400' },
  sky:   { bg: 'bg-sky-500',  text: 'text-white', border: 'border-sky-400' },
}

function ServiceCard({ icon: Icon, label, name, address }: { icon: React.ElementType; label: string; name: string; address: string }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-stone-600" />
        </div>
        <div>
          <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{label}</p>
          <p className="font-semibold text-stone-800 text-sm">{name}</p>
          <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{address}</p>
        </div>
      </div>
    </div>
  )
}

export default function TeroEmergenciesSection() {
  const { lang } = useLang()
  const tx = t[lang].emergencies
  const numberDescs = tx.numberDescs as Record<string, string>
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="urgences" ref={ref} className="py-12 px-4 bg-white">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        {/* Main emergency numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <p className="text-stone-500 text-[10px] font-semibold tracking-widest uppercase mb-3">{tx.mainNumbers}</p>
          <div className="grid grid-cols-2 gap-2">
            {teroLodge.emergencies.mainNumbers.map((item) => {
              const style = MAIN_NUMBER_STYLES[item.color]
              return (
                <a
                  key={item.number}
                  href={`tel:${item.number.replace(/\s/g, '')}`}
                  className={`rounded-2xl border ${style.border} ${style.bg} p-4 flex flex-col gap-1`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xl tracking-wider ${style.text}`}>{item.number}</span>
                    <Phone size={16} className={`${style.text} opacity-70`} />
                  </div>
                  <p className={`text-[10px] leading-tight ${style.text} opacity-80`}>
                    {numberDescs[item.number]}
                  </p>
                </a>
              )
            })}
          </div>
        </motion.div>

        {/* Other numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <p className="text-stone-500 text-[10px] font-semibold tracking-widest uppercase mb-3">{tx.otherNumbers}</p>
          <div className="flex flex-col gap-2">
            {teroLodge.emergencies.otherNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number.replace(/\s/g, '')}`}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3"
              >
                <div>
                  <span className="font-mono font-semibold text-stone-700">{item.number}</span>
                  <p className="text-stone-400 text-[10px] mt-0.5">{numberDescs[item.number]}</p>
                </div>
                <Phone size={13} className="text-stone-400" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Local services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 mb-6"
        >
          <ServiceCard icon={Building2} label={tx.hospital} name={teroLodge.emergencies.hospital.name} address={teroLodge.emergencies.hospital.address} />
          <ServiceCard icon={User} label={tx.doctor} name={teroLodge.emergencies.doctor.name} address={teroLodge.emergencies.doctor.address} />
          <ServiceCard icon={Pill} label={tx.pharmacy} name={teroLodge.emergencies.pharmacy.name} address={teroLodge.emergencies.pharmacy.address} />
          {teroLodge.emergencies.police.map((p) => (
            <ServiceCard key={p.name} icon={Shield} label={tx.police} name={p.name} address={p.address} />
          ))}
          <ServiceCard icon={Smile} label={tx.dentist} name={teroLodge.emergencies.dentist.name} address={teroLodge.emergencies.dentist.address} />
        </motion.div>

        {/* Tero emergency contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-tero-700 p-5"
        >
          <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mb-3">{tx.teroContact}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{teroLodge.emergency.name}</p>
              <p className="text-white/60 text-sm mt-0.5">{teroLodge.emergency.email}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${teroLodge.emergency.phone}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 text-white text-sm font-semibold"
              >
                <Phone size={14} />
                {teroLodge.emergency.phone}
              </a>
            </div>
          </div>
          <a
            href={`mailto:${teroLodge.emergency.email}`}
            className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium"
          >
            <Mail size={14} />
            {teroLodge.emergency.email}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
