'use client'

import { useState, useEffect } from 'react'
import { Leaf, Lock, Link2, Copy, Check, Mail, Loader2, LogOut, ArrowRight } from 'lucide-react'

const inp = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all duration-200'
const lbl = 'block text-sm font-semibold text-stone-700 mb-2'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Form
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [establishment, setEstablishment] = useState('')
  const [balance, setBalance] = useState('')
  const [monthly, setMonthly] = useState('19')

  // Result
  const [paymentUrl, setPaymentUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('ss_admin') === 'ok') setAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'scanandstay2026') {
      sessionStorage.setItem('ss_admin', 'ok')
      setAuthed(true)
    } else {
      setLoginError('Mot de passe incorrect.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ss_admin')
    setAuthed(false)
    setPassword('')
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setApiError('')
    setPaymentUrl('')

    try {
      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          establishmentName: establishment,
          balanceAmount: Number(balance),
          monthlyAmount: Number(monthly),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || JSON.stringify(data))
      setPaymentUrl(data.url)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paymentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = async () => {
    setSending(true)
    setSendError('')
    setSent(false)
    try {
      const res = await fetch('/api/send-payment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          establishmentName: establishment,
          balanceAmount: Number(balance),
          monthlyAmount: Number(monthly),
          paymentUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || JSON.stringify(data))
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err))
    } finally {
      setSending(false)
    }
  }

  const totalFirst = Number(balance || 0) + Number(monthly || 0)

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-forest-900 flex flex-col items-center justify-center px-5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-700/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-forest-800/30 blur-2xl" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-forest-600 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-serif text-white font-bold text-lg">ScanAndStay</span>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-50 mx-auto mb-4">
              <Lock size={20} className="text-forest-600" />
            </div>
            <h1 className="font-serif text-xl font-bold text-forest-900 text-center mb-1">Administration</h1>
            <p className="text-stone-400 text-xs text-center mb-6">Accès réservé à ScanAndStay</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className={lbl}>Mot de passe</label>
                <input
                  type="password"
                  className={inp}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError('') }}
                  placeholder="••••••••••••••"
                  autoFocus
                />
                {loginError && <p className="text-red-500 text-xs mt-1.5">{loginError}</p>}
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-forest-600 text-white font-semibold text-sm hover:bg-forest-700 transition-colors shadow-[0_4px_14px_rgba(45,116,28,0.35)]"
              >
                Accéder au dashboard
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-forest-900 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center">
              <Leaf size={13} className="text-white" />
            </div>
            <span className="font-serif text-white font-semibold text-sm">ScanAndStay</span>
            <span className="text-forest-500 text-xs ml-1">Admin</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-forest-400 text-xs hover:text-forest-200 transition-colors"
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest-900">Dashboard</h1>
          <p className="text-stone-400 text-sm mt-1">Gestion des paiements ScanAndStay</p>
        </div>

        {/* ── Payment link section ── */}
        <div className="rounded-2xl bg-white border border-stone-100 shadow-[0_2px_20px_rgba(0,0,0,0.07)] overflow-hidden">
          <div className="bg-forest-800 px-6 py-4">
            <p className="text-[10px] font-bold text-forest-300 uppercase tracking-widest mb-0.5">Facturation</p>
            <h2 className="font-serif text-lg font-bold text-white">Réclamer le paiement du solde</h2>
            <p className="text-forest-400 text-xs mt-1">Génère un lien de paiement Stripe pour le solde 50% + activation de l&apos;abonnement mensuel.</p>
          </div>

          <form onSubmit={handleGenerate} className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Nom du client</label>
                <input className={inp} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Marie Dupont" required />
              </div>
              <div>
                <label className={lbl}>Email du client</label>
                <input type="email" className={inp} value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="marie@lodge.be" required />
              </div>
            </div>

            <div>
              <label className={lbl}>Nom de l&apos;établissement</label>
              <input className={inp} value={establishment} onChange={e => setEstablishment(e.target.value)} placeholder="Tero Lodge Herbeumont" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Montant du solde (€)</label>
                <input
                  type="number"
                  min="1"
                  className={inp}
                  value={balance}
                  onChange={e => setBalance(e.target.value)}
                  placeholder="299"
                  required
                />
              </div>
              <div>
                <label className={lbl}>Abonnement mensuel (€)</label>
                <select className={inp} value={monthly} onChange={e => setMonthly(e.target.value)}>
                  <option value="19">19€/mois — Starter</option>
                  <option value="29">29€/mois — Premium</option>
                </select>
              </div>
            </div>

            {/* Price preview */}
            {balance && (
              <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3 flex justify-between items-center text-sm">
                <span className="text-stone-500">Premier prélèvement</span>
                <span className="font-bold text-forest-900">{totalFirst}€ <span className="text-stone-400 font-normal text-xs">(solde + 1 mois)</span></span>
              </div>
            )}

            {apiError && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-xs font-mono break-all">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-forest-600 text-white font-semibold text-sm hover:bg-forest-700 transition-all duration-200 shadow-[0_4px_14px_rgba(45,116,28,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" />Génération en cours…</>
              ) : (
                <><Link2 size={16} />Générer le lien de paiement</>
              )}
            </button>
          </form>

          {/* ── Result ── */}
          {paymentUrl && (
            <div className="border-t border-stone-100 px-6 py-5 flex flex-col gap-3">
              <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Lien généré</p>
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-xs text-stone-600 font-mono break-all select-all">
                {paymentUrl}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    copied
                      ? 'bg-forest-50 border-forest-300 text-forest-700'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {copied ? <><Check size={15} />Copié !</> : <><Copy size={15} />Copier</>}
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition-colors shadow-[0_4px_14px_rgba(45,116,28,0.3)] disabled:opacity-60"
                >
                  {sending ? (
                    <><Loader2 size={15} className="animate-spin" />Envoi…</>
                  ) : sent ? (
                    <><Check size={15} />Email envoyé !</>
                  ) : (
                    <><Mail size={15} />Envoyer par email</>
                  )}
                </button>
              </div>
              {sendError && (
                <p className="text-xs text-red-500 font-mono break-all">{sendError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
