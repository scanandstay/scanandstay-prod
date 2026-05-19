'use client'

import { Plus, Trash2, Star } from 'lucide-react'
import type { OnboardingData, Business } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const BIZ_TYPES = ['Restaurant', 'Boulangerie', 'Boucherie', 'Épicerie', 'Supermarché', 'Bar', 'Autre']

const emptyBiz = (): Business => ({ type: '', name: '', address: '', phone: '', description: '', recommended: false })

export default function Step6({ data, update }: Props) {
  const setMode = (m: 'self' | 'scanandstay') => update({ localResearchMode: m })

  const addBiz = () => update({ businesses: [...data.businesses, emptyBiz()] })

  const updateBiz = (i: number, fields: Partial<Business>) => {
    const next = data.businesses.map((b, idx) => idx === i ? { ...b, ...fields } : b)
    update({ businesses: next })
  }

  const removeBiz = (i: number) => update({ businesses: data.businesses.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col gap-5">
      {/* Toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(['self', 'scanandstay'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`py-3 px-3 rounded-xl border text-sm font-medium text-center transition-all leading-snug ${
              data.localResearchMode === m
                ? 'bg-forest-600 text-white border-forest-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-forest-400'
            }`}
          >
            {m === 'self' ? 'Je fournis mes recommandations' : 'ScanAndStay fait les recherches (+40€)'}
          </button>
        ))}
      </div>

      {data.localResearchMode === 'scanandstay' ? (
        <div className="rounded-2xl bg-forest-50 border border-forest-100 p-5">
          <p className="text-forest-800 text-sm leading-relaxed">
            <strong>Parfait !</strong> Nous sélectionnerons pour vous les établissements les mieux notés à proximité de votre adresse. Ce service sera ajouté à votre devis <strong>(+40€)</strong>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.businesses.map((biz, i) => (
            <div key={i} className="rounded-2xl border border-stone-100 bg-white p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Établissement {i + 1}</span>
                <button type="button" onClick={() => removeBiz(i)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
              <select className={inp} value={biz.type} onChange={e => updateBiz(i, { type: e.target.value })}>
                <option value="">Type…</option>
                {BIZ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className={inp} value={biz.name} onChange={e => updateBiz(i, { name: e.target.value })} placeholder="Nom" />
              <input className={inp} value={biz.address} onChange={e => updateBiz(i, { address: e.target.value })} placeholder="Adresse" />
              <input className={inp} value={biz.phone} onChange={e => updateBiz(i, { phone: e.target.value })} placeholder="Téléphone" />
              <input className={inp} value={biz.description} onChange={e => updateBiz(i, { description: e.target.value })} placeholder="Spécialité ou description courte" />
              <button
                type="button"
                onClick={() => updateBiz(i, { recommended: !biz.recommended })}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-sm font-medium self-start transition-all ${
                  biz.recommended ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <Star size={13} className={biz.recommended ? 'fill-amber-500 text-amber-500' : 'text-stone-400'} />
                Recommandé par les propriétaires
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBiz}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-forest-300 text-forest-700 text-sm font-semibold hover:bg-forest-50 transition-colors"
          >
            <Plus size={16} />
            Ajouter un établissement
          </button>
        </div>
      )}
    </div>
  )
}
