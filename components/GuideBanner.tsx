import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'

export default function GuideBanner() {
  return (
    <div className="sticky top-0 z-50 h-[50px] bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] flex items-center px-4">
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-forest-600 flex items-center justify-center flex-shrink-0">
            <Leaf size={10} className="text-white" />
          </div>
          <span className="font-serif text-forest-900 font-semibold text-sm">ScanAndStay</span>
        </div>
        <Link
          href="https://scanandstay-demo.netlify.app/#pricing"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors"
        >
          Créer mon guide
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
