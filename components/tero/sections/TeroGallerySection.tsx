'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useLang } from '@/components/tero/LangContext'
import { t, teroLodge } from '@/lib/tero-data'

export default function TeroGallerySection() {
  const { lang } = useLang()
  const tx = t[lang].gallery
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [lightbox, setLightbox] = useState<number | null>(null)

  const photos = teroLodge.gallery

  const prev = () => setLightbox(i => (i === null ? null : (i - 1 + photos.length) % photos.length))
  const next = () => setLightbox(i => (i === null ? null : (i + 1) % photos.length))

  return (
    <section id="galerie" ref={ref} className="py-12 px-4 bg-stone-50 pb-32">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-tero-600 text-xs font-semibold tracking-widest uppercase mb-1">{tx.label}</p>
          <h2 className="font-serif text-3xl font-bold text-tero-800 mb-6">{tx.title}</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, i) => {
            const isWide = photo.aspect === 'wide'
            return (
              <motion.button
                key={photo.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(i)}
                className={`relative rounded-2xl overflow-hidden ${isWide ? 'col-span-2 aspect-video' : 'aspect-square'}`}
              >
                <Image
                  src={photo.src}
                  alt={tx.captions[i] ?? ''}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <p className="text-white text-xs font-medium">{tx.captions[i]}</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-stone-400 text-xs mt-4"
        >
          {tx.tapToExpand}
        </motion.p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={20} className="text-white" />
            </button>

            <div className="relative w-full max-w-lg px-4" onClick={e => e.stopPropagation()}>
              <motion.div
                key={lightbox}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={photos[lightbox].src}
                  alt={tx.captions[lightbox] ?? ''}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <p className="text-white/70 text-sm text-center mt-3">{tx.captions[lightbox]}</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <span className="text-white/40 text-xs">{lightbox + 1} / {photos.length}</span>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
