'use client'

import type { OnboardingData } from '@/lib/onboarding-types'
import { inp, lbl } from '@/lib/onboarding-types'

interface Props { data: OnboardingData; update: (f: Partial<OnboardingData>) => void }

export default function Step8({ data, update }: Props) {
  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10)
    update({ photoNames: files.map(f => f.name) })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={lbl}>Photos du gîte <span className="text-stone-400 font-normal">(max 10 · JPG, PNG, WEBP)</span></label>
        <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 cursor-pointer hover:border-forest-400 transition-colors p-6">
          {data.photoNames.length === 0 ? (
            <>
              <span className="text-stone-400 text-sm mb-1">Cliquez pour sélectionner vos photos</span>
              <span className="text-stone-300 text-xs">JPG · PNG · WEBP — max 10 photos</span>
            </>
          ) : (
            <div className="text-center">
              <p className="text-forest-700 font-semibold text-sm mb-2">{data.photoNames.length} photo{data.photoNames.length > 1 ? 's' : ''} sélectionnée{data.photoNames.length > 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {data.photoNames.map(n => (
                  <span key={n} className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 text-[10px] max-w-[120px] truncate">{n}</span>
                ))}
              </div>
            </div>
          )}
          <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={handlePhotos} />
        </label>
        <p className="text-stone-400 text-xs mt-2">Les photos seront à envoyer par email après soumission du formulaire.</p>
      </div>

      <div>
        <label className={lbl}>Numéro d&apos;urgence du propriétaire <span className="text-red-400">*</span></label>
        <input type="tel" className={inp} value={data.emergencyPhone} onChange={e => update({ emergencyPhone: e.target.value })} placeholder="+32 470 00 00 00" />
      </div>

      <div>
        <label className={lbl}>Hôpital le plus proche — nom et adresse</label>
        <input className={inp} value={data.hospital} onChange={e => update({ hospital: e.target.value })} placeholder="Ex : Hôpital Vivalia, Avenue de Houffalize 35, 6800 Libramont" />
      </div>

      <div>
        <label className={lbl}>Médecin local — nom et adresse <span className="text-stone-400 font-normal">(optionnel)</span></label>
        <input className={inp} value={data.doctor} onChange={e => update({ doctor: e.target.value })} placeholder="Ex : Dr Dupont, Rue de l'Église 5, 6887 Herbeumont" />
      </div>

      <div>
        <label className={lbl}>Pharmacie locale — nom et adresse <span className="text-stone-400 font-normal">(optionnel)</span></label>
        <input className={inp} value={data.pharmacy} onChange={e => update({ pharmacy: e.target.value })} placeholder="Ex : Pharmacie Poncelet, Rue de Bravy 18, 6887 Herbeumont" />
      </div>
    </div>
  )
}
