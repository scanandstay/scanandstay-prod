'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Leaf, Lock, LogOut, ArrowRight, Plus, Check, X, ChevronDown,
  Send, Link2, Loader2, Copy, Mail, Users, ShoppingBag, Archive,
} from 'lucide-react'

// ── Styles ──
const inp = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all duration-200'
const inpSm = 'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all duration-200'
const lbl = 'block text-xs font-semibold text-stone-600 mb-1'

// ── Types ──
type ProspectStatus = 'À contacter' | 'Contacté' | 'En discussion' | 'Converti' | 'Perdu'
type GuideStatus = 'En création' | 'Prêt à livrer' | 'Livré'

interface Prospect {
  id: string
  establishmentName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  status: ProspectStatus
  contactDate: string
  notes: string
}

interface Order {
  id: string
  establishmentName: string
  clientName: string
  clientEmail: string
  offer: 'starter' | 'premium'
  depositAmount: number
  depositDate: string
  guideStatus: GuideStatus
  balanceAmount: number
  monthlyAmount: number
  balanceReceived: boolean
  balanceDate: string
  status: 'active' | 'closed'
  closedDate?: string
}

// ── localStorage hook ──
function useLS<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return init
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init }
    catch { return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
  return [val, setVal] as const
}

// ── Status badge colours ──
const PROSPECT_COLORS: Record<ProspectStatus, string> = {
  'À contacter': 'bg-stone-100 text-stone-600',
  'Contacté': 'bg-blue-50 text-blue-700',
  'En discussion': 'bg-amber-50 text-amber-700',
  'Converti': 'bg-forest-50 text-forest-700',
  'Perdu': 'bg-red-50 text-red-600',
}
const GUIDE_COLORS: Record<GuideStatus, string> = {
  'En création': 'bg-amber-50 text-amber-700',
  'Prêt à livrer': 'bg-blue-50 text-blue-700',
  'Livré': 'bg-forest-50 text-forest-700',
}

// ─────────────────────────────────────────────
// Add/Edit Prospect Modal
// ─────────────────────────────────────────────
function ProspectModal({ initial, onSave, onClose }: {
  initial?: Partial<Prospect>
  onSave: (d: Omit<Prospect, 'id'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    establishmentName: initial?.establishmentName ?? '',
    contactName: initial?.contactName ?? '',
    contactEmail: initial?.contactEmail ?? '',
    contactPhone: initial?.contactPhone ?? '',
    status: (initial?.status ?? 'À contacter') as ProspectStatus,
    contactDate: initial?.contactDate ?? new Date().toISOString().slice(0, 10),
    notes: initial?.notes ?? '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="font-semibold text-forest-900 text-sm">{initial?.establishmentName ? 'Modifier le prospect' : 'Ajouter un prospect'}</p>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div><label className={lbl}>Établissement *</label><input className={inpSm} value={form.establishmentName} onChange={e => set('establishmentName', e.target.value)} placeholder="Tero Lodge Herbeumont" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Nom contact</label><input className={inpSm} value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="Marie Dupont" /></div>
            <div><label className={lbl}>Téléphone</label><input className={inpSm} value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+32 470 00 00 00" /></div>
          </div>
          <div><label className={lbl}>Email</label><input type="email" className={inpSm} value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="marie@lodge.be" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Statut</label>
              <select className={inpSm} value={form.status} onChange={e => set('status', e.target.value)}>
                {(['À contacter','Contacté','En discussion','Converti','Perdu'] as ProspectStatus[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Date de contact</label><input type="date" className={inpSm} value={form.contactDate} onChange={e => set('contactDate', e.target.value)} /></div>
          </div>
          <div><label className={lbl}>Notes</label><textarea className={`${inpSm} resize-none`} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Contexte, retours, prochaines étapes…" /></div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:border-stone-300 transition-colors">Annuler</button>
          <button
            onClick={() => { if (form.establishmentName) { onSave(form); onClose() } }}
            className="flex-1 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition-colors"
          >Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Payment Request Modal
// ─────────────────────────────────────────────
function PaymentModal({ order, onClose, onBalanceReceived }: {
  order: Order
  onClose: () => void
  onBalanceReceived: (id: string) => void
}) {
  const [balance, setBalance] = useState(String(order.balanceAmount || ''))
  const [monthly, setMonthly] = useState(String(order.monthlyAmount || 19))
  const [paymentUrl, setPaymentUrl] = useState('')
  const [generatingLink, setGeneratingLink] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const handleGenerateLink = async () => {
    setGeneratingLink(true); setLinkError(''); setPaymentUrl('')
    try {
      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: order.clientName, clientEmail: order.clientEmail, establishmentName: order.establishmentName, balanceAmount: Number(balance), monthlyAmount: Number(monthly) }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || JSON.stringify(data))
      setPaymentUrl(data.url)
    } catch (e) { setLinkError(e instanceof Error ? e.message : String(e)) }
    finally { setGeneratingLink(false) }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paymentUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = async () => {
    setSending(true); setSendError(''); setSent(false)
    try {
      const res = await fetch('/api/send-payment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: order.clientName, clientEmail: order.clientEmail, establishmentName: order.establishmentName, balanceAmount: Number(balance), monthlyAmount: Number(monthly), paymentUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || JSON.stringify(data))
      setSent(true)
    } catch (e) { setSendError(e instanceof Error ? e.message : String(e)) }
    finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <p className="font-semibold text-forest-900 text-sm">Réclamer le solde</p>
            <p className="text-stone-400 text-xs mt-0.5">{order.establishmentName}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Montant du solde (€)</label>
              <input type="number" min="1" className={inpSm} value={balance} onChange={e => setBalance(e.target.value)} placeholder="299" />
            </div>
            <div>
              <label className={lbl}>Abonnement mensuel</label>
              <select className={inpSm} value={monthly} onChange={e => setMonthly(e.target.value)}>
                <option value="19">19€/mois — Starter</option>
                <option value="29">29€/mois — Premium</option>
              </select>
            </div>
          </div>

          {balance && (
            <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5 flex justify-between text-xs">
              <span className="text-stone-500">Premier prélèvement</span>
              <span className="font-bold text-forest-900">{Number(balance) + Number(monthly)}€</span>
            </div>
          )}

          {linkError && <p className="text-xs text-red-500 font-mono break-all">{linkError}</p>}

          <button onClick={handleGenerateLink} disabled={generatingLink || !balance}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50">
            {generatingLink ? <><Loader2 size={15} className="animate-spin" />Génération…</> : <><Link2 size={15} />Générer le lien Stripe</>}
          </button>

          {paymentUrl && (
            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-2.5 text-xs text-stone-600 font-mono break-all select-all">{paymentUrl}</div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${copied ? 'bg-forest-50 border-forest-300 text-forest-700' : 'bg-white border-stone-200 text-stone-700'}`}>
                  {copied ? <><Check size={13} />Copié</> : <><Copy size={13} />Copier</>}
                </button>
                <button onClick={handleSendEmail} disabled={sending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors disabled:opacity-60">
                  {sending ? <><Loader2 size={13} className="animate-spin" />Envoi…</> : sent ? <><Check size={13} />Envoyé !</> : <><Mail size={13} />Envoyer par email</>}
                </button>
              </div>
              {sendError && <p className="text-xs text-red-500">{sendError}</p>}
            </div>
          )}

          <div className="border-t border-stone-100 pt-3">
            <button onClick={() => { onBalanceReceived(order.id); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-forest-200 bg-forest-50 text-forest-700 text-xs font-semibold hover:bg-forest-100 transition-colors">
              <Check size={14} />Marquer le solde comme reçu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main AdminPage
// ─────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'prospection' | 'orders' | 'closed'>('prospection')

  const [prospects, setProspects] = useLS<Prospect[]>('ss_prospects', [])
  const [orders, setOrders] = useLS<Order[]>('ss_orders', [])

  const [showAddProspect, setShowAddProspect] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | undefined>()
  const [paymentOrder, setPaymentOrder] = useState<Order | undefined>()

  useEffect(() => { if (sessionStorage.getItem('ss_admin') === 'ok') setAuthed(true) }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'scanandstay2026') { sessionStorage.setItem('ss_admin', 'ok'); setAuthed(true) }
    else setLoginError('Mot de passe incorrect.')
  }

  const addProspect = useCallback((d: Omit<Prospect, 'id'>) => {
    setProspects(prev => [...prev, { ...d, id: Date.now().toString() }])
  }, [setProspects])

  const updateProspect = useCallback((id: string, d: Partial<Prospect>) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...d } : p))
  }, [setProspects])

  const convertToOrder = useCallback((p: Prospect) => {
    setOrders(prev => [...prev, {
      id: Date.now().toString(),
      establishmentName: p.establishmentName, clientName: p.contactName,
      clientEmail: p.contactEmail, offer: 'starter',
      depositAmount: 0, depositDate: new Date().toISOString().slice(0,10),
      guideStatus: 'En création', balanceAmount: 0, monthlyAmount: 19,
      balanceReceived: false, balanceDate: '', status: 'active',
    }])
    updateProspect(p.id, { status: 'Converti' })
    setActiveTab('orders')
  }, [setOrders, updateProspect])

  const updateOrder = useCallback((id: string, d: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...d } : o))
  }, [setOrders])

  const closeOrder = useCallback((id: string) => {
    updateOrder(id, { status: 'closed', closedDate: new Date().toISOString().slice(0,10) })
  }, [updateOrder])

  const activeOrders = orders.filter(o => o.status === 'active')
  const closedOrders = orders.filter(o => o.status === 'closed')

  // ── Login ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-forest-900 flex flex-col items-center justify-center px-5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-700/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-forest-800/30 blur-2xl" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-forest-600 flex items-center justify-center"><Leaf size={16} className="text-white" /></div>
            <span className="font-serif text-white font-bold text-lg">ScanAndStay</span>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-50 mx-auto mb-4"><Lock size={20} className="text-forest-600" /></div>
            <h1 className="font-serif text-xl font-bold text-forest-900 text-center mb-1">Administration</h1>
            <p className="text-stone-400 text-xs text-center mb-6">Accès réservé à ScanAndStay</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className={lbl}>Mot de passe</label>
                <input type="password" className={inp} value={password} onChange={e => { setPassword(e.target.value); setLoginError('') }} placeholder="••••••••" autoFocus />
                {loginError && <p className="text-red-500 text-xs mt-1.5">{loginError}</p>}
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-forest-600 text-white font-semibold text-sm hover:bg-forest-700 transition-colors shadow-[0_4px_14px_rgba(45,116,28,0.35)]">
                Accéder au dashboard <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  const tabs = [
    { id: 'prospection', label: 'Prospection', icon: Users, count: prospects.filter(p => p.status !== 'Converti' && p.status !== 'Perdu').length },
    { id: 'orders', label: 'Commandes en cours', icon: ShoppingBag, count: activeOrders.length },
    { id: 'closed', label: 'Clôturées', icon: Archive, count: closedOrders.length },
  ] as const

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-forest-900 px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center"><Leaf size={13} className="text-white" /></div>
            <span className="font-serif text-white font-semibold text-sm">ScanAndStay</span>
            <span className="text-forest-500 text-xs ml-1">Admin</span>
          </div>
          <button onClick={() => { sessionStorage.removeItem('ss_admin'); setAuthed(false) }}
            className="flex items-center gap-1.5 text-forest-400 text-xs hover:text-forest-200 transition-colors">
            <LogOut size={13} />Déconnexion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-100 px-5">
        <div className="max-w-4xl mx-auto flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? 'border-forest-600 text-forest-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
              <t.icon size={13} />
              {t.label}
              {t.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === t.id ? 'bg-forest-100 text-forest-700' : 'bg-stone-100 text-stone-500'}`}>{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── PROSPECTION TAB ── */}
        {activeTab === 'prospection' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-900">Prospection</h2>
                <p className="text-stone-400 text-xs mt-0.5">{prospects.length} prospects enregistrés</p>
              </div>
              <button onClick={() => setShowAddProspect(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors shadow-[0_2px_8px_rgba(45,116,28,0.3)]">
                <Plus size={14} />Ajouter un prospect
              </button>
            </div>

            {prospects.length === 0 ? (
              <div className="rounded-2xl bg-white border border-stone-100 p-10 text-center">
                <Users size={32} className="text-stone-200 mx-auto mb-3" />
                <p className="text-stone-400 text-sm">Aucun prospect — commencez par en ajouter un.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {prospects.map(p => (
                  <div key={p.id} className="rounded-2xl bg-white border border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.05)] p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-forest-900 text-sm">{p.establishmentName}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{p.contactName}{p.contactEmail && ` · ${p.contactEmail}`}{p.contactPhone && ` · ${p.contactPhone}`}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${PROSPECT_COLORS[p.status]}`}>{p.status}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <select value={p.status} onChange={e => updateProspect(p.id, { status: e.target.value as ProspectStatus })}
                        className="rounded-lg border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-300">
                        {(['À contacter','Contacté','En discussion','Converti','Perdu'] as ProspectStatus[]).map(s => <option key={s}>{s}</option>)}
                      </select>
                      {p.contactDate && <span className="text-xs text-stone-400">{p.contactDate}</span>}
                      {p.notes && <span className="text-xs text-stone-400 italic truncate max-w-[160px]">{p.notes}</span>}
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-stone-50">
                      <button onClick={() => setEditingProspect(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs hover:border-stone-300 transition-colors">
                        Modifier
                      </button>
                      {p.status !== 'Converti' && p.status !== 'Perdu' && (
                        <button onClick={() => convertToOrder(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors">
                          <Check size={11} />Marquer converti
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-900">Commandes en cours</h2>
              <p className="text-stone-400 text-xs mt-0.5">{activeOrders.length} commande{activeOrders.length !== 1 ? 's' : ''} active{activeOrders.length !== 1 ? 's' : ''}</p>
            </div>

            {activeOrders.length === 0 ? (
              <div className="rounded-2xl bg-white border border-stone-100 p-10 text-center">
                <ShoppingBag size={32} className="text-stone-200 mx-auto mb-3" />
                <p className="text-stone-400 text-sm">Aucune commande en cours.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activeOrders.map(o => (
                  <div key={o.id} className="rounded-2xl bg-white border border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.05)] p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-forest-900 text-sm">{o.establishmentName}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{o.clientName}{o.clientEmail && ` · ${o.clientEmail}`}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${GUIDE_COLORS[o.guideStatus]}`}>{o.guideStatus}</span>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">{o.offer === 'premium' ? 'Premium' : 'Starter'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div className="rounded-xl bg-stone-50 px-3 py-2">
                        <p className="text-[10px] text-stone-400 mb-0.5">Acompte</p>
                        <p className="text-xs font-bold text-stone-700">{o.depositAmount ? `${o.depositAmount}€` : '—'}</p>
                        {o.depositDate && <p className="text-[10px] text-stone-400">{o.depositDate}</p>}
                      </div>
                      <div className="rounded-xl bg-stone-50 px-3 py-2">
                        <p className="text-[10px] text-stone-400 mb-0.5">Solde</p>
                        <p className="text-xs font-bold text-stone-700">{o.balanceReceived ? <span className="text-forest-600">✓ Reçu</span> : '—'}</p>
                        {o.balanceDate && <p className="text-[10px] text-stone-400">{o.balanceDate}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-stone-400 block mb-1">Statut du guide</label>
                        <select value={o.guideStatus} onChange={e => updateOrder(o.id, { guideStatus: e.target.value as GuideStatus })}
                          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-300">
                          {(['En création','Prêt à livrer','Livré'] as GuideStatus[]).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-stone-50 flex-wrap">
                      <button onClick={() => setPaymentOrder(o)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors shadow-[0_2px_8px_rgba(45,116,28,0.25)]">
                        <Send size={12} />Guide prêt — Réclamer paiement
                      </button>
                      {o.guideStatus === 'Livré' && o.balanceReceived && (
                        <button onClick={() => closeOrder(o.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs hover:border-stone-300 transition-colors">
                          <Archive size={12} />Clôturer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CLOSED TAB ── */}
        {activeTab === 'closed' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-900">Commandes clôturées</h2>
              <p className="text-stone-400 text-xs mt-0.5">{closedOrders.length} commande{closedOrders.length !== 1 ? 's' : ''} terminée{closedOrders.length !== 1 ? 's' : ''}</p>
            </div>

            {closedOrders.length === 0 ? (
              <div className="rounded-2xl bg-white border border-stone-100 p-10 text-center">
                <Archive size={32} className="text-stone-200 mx-auto mb-3" />
                <p className="text-stone-400 text-sm">Aucune commande clôturée pour l&apos;instant.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {closedOrders.map(o => (
                  <div key={o.id} className="rounded-2xl bg-white border border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.05)] p-4 opacity-80">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-stone-700 text-sm">{o.establishmentName}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{o.clientName} · {o.offer === 'premium' ? 'Premium' : 'Starter'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500">Clôturée</span>
                        {o.closedDate && <p className="text-[10px] text-stone-400 mt-1">{o.closedDate}</p>}
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-stone-50">
                      <div className="text-xs text-stone-500">Acompte : <strong className="text-stone-700">{o.depositAmount}€</strong></div>
                      <div className="text-xs text-stone-500">Solde : <strong className="text-stone-700">{o.balanceAmount}€</strong></div>
                      <div className="text-xs text-stone-500">Mensuel : <strong className="text-stone-700">{o.monthlyAmount}€/mois</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {(showAddProspect || editingProspect) && (
        <ProspectModal
          initial={editingProspect}
          onSave={d => {
            if (editingProspect) updateProspect(editingProspect.id, d)
            else addProspect(d)
          }}
          onClose={() => { setShowAddProspect(false); setEditingProspect(undefined) }}
        />
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          onClose={() => setPaymentOrder(undefined)}
          onBalanceReceived={id => updateOrder(id, { balanceReceived: true, balanceDate: new Date().toISOString().slice(0,10) })}
        />
      )}
    </div>
  )
}
