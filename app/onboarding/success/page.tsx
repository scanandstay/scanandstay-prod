import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { Leaf } from 'lucide-react'

export default function SuccessPage() {
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
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} className="text-forest-600" />
            </div>

            <h1 className="font-serif text-2xl font-bold text-forest-900 mb-2">
              Acompte reçu !
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Votre guide sera livré sous 7 jours.<br />
              Vous recevrez un email de confirmation avec votre facture.
            </p>

            <div className="rounded-2xl bg-forest-50 border border-forest-100 p-4 mb-6 text-left">
              <p className="text-forest-800 text-xs font-semibold uppercase tracking-wider mb-2">Prochaines étapes</p>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Confirmation de commande envoyée par email',
                  "Démarrage de la création de votre guide sous 24h",
                  "Livraison de votre guide en 7 jours ouvrables",
                  "Solde 50% dû à la livraison",
                ].map(s => (
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
            Une question ? Écrivez-nous à romthomas@icloud.com
          </p>
        </div>
      </div>
    </div>
  )
}
