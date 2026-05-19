import { Suspense } from 'react'
import { Leaf, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import OnboardingForm from '@/components/onboarding/OnboardingForm'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* ── Hero header ── */}
      <div className="relative bg-forest-900 overflow-hidden pt-14 pb-16 px-5 text-center">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-forest-700/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-forest-800/40 blur-2xl pointer-events-none" />

        {/* Nav mini */}
        <div className="relative z-10 flex items-center justify-between max-w-xl mx-auto mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-forest-600 flex items-center justify-center">
              <Leaf size={12} className="text-white" />
            </div>
            <span className="font-serif text-white font-semibold text-sm">ScanAndStay</span>
          </Link>
          <Link href="/guide" className="text-forest-400 text-xs hover:text-forest-200 transition-colors">
            Voir une démo →
          </Link>
        </div>

        {/* Title */}
        <div className="relative z-10 max-w-lg mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-forest-300 text-[10px] font-semibold tracking-widest uppercase mb-4">
            Formulaire d&apos;onboarding
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mb-3">
            Créer mon guide d&apos;accueil
          </h1>
          <p className="text-forest-300 text-sm">
            8 étapes · environ 10 minutes · guide livré en 7 jours
          </p>
          {/* Badges */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="flex items-center gap-1.5 text-forest-400 text-xs">
              <Clock size={11} /> Réponse sous 24h
            </span>
            <span className="text-forest-700">·</span>
            <span className="flex items-center gap-1.5 text-forest-400 text-xs">
              <Star size={11} /> Design premium inclus
            </span>
          </div>
        </div>
      </div>

      {/* ── Form area — floats over the header ── */}
      <div className="relative z-10 -mt-5 flex-1">
        <div className="rounded-t-3xl bg-stone-50 min-h-full">
          <Suspense fallback={
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
            </div>
          }>
            <OnboardingForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
