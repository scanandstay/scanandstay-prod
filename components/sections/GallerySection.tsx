'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { lodge } from '@/lib/data'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [lightbox, setLightbox] = useState<number | null>(null)

  const photos = lodge.gallery
  const current = lightbox !== null ? photos[lightbox] : null

  const prev = () => setLightbox(l => (l !== null ? (l - 1 + photos.length) % photos.length : null))
  const next = () => setLightbox(l => (l !== null ? (l + 1) % photos.length : null))

  return (
    <section id="galerie" className="bg-white">
      <div className="px-4 py-12 max-w-lg mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-wood-600 mb-1.5">
            La propriété en images
          </p>
          <h2 className="text-2xl font-serif font-semibold text-forest-900">Galerie photos</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-10 h-0.5 bg-wood-400 mt-3"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-2"
        >
          {photos.map((photo, idx) => (
            <motion.button
              key={photo.id}
              variants={itemVariants}
              onClick={() => setLightbox(idx)}
              className={`group relative overflow-hidden rounded-2xl bg-cream-100 ${
                idx === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
              }`}
            >
              <Image
                src={`https://picsum.photos/id/${photo.id}/${idx === 0 ? '1200/675' : '600/600'}`}
                alt={photo.caption}
                fill
                sizes={idx === 0 ? '100vw' : '50vw'}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium text-left leading-tight">{photo.caption}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{photo.category}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-stone-400 text-xs">
            {photos.length} photos · Appuyez pour agrandir
          </p>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-forest-950/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight size={20} className="text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={`https://picsum.photos/id/${current.id}/1200/900`}
                  alt={current.caption}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-white font-medium text-sm">{current.caption}</p>
                <p className="text-white/50 text-xs mt-1">{lightbox + 1} / {photos.length} · {current.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
