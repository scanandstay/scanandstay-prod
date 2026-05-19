'use client'

import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const LANGS = ['FR', 'EN', 'NL', 'DE', 'ES']
const STYLES = ['Nature & Forêt', 'Montagne', 'Bord de mer', 'Urbain chic', 'Campagne', 'Luxe']

export default function Step2({ data, update }: Props) {
  const toggleLang = (l: string) => {
    const next = data.languages.includes(l)
      ? data.languages.filter(x => x !== l)
      : [...data.languages, l]
    update({ languages: next })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={lbl}>Langues souhaitées <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2 mt-1">
          {LANGS.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => toggleLang(l)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                data.languages.includes(l)
                  ? 'bg-forest-600 text-white border-forest-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-forest-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Couleur principale</label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="color"
              value={data.primaryColor}
              onChange={e => update({ primaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
            />
            <span className="text-sm text-stone-500 font-mono">{data.primaryColor}</span>
          </div>
        </div>
        <div>
          <label className={lbl}>Couleur secondaire</label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="color"
              value={data.secondaryColor}
              onChange={e => update({ secondaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
            />
            <span className="text-sm text-stone-500 font-mono">{data.secondaryColor}</span>
          </div>
        </div>
      </div>

      <div>
        <label className={lbl}>Logo <span className="text-stone-400 font-normal">(PNG, JPG ou SVG)</span></label>
        <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 cursor-pointer hover:border-forest-400 transition-colors">
          <span className="text-stone-400 text-sm mb-1">
            {data.logoName ? data.logoName : 'Cliquez pour uploader'}
          </span>
          {!data.logoName && <span className="text-stone-300 text-xs">PNG · JPG · SVG</span>}
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            className="hidden"
            onChange={e => update({ logoName: e.target.files?.[0]?.name ?? '' })}
          />
        </label>
      </div>

      <div>
        <label className={lbl}>Ambiance / style</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {STYLES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => update({ style: s })}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left ${
                data.style === s
                  ? 'bg-forest-50 text-forest-800 border-forest-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-forest-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
