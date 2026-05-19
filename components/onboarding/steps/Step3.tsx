'use client'

import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const ACCESS_TYPES = ['Boîte à clés', 'Accueil en personne', 'Digicode', 'Clé sous paillasson']

export default function Step3({ data, update }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Heure d&apos;arrivée <span className="text-red-400">*</span></label>
          <input type="time" className={inp} value={data.checkInTime} onChange={e => update({ checkInTime: e.target.value })} />
        </div>
        <div>
          <label className={lbl}>Heure de départ <span className="text-red-400">*</span></label>
          <input type="time" className={inp} value={data.checkOutTime} onChange={e => update({ checkOutTime: e.target.value })} />
        </div>
      </div>

      <div>
        <label className={lbl}>Type d&apos;accès <span className="text-red-400">*</span></label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {ACCESS_TYPES.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => update({ accessType: a })}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left ${
                data.accessType === a
                  ? 'bg-forest-50 text-forest-800 border-forest-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-forest-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={lbl}>Instructions d&apos;accès détaillées</label>
        <textarea
          className={`${inp} resize-none`}
          rows={4}
          value={data.accessInstructions}
          onChange={e => update({ accessInstructions: e.target.value })}
          placeholder="Ex : Boîte à clés sur le côté droit de la porte d'entrée. Code : 1234. La clé ouvre la porte principale et le portail."
        />
      </div>

      <div>
        <label className={lbl}>Capacité maximum</label>
        <input type="number" min={1} max={100} className={inp} value={data.maxCapacity} onChange={e => update({ maxCapacity: e.target.value })} placeholder="Ex : 12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Réseau Wi-Fi</label>
          <input className={inp} value={data.wifiName} onChange={e => update({ wifiName: e.target.value })} placeholder="Nom du réseau" />
        </div>
        <div>
          <label className={lbl}>Mot de passe Wi-Fi</label>
          <input className={inp} value={data.wifiPassword} onChange={e => update({ wifiPassword: e.target.value })} placeholder="Mot de passe" />
        </div>
      </div>
    </div>
  )
}
