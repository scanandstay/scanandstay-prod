'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react'
import { Leaf } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SepaSuccessContent() {
  const params = useSearchParams()
  const amount = params.get('amount') || ''
  const name = params.get('name') || ''

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Mini nav */}
      <div className="h-14 bg-white border-b border-stone-100 flex items-center px-5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-forest-600 flex items-center justify-center">
            <Leaf size={12} className="text-white" />
          </div>
          <span className="font-serif text-forest-900 font-semibold text-sm">ScanAndStay</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full">
          <div className="rounded-3xl bg-white border border-stone-100 shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-8 text-center">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} className="text-forest-600" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl font-bold text-forest-900 mb-2">
              Prélèvement mensuel configuré !
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              {amount
                ? <>Votre abonnement de <strong className="text-forest-900">{amount}€/mois</strong> sera prélevé automatiquement chaque mois{name ? <> pour votre guide&nbsp;<strong className="text-forest-900">{name}</strong></> : ''}.</>
                : <>Votre abonnement mensuel sera prélevé automatiquement chaque mois.</>
              }
            </p>

            {/* Detail block */}
            <div className="rounded-2xl bg-forest-50 border border-forest-100 p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={13} className="text-forest-600" />
                <p className="text-forest-800 text-xs font-semibold uppercase tracking-wider">Comment ça fonctionne</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Votre IBAN a été enregistré de façon sécurisée via Stripe',
                  'Le premier prélèvement aura lieu dans les prochains jours',
                  'Vous recevrez une notification avant chaque prélèvement',
                  'Annulation possible à tout moment en nous contactant',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs text-forest-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-forest-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-forest-700">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-600 text-white font-semibold text-sm hover:bg-forest-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Retour à l&apos;accueil
            </Link>
          </div>

          <p className="text-center text-stone-400 text-xs mt-4">
            Une question ? Écrivez-nous à{' '}
            <a href="mailto:romthomas@icloud.com" className="underline hover:text-stone-600">
              romthomas@icloud.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SepaSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-forest-300 border-t-forest-600 animate-spin" />
      </div>
    }>
      <SepaSuccessContent />
    </Suspense>
  )
}
