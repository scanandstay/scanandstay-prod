'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OnboardingData, Offer } from '@/lib/onboarding-types'
import { defaultData, STEP_LABELS } from '@/lib/onboarding-types'
import ProgressBar from './ProgressBar'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import Step7 from './steps/Step7'
import Step8 from './steps/Step8'
import Summary from './Summary'

const TOTAL = 8

function canProceed(step: number, d: OnboardingData): boolean {
  if (step === 1) return !!(d.establishmentName && d.type && d.address && d.ownerName && d.email && d.phone)
  if (step === 2) return d.languages.length > 0
  if (step === 3) return !!(d.checkInTime && d.checkOutTime && d.accessType)
  if (step === 8) return !!d.emergencyPhone
  return true
}

export default function OnboardingForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    ...defaultData,
    offer: (searchParams.get('offre') as Offer) || '',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const update = (fields: Partial<OnboardingData>) => setData(d => ({ ...d, ...fields }))

  const goNext = () => {
    if (!canProceed(step, data)) return
    setDir(1)
    setStep(s => s + 1)
  }

  const goPrev = () => {
    setDir(-1)
    setStep(s => s - 1)
  }

  const isSummary = step > TOTAL
  const valid = canProceed(step, data)

  const STEPS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8]
  const StepComponent = STEPS[step - 1]

  return (
    <div className="max-w-xl mx-auto px-5 py-8">
      {/* Step label */}
      {!isSummary && (
        <p className="text-center text-stone-500 text-sm mb-5">{STEP_LABELS[step - 1]}</p>
      )}
      {isSummary && (
        <h2 className="text-center font-serif text-2xl font-bold text-forest-900 mb-6">
          Récapitulatif de votre demande
        </h2>
      )}

      {/* Progress */}
      {!isSummary && <ProgressBar current={step} total={TOTAL} />}

      {/* Step card */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: dir > 0 ? 28 : -28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir > 0 ? -28 : 28 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {isSummary ? (
            <Summary data={data} update={update} />
          ) : (
            <div className="rounded-2xl bg-white border border-stone-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.07)]">
              <StepComponent data={data} update={update} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isSummary && (
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-stone-200 bg-white text-stone-600 text-sm font-semibold hover:border-stone-300 hover:text-stone-800 transition-all duration-200 shadow-sm"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            disabled={!valid}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              valid
                ? 'bg-forest-600 text-white hover:bg-forest-700 shadow-[0_4px_14px_rgba(45,116,28,0.35)]'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            {step === TOTAL ? 'Voir le récapitulatif' : 'Suivant'}
            {step < TOTAL && <ChevronRight size={16} />}
          </button>
        </div>
      )}

      {isSummary && (
        <button
          type="button"
          onClick={goPrev}
          className="mt-4 w-full flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl border border-stone-200 bg-white text-stone-600 text-sm font-medium hover:border-stone-300 transition-all duration-200 shadow-sm"
        >
          <ChevronLeft size={15} />
          Modifier mes réponses
        </button>
      )}
    </div>
  )
}
