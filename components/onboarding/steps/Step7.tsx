'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { OnboardingData, Activity } from '@/lib/onboarding-types'
import { inp } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const ACT_TYPES = ['Randonnée', 'Vélo', 'Kayak', 'Accrobranche', 'Visite culturelle', 'Sport', 'Autre']

const emptyActivity = (): Activity => ({ type: '', name: '', description: '', distance: '', duration: '', contact: '' })

export default function Step7({ data, update }: Props) {
  const setMode = (m: 'self' | 'scanandstay') => update({ activitiesResearchMode: m })

  const addAct = () => update({ activities: [...data.activities, emptyActivity()] })

  const updateAct = (i: number, fields: Partial<Activity>) => {
    const next = data.activities.map((a, idx) => idx === i ? { ...a, ...fields } : a)
    update({ activities: next })
  }

  const removeAct = (i: number) => update({ activities: data.activities.filter((_, idx) => idx !== i) })

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
              data.activitiesResearchMode === m
                ? 'bg-forest-600 text-white border-forest-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-forest-400'
            }`}
          >
            {m === 'self' ? 'Je fournis mes activités' : 'ScanAndStay fait les recherches (+40€)'}
          </button>
        ))}
      </div>

      {data.activitiesResearchMode === 'scanandstay' ? (
        <div className="rounded-2xl bg-forest-50 border border-forest-100 p-5">
          <p className="text-forest-800 text-sm leading-relaxed">
            <strong>Parfait !</strong> Nous sélectionnerons pour vous les établissements les mieux notés à proximité de votre adresse. Ce service sera ajouté à votre devis <strong>(+40€)</strong>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.activities.map((act, i) => (
            <div key={i} className="rounded-2xl border border-stone-100 bg-white p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Activité {i + 1}</span>
                <button type="button" onClick={() => removeAct(i)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
              <select className={inp} value={act.type} onChange={e => updateAct(i, { type: e.target.value })}>
                <option value="">Type…</option>
                {ACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className={inp} value={act.name} onChange={e => updateAct(i, { name: e.target.value })} placeholder="Nom de l'activité" />
              <input className={inp} value={act.description} onChange={e => updateAct(i, { description: e.target.value })} placeholder="Description courte" />
              <div className="grid grid-cols-2 gap-3">
                <input className={inp} value={act.distance} onChange={e => updateAct(i, { distance: e.target.value })} placeholder="Distance depuis le gîte" />
                <input className={inp} value={act.duration} onChange={e => updateAct(i, { duration: e.target.value })} placeholder="Durée estimée" />
              </div>
              <input className={inp} value={act.contact} onChange={e => updateAct(i, { contact: e.target.value })} placeholder="Téléphone ou site web (optionnel)" />
            </div>
          ))}
          <button
            type="button"
            onClick={addAct}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-forest-300 text-forest-700 text-sm font-semibold hover:bg-forest-50 transition-colors"
          >
            <Plus size={16} />
            Ajouter une activité
          </button>
        </div>
      )}
    </div>
  )
}
