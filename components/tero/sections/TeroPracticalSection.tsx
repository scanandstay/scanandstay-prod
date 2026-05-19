'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, ShoppingCart, Beef, Wheat, Coffee, Store } from 'lucide-react'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

const SHOP_ICONS: Record<string, React.ElementType> = {
  butcher: Beef,
  market: ShoppingCart,
  grocery: Store,
  bakery: Wheat,
  convenience: Coffee,
}

const SHOP_COLORS: Record<string, string> = {
  butcher: 'bg-red-50 text-red-600',
  market: 'bg-green-50 text-green-700',
  grocery: 'bg-tero-50 text-tero-700',
  bakery: 'bg-amber-50 text-amber-700',
  convenience: 'bg-blue-50 text-blue-600',
}

export default function TeroPracticalSection() {
  const { lang } = useLang()
  const tx = t[lang].practical
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="pratique" ref={ref} className="py-12 px-4 bg-white">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {teroLodge.shops.map((shop, i) => {
            const Icon = SHOP_ICONS[shop.type] ?? Store
            const colorClass = SHOP_COLORS[shop.type] ?? 'bg-stone-50 text-stone-600'
            return (
              <motion.div
                key={shop.name}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-stone-100 bg-stone-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">{shop.name}</p>
                        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mt-0.5">
                          {tx.categories[shop.type]}
                        </p>
                      </div>
                      {shop.phone && (
                        <a
                          href={`tel:${shop.phone}`}
                          className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center flex-shrink-0"
                        >
                          <Phone size={13} className="text-stone-500" />
                        </a>
                      )}
                    </div>
                    {shop.address && (
                      <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">{shop.address}</p>
                    )}
                    {shop.hours && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white border border-stone-200 text-[10px] font-medium text-stone-500">
                        {shop.hours}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Supermarket note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 rounded-2xl bg-tero-50 border border-tero-100 p-4"
        >
          <p className="text-tero-700 text-sm leading-relaxed">{tx.supermarketNote}</p>
        </motion.div>
      </div>
    </section>
  )
}
