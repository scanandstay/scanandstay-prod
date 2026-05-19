import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function LandingFooter() {
  return (
    <footer className="bg-forest-900 py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-forest-600 flex items-center justify-center">
            <Leaf size={12} className="text-white" />
          </div>
          <span className="font-serif text-white font-semibold">ScanAndStay</span>
        </div>
        <p className="text-forest-400 text-sm">© 2026 ScanAndStay — Tous droits réservés</p>
        <Link href="/tero" className="text-forest-400 text-sm hover:text-forest-200 transition-colors">
          Voir une démo →
        </Link>
      </div>
    </footer>
  )
}
