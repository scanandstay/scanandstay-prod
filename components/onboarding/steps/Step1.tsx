'use client'

import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

const TYPES = ['Gîte', 'Lodge', 'B&B', 'Airbnb', 'Hôtel', 'Autre']

export default function Step1({ data, update }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={lbl}>Nom de l&apos;établissement <span className="text-red-400">*</span></label>
        <input className={inp} value={data.establishmentName} onChange={e => update({ establishmentName: e.target.value })} placeholder="Ex : Tero Lodge Herbeumont" />
      </div>
      <div>
        <label className={lbl}>Type d&apos;établissement <span className="text-red-400">*</span></label>
        <select className={inp} value={data.type} onChange={e => update({ type: e.target.value })}>
          <option value="">Sélectionner…</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>Adresse complète <span className="text-red-400">*</span></label>
        <input className={inp} value={data.address} onChange={e => update({ address: e.target.value })} placeholder="Rue, code postal, ville, pays" />
      </div>
      <div>
        <label className={lbl}>Nom du / des propriétaires <span className="text-red-400">*</span></label>
        <input className={inp} value={data.ownerName} onChange={e => update({ ownerName: e.target.value })} placeholder="Ex : Marie & Pierre Dupont" />
      </div>
      <div>
        <label className={lbl}>Email de contact <span className="text-red-400">*</span></label>
        <input type="email" className={inp} value={data.email} onChange={e => update({ email: e.target.value })} placeholder="contact@monlodge.be" />
      </div>
      <div>
        <label className={lbl}>Téléphone <span className="text-red-400">*</span></label>
        <input type="tel" className={inp} value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder="+32 470 00 00 00" />
      </div>
      <div>
        <label className={lbl}>Site web existant <span className="text-stone-400 font-normal">(optionnel)</span></label>
        <input className={inp} value={data.website} onChange={e => update({ website: e.target.value })} placeholder="https://monlodge.be" />
      </div>
    </div>
  )
}
