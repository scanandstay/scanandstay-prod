'use client'

import { useState } from 'react'
import { Check, Minus, Plus, CreditCard, Loader2 } from 'lucide-react'
import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props {
  data: OnboardingData
  update: (f: Partial<OnboardingData>) => void
}

const OFFER_LABELS: Record<string, string> = {
  starter: 'Starter — 299€ + 19€/mois',
  premium: 'Premium — 599€ + 29€/mois',
  multi: 'Multi-propriétés — Sur devis',
  '': 'Non sélectionnée',
}
const OFFER_PRICE: Record<string, number> = { starter: 299, premium: 599 }
const COUNTRIES = ['Belgique', 'France', 'Luxembourg', 'Pays-Bas', 'Allemagne', 'Suisse', 'Autre']

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-stone-100 last:border-0">
      <span className="text-stone-500 text-xs flex-shrink-0 w-36">{label}</span>
      <span className="text-stone-800 text-xs text-right">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-4">
      <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function Summary({ data, update }: Props) {
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const basePrice = OFFER_PRICE[data.offer] ?? 0
  const extra = (data.localResearchMode === 'scanandstay' ? 40 : 0) +
                (data.activitiesResearchMode === 'scanandstay' ? 40 : 0)
  const plates = (data.qrPlates ?? 0) * 25
  const total = basePrice + extra + plates
  const deposit = Math.round(total / 2)
  const isDevis = data.offer === 'multi' || data.offer === ''

  const billingValid = !!(
    data.billingName &&
    data.billingAddress &&
    data.billingPostalCity &&
    data.billingEmail
  )

  const handlePay = async () => {
    setPaying(true)
    setPayError('')
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total,
          establishmentName: data.establishmentName,
          email: data.billingEmail || data.email,
          // Full order data for webhook notification email
          ownerName: data.ownerName,
          phone: data.phone,
          address: data.address,
          offer: data.offer,
          languages: data.languages.join(', '),
          qrPlates: String(data.qrPlates ?? 0),
          localResearch: data.localResearchMode === 'scanandstay' ? 'oui' : 'non',
          activitiesResearch: data.activitiesResearchMode === 'scanandstay' ? 'oui' : 'non',
          billingName: data.billingName,
          billingEmail: data.billingEmail,
          billingAddress: data.billingAddress,
          billingPostalCity: data.billingPostalCity,
          billingCountry: data.billingCountry,
          billingVat: data.billingVat,
          billingIban: data.billingIban,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) {
        const msg = json.error || json.message || JSON.stringify(json)
        throw new Error(msg)
      }
      window.location.href = json.url
    } catch (err) {
      setPayError(err instanceof Error ? err.message : JSON.stringify(err))
      setPaying(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Recap sections ── */}
      <Section title="Établissement">
        <Row label="Nom" value={data.establishmentName} />
        <Row label="Type" value={data.type} />
        <Row label="Adresse" value={data.address} />
        <Row label="Propriétaires" value={data.ownerName} />
        <Row label="Email" value={data.email} />
        <Row label="Téléphone" value={data.phone} />
      </Section>

      <Section title="Identité visuelle">
        <Row label="Langues" value={data.languages.join(', ')} />
        <Row label="Style" value={data.style} />
        <div className="flex items-center justify-between py-2">
          <span className="text-stone-500 text-xs">Couleurs</span>
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-full border border-stone-200" style={{ background: data.primaryColor }} />
            <span className="w-5 h-5 rounded-full border border-stone-200" style={{ background: data.secondaryColor }} />
          </div>
        </div>
      </Section>

      <Section title="Séjour">
        <Row label="Arrivée" value={data.checkInTime} />
        <Row label="Départ" value={data.checkOutTime} />
        <Row label="Accès" value={data.accessType} />
        <Row label="Capacité" value={data.maxCapacity ? `${data.maxCapacity} personnes` : ''} />
        <Row label="Wi-Fi" value={data.wifiName ?? ''} />
      </Section>

      {data.amenities.length > 0 && (
        <Section title={`Équipements (${data.amenities.length})`}>
          <div className="flex flex-wrap gap-1.5">
            {data.amenities.map(a => (
              <span key={a} className="px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 text-[10px] font-medium">{a}</span>
            ))}
          </div>
        </Section>
      )}

      {data.rules.length > 0 && (
        <Section title="Règles">
          <div className="flex flex-col gap-1">
            {data.rules.map(r => (
              <div key={r} className="flex items-center gap-2">
                <Check size={11} className="text-forest-600 flex-shrink-0" />
                <span className="text-stone-700 text-xs">{r}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── QR plates ── */}
      <Section title="Plaques en bois gravées">
        <p className="text-xs text-stone-500 mb-4">
          Plaque en bois gravée avec votre QR code — 25€ / pièce. Livrée avec votre guide.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update({ qrPlates: Math.max(0, (data.qrPlates ?? 0) - 1) })}
              disabled={(data.qrPlates ?? 0) === 0}
              className="w-9 h-9 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-600 hover:border-stone-300 hover:bg-stone-100 transition-all disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="text-2xl font-bold text-forest-900 w-6 text-center">{data.qrPlates ?? 0}</span>
            <button
              type="button"
              onClick={() => update({ qrPlates: Math.min(20, (data.qrPlates ?? 0) + 1) })}
              disabled={(data.qrPlates ?? 0) === 20}
              className="w-9 h-9 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-600 hover:border-stone-300 hover:bg-stone-100 transition-all disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
          {(data.qrPlates ?? 0) > 0 ? (
            <span className="text-forest-700 font-semibold text-sm">
              {data.qrPlates} × 25€ = <strong>{data.qrPlates * 25}€</strong>
            </span>
          ) : (
            <span className="text-stone-400 text-xs">0 plaque sélectionnée</span>
          )}
        </div>
      </Section>

      {/* ── Billing info ── */}
      <Section title="Informations de facturation">
        <div className="flex flex-col gap-4">
          <div>
            <label className={lbl}>Prénom et Nom <span className="text-red-400">*</span></label>
            <input className={inp} value={data.billingName} onChange={e => update({ billingName: e.target.value })} placeholder="Marie Dupont" />
          </div>
          <div>
            <label className={lbl}>Adresse de facturation <span className="text-red-400">*</span></label>
            <input className={inp} value={data.billingAddress} onChange={e => update({ billingAddress: e.target.value })} placeholder="Rue de l'Église 12" />
          </div>
          <div>
            <label className={lbl}>Code postal + Ville <span className="text-red-400">*</span></label>
            <input className={inp} value={data.billingPostalCity} onChange={e => update({ billingPostalCity: e.target.value })} placeholder="6887 Herbeumont" />
          </div>
          <div>
            <label className={lbl}>Pays</label>
            <select className={inp} value={data.billingCountry} onChange={e => update({ billingCountry: e.target.value })}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Email de facturation <span className="text-red-400">*</span></label>
            <input type="email" className={inp} value={data.billingEmail} onChange={e => update({ billingEmail: e.target.value })} placeholder="facturation@monlodge.be" />
          </div>
          <div>
            <label className={lbl}>Numéro TVA <span className="text-stone-400 font-normal">(optionnel)</span></label>
            <input className={inp} value={data.billingVat} onChange={e => update({ billingVat: e.target.value })} placeholder="BE0123456789" />
          </div>
          <div>
            <label className={lbl}>IBAN <span className="text-stone-400 font-normal">(optionnel)</span></label>
            <input className={inp} value={data.billingIban} onChange={e => update({ billingIban: e.target.value })} placeholder="Pour recevoir vos remboursements éventuels" />
          </div>
        </div>
      </Section>

      {/* ── Pricing ── */}
      <div className="rounded-2xl bg-forest-800 p-5">
        <p className="text-[10px] font-bold text-forest-300 uppercase tracking-widest mb-4">Récapitulatif tarifaire</p>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-forest-200">{OFFER_LABELS[data.offer]}</span>
            {!isDevis && <span className="text-white font-bold">{basePrice}€</span>}
          </div>
          {data.localResearchMode === 'scanandstay' && (
            <div className="flex justify-between text-sm">
              <span className="text-forest-300">Recherche commerces</span>
              <span className="text-white font-semibold">+40€</span>
            </div>
          )}
          {data.activitiesResearchMode === 'scanandstay' && (
            <div className="flex justify-between text-sm">
              <span className="text-forest-300">Recherche activités</span>
              <span className="text-white font-semibold">+40€</span>
            </div>
          )}
          {(data.qrPlates ?? 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-forest-300">Plaques en bois gravées ({data.qrPlates}×)</span>
              <span className="text-white font-semibold">+{plates}€</span>
            </div>
          )}
        </div>

        <div className="border-t border-forest-600 pt-3 flex justify-between items-center mb-4">
          <span className="text-white font-semibold text-sm">Total</span>
          <span className="text-white font-bold text-xl">{isDevis ? 'Sur devis' : `${total}€`}</span>
        </div>

        {!isDevis && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-forest-600/50 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-bold">Acompte 50% — pour démarrer</p>
                <p className="text-forest-300 text-[11px] mt-0.5">Payé maintenant par carte</p>
              </div>
              <span className="text-white font-bold text-lg">{deposit}€</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2">
              <span className="text-forest-300 text-sm">Solde 50% à la livraison</span>
              <span className="text-forest-200 font-semibold">{total - deposit}€</span>
            </div>
          </div>
        )}

        {!isDevis && (
          <p className="text-forest-500 text-[11px] leading-relaxed pt-2 border-t border-forest-700 mt-2">
            L&apos;abonnement mensuel est dû tous les 30 jours à compter de la date de livraison de votre guide. Paiement par virement sur le même IBAN.
          </p>
        )}
      </div>

      {/* ── Pay button ── */}
      {!billingValid && (
        <p className="text-xs text-amber-600 text-center">
          Complétez les informations de facturation pour continuer.
        </p>
      )}

      {payError && (
        <p className="text-xs text-red-500 text-center">{payError}</p>
      )}

      {!isDevis && (
        <>
          <button
            type="button"
            onClick={handlePay}
            disabled={!billingValid || paying}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-200 ${
              billingValid && !paying
                ? 'bg-forest-600 text-white hover:bg-forest-700 shadow-[0_4px_20px_rgba(45,116,28,0.4)]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {paying ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Redirection vers Stripe…
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Payer l&apos;acompte — {deposit}€
              </>
            )}
          </button>
          <p className="text-center text-stone-400 text-xs -mt-2">
            Paiement sécurisé par carte via Stripe. Facture PDF envoyée automatiquement.
          </p>
        </>
      )}

      {isDevis && billingValid && (
        <p className="text-center text-stone-500 text-sm p-4 rounded-2xl bg-stone-50 border border-stone-100">
          Nous vous contacterons sous 24h pour établir votre devis personnalisé.
        </p>
      )}
    </div>
  )
}
