'use client'

import { useState } from 'react'
import type { Lang } from '@/lib/tero-data'
import LangContext from '@/components/tero/LangContext'
import GuideBanner from '@/components/GuideBanner'
import TeroBottomNav from '@/components/tero/TeroBottomNav'
import TeroHeroSection from '@/components/tero/sections/TeroHeroSection'
import TeroAccessSection from '@/components/tero/sections/TeroAccessSection'
import TeroRulesSection from '@/components/tero/sections/TeroRulesSection'
import TeroPracticalSection from '@/components/tero/sections/TeroPracticalSection'
import TeroTourismSection from '@/components/tero/sections/TeroTourismSection'
import TeroWalksSection from '@/components/tero/sections/TeroWalksSection'
import TeroCyclingSection from '@/components/tero/sections/TeroCyclingSection'
import TeroEmergenciesSection from '@/components/tero/sections/TeroEmergenciesSection'
import TeroGallerySection from '@/components/tero/sections/TeroGallerySection'

export default function TeroPage() {
  const [lang, setLang] = useState<Lang>('fr')

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <GuideBanner />
      <main className="pb-24 min-h-screen bg-stone-50">
        <TeroHeroSection />
        <TeroAccessSection />
        <TeroRulesSection />
        <TeroPracticalSection />
        <TeroTourismSection />
        <TeroWalksSection />
        <TeroCyclingSection />
        <TeroEmergenciesSection />
        <TeroGallerySection />
      </main>
      <TeroBottomNav />
    </LangContext.Provider>
  )
}
