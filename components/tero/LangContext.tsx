'use client'

import { createContext, useContext } from 'react'
import type { Lang } from '@/lib/tero-data'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangCtx>({ lang: 'fr', setLang: () => {} })

export const useLang = () => useContext(LangContext)
export default LangContext
