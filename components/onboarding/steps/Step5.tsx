'use client'

import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const RULES = [
  'Non-fumeur',
  'Animaux acceptés (signaler à l\'avance)',
  'Silence à partir de 22h',
  'Tri sélectif obligatoire',
  'Pas de fête',
  'Portes coupe-feu fermées',
]

export default function Step5({ data, update }: Props) {
  const toggleRule = (r: string) => {
    const next = data.rules.includes(r)
      ? data.rules.filter(x => x !== r)
      : [...data.rules, r]
    update({ rules: next })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-forest-600 uppercase tracking-widest mb-3">Règles standards</p>
        <div className="flex flex-col gap-2">
          {RULES.map(rule => {
            const checked = data.rules.includes(rule)
            return (
              <button
                key={rule}
                type="button"
                onClick={() => toggleRule(rule)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl border text-sm text-left transition-all ${
                  checked
                    ? 'bg-forest-50 border-forest-300 text-forest-800'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-forest-300'
                }`}
              >
                <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                  checked ? 'bg-forest-600 border-forest-600' : 'border-stone-300'
                }`}>
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span>{rule}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className={lbl}>Règles supplémentaires <span className="text-stone-400 font-normal">(optionnel)</span></label>
        <textarea
          className={`${inp} resize-none`}
          rows={3}
          value={data.customRules}
          onChange={e => update({ customRules: e.target.value })}
          placeholder="Ex : Merci de ne pas cuisiner de plats avec des odeurs fortes après 23h."
        />
      </div>

      <div>
        <div className="flex items-center justify-between py-3.5 px-4 rounded-xl border border-stone-200 bg-white">
          <div>
            <p className="text-sm font-medium text-stone-700">Engagement écologique à mentionner ?</p>
            <p className="text-xs text-stone-400 mt-0.5">Votre démarche éco-responsable visible dans le guide</p>
          </div>
          <button
            type="button"
            onClick={() => update({ hasEcoCommitment: !data.hasEcoCommitment })}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${data.hasEcoCommitment ? 'bg-forest-600' : 'bg-stone-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${data.hasEcoCommitment ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {data.hasEcoCommitment && (
          <textarea
            className={`${inp} resize-none mt-3`}
            rows={3}
            value={data.ecoCommitment}
            onChange={e => update({ ecoCommitment: e.target.value })}
            placeholder="Ex : Nous utilisons des produits ménagers naturels, proposons le tri sélectif et encourageons les balades à vélo plutôt qu'en voiture."
          />
        )}
      </div>
    </div>
  )
}
