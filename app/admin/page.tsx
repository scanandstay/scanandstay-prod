'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Leaf, Lock, LogOut, ArrowRight, Plus, Check, X, Send, Link2, Loader2,
  Copy, Mail, Users, Archive, RefreshCw, Play, Package, TrendingUp,
  BarChart2, Banknote, ExternalLink, Calendar, Target, ShoppingBag,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Styles ───────────────────────────────────────────────────────────────────
const inp   = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all'
const inpSm = 'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 transition-all'
const lbl   = 'block text-xs font-semibold text-stone-600 mb-1'

// ── DB Types ──────────────────────────────────────────────────────────────────
type DbOrderStatus =
  | 'acompte_recu' | 'en_creation' | 'pret_a_livrer'
  | 'solde_en_attente' | 'livre' | 'cloture'
type DbProspectStatus = 'nouveau' | 'contacte' | 'en_discussion' | 'converti' | 'perdu'

interface DbOrder {
  id: string; created_at: string
  establishment_name: string | null; owner_name: string | null
  client_email: string | null; phone: string | null; address: string | null
  offer: string | null; languages: string | null
  total: number | null; deposit: number | null; balance: number | null
  monthly_amount: number | null; qr_plates: number | null
  local_research: boolean | null; activities_research: boolean | null
  billing_name: string | null; billing_email: string | null
  billing_address: string | null; billing_postal_city: string | null
  billing_country: string | null; billing_vat: string | null
  status: DbOrderStatus; stripe_session_id: string | null
  deposit_paid_at: string | null; balance_paid_at: string | null
  guide_url: string | null
  // New columns (migration.sql)
  guide_started_at: string | null; payment_email_sent_at: string | null
  delivered_at: string | null; closed_at: string | null
  subscription_start_at: string | null; next_billing_at: string | null
  subscription_status: string | null
}

interface DbProspect {
  id: string; created_at: string
  establishment_name: string; contact_name: string | null
  email: string | null; phone: string | null; source: string | null
  status: DbProspectStatus; notes: string | null; last_contact_at: string | null
}

// ── Pipeline columns config ───────────────────────────────────────────────────
type PipelineAction = { label: string; next?: DbOrderStatus; modal?: boolean }
type PipelineColCfg = {
  status: DbOrderStatus; label: string
  headerBg: string; textCol: string; dot: string
  action?: PipelineAction
}
const PIPELINE: PipelineColCfg[] = [
  { status: 'acompte_recu',    label: 'Acompte reçu',      headerBg: 'bg-stone-100',  textCol: 'text-stone-700', dot: 'bg-stone-400',  action: { label: 'Démarrer le guide',    next: 'en_creation'     } },
  { status: 'en_creation',     label: 'Guide en création', headerBg: 'bg-amber-50',   textCol: 'text-amber-800', dot: 'bg-amber-400',  action: { label: 'Guide prêt ✓',         next: 'pret_a_livrer'   } },
  { status: 'pret_a_livrer',   label: 'Prêt à livrer',    headerBg: 'bg-blue-50',    textCol: 'text-blue-800',  dot: 'bg-blue-500',   action: { label: 'Réclamer le solde',    modal: true             } },
  { status: 'solde_en_attente',label: 'Solde en attente',  headerBg: 'bg-orange-50',  textCol: 'text-orange-800',dot: 'bg-orange-400', action: { label: 'Marquer livré',        next: 'livre'           } },
  { status: 'livre',           label: 'Guide livré',       headerBg: 'bg-emerald-50', textCol: 'text-emerald-800',dot:'bg-emerald-500', action: { label: 'Clôturer',            next: 'cloture'         } },
  { status: 'cloture',         label: 'Vente clôturée',    headerBg: 'bg-stone-50',   textCol: 'text-stone-500', dot: 'bg-stone-300'  },
]

// ── Prospect status ───────────────────────────────────────────────────────────
const P_LABEL: Record<DbProspectStatus, string> = {
  nouveau: 'Nouveau', contacte: 'Contacté', en_discussion: 'En discussion', converti: 'Converti', perdu: 'Perdu',
}
const P_COLOR: Record<DbProspectStatus, string> = {
  nouveau: 'bg-blue-50 text-blue-700', contacte: 'bg-orange-50 text-orange-700',
  en_discussion: 'bg-violet-50 text-violet-700', converti: 'bg-emerald-50 text-emerald-700',
  perdu: 'bg-red-50 text-red-600',
}
const P_STATUS_LIST: DbProspectStatus[] = ['nouveau','contacte','en_discussion','converti','perdu']

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function nextBilling(o: DbOrder): string {
  const anchor = o.next_billing_at || o.subscription_start_at || o.delivered_at || o.balance_paid_at
  if (!anchor) return '—'
  if (o.next_billing_at) return fmt(o.next_billing_at)
  const now = new Date(); let d = new Date(anchor)
  while (d <= now) d = new Date(d.getTime() + 30 * 86400000)
  return d.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function clientName(o: DbOrder) { return o.billing_name || o.owner_name || '—' }
function clientEmail(o: DbOrder) { return o.billing_email || o.client_email || '—' }

// ── ProspectModal ─────────────────────────────────────────────────────────────
type ProspectForm = { establishment_name:string; contact_name:string; email:string; phone:string; source:string; status:DbProspectStatus; notes:string }
function ProspectModal({ initial, onSave, onClose }: { initial?:DbProspect; onSave:(d:ProspectForm)=>void; onClose:()=>void }) {
  const [f, setF] = useState<ProspectForm>({
    establishment_name: initial?.establishment_name ?? '',
    contact_name: initial?.contact_name ?? '', email: initial?.email ?? '',
    phone: initial?.phone ?? '', source: initial?.source ?? 'autre',
    status: initial?.status ?? 'nouveau', notes: initial?.notes ?? '',
  })
  const s = (k: keyof ProspectForm, v: string) => setF(p => ({ ...p, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="font-semibold text-[#1a3a2a] text-sm">{initial ? 'Modifier' : 'Ajouter un prospect'}</p>
          <button onClick={onClose}><X size={18} className="text-stone-400" /></button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div><label className={lbl}>Établissement *</label><input className={inpSm} value={f.establishment_name} onChange={e=>s('establishment_name',e.target.value)} placeholder="Tero Lodge" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Contact</label><input className={inpSm} value={f.contact_name} onChange={e=>s('contact_name',e.target.value)} placeholder="Marie Dupont" /></div>
            <div><label className={lbl}>Téléphone</label><input className={inpSm} value={f.phone} onChange={e=>s('phone',e.target.value)} placeholder="+32 470…" /></div>
          </div>
          <div><label className={lbl}>Email</label><input type="email" className={inpSm} value={f.email} onChange={e=>s('email',e.target.value)} placeholder="marie@lodge.be" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Statut</label>
              <select className={inpSm} value={f.status} onChange={e=>s('status',e.target.value as DbProspectStatus)}>
                {P_STATUS_LIST.map(st=><option key={st} value={st}>{P_LABEL[st]}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Source</label>
              <select className={inpSm} value={f.source} onChange={e=>s('source',e.target.value)}>
                {['site_web','booking','airbnb','instagram','autre'].map(src=><option key={src} value={src}>{src.replace('_',' ')}</option>)}
              </select>
            </div>
          </div>
          <div><label className={lbl}>Notes</label><textarea className={`${inpSm} resize-none`} rows={3} value={f.notes} onChange={e=>s('notes',e.target.value)} placeholder="Contexte, retours…" /></div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm">Annuler</button>
          <button onClick={()=>{ if(f.establishment_name){ onSave(f); onClose() } }} className="flex-1 py-2.5 rounded-xl bg-[#1a3a2a] text-white text-sm font-semibold hover:bg-[#2d5a3a]">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

// ── PaymentModal ──────────────────────────────────────────────────────────────
function PaymentModal({ order, onClose, onEmailSent, onBalanceReceived }: {
  order: DbOrder; onClose:()=>void
  onEmailSent:(id:string)=>void; onBalanceReceived:(id:string)=>void
}) {
  const [balance,  setBalance]  = useState(String(order.balance || order.total ? Math.round((order.total||0)/2) : ''))
  const [monthly,  setMonthly]  = useState(String(order.monthly_amount ?? (order.offer==='premium'?29:19)))
  const [url,      setUrl]      = useState('')
  const [genLoad,  setGenLoad]  = useState(false)
  const [genErr,   setGenErr]   = useState('')
  const [copied,   setCopied]   = useState(false)
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [sendErr,  setSendErr]  = useState('')

  const cName  = clientName(order)
  const cEmail = clientEmail(order)

  const generate = async () => {
    setGenLoad(true); setGenErr(''); setUrl('')
    try {
      const r = await fetch('/api/create-payment-link', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientName:cName, clientEmail:cEmail, establishmentName:order.establishment_name, balanceAmount:Number(balance), monthlyAmount:Number(monthly) }) })
      const d = await r.json()
      if (!r.ok || !d.url) throw new Error(d.error || JSON.stringify(d))
      setUrl(d.url)
    } catch(e) { setGenErr(e instanceof Error ? e.message : String(e)) }
    finally { setGenLoad(false) }
  }

  const sendEmail = async () => {
    setSending(true); setSendErr(''); setSent(false)
    try {
      const r = await fetch('/api/send-payment-email', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientName:cName, clientEmail:cEmail, establishmentName:order.establishment_name, balanceAmount:Number(balance), monthlyAmount:Number(monthly), paymentUrl:url }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || JSON.stringify(d))
      setSent(true)
      onEmailSent(order.id)
    } catch(e) { setSendErr(e instanceof Error ? e.message : String(e)) }
    finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div><p className="font-semibold text-[#1a3a2a] text-sm">Réclamer le solde</p><p className="text-stone-400 text-xs mt-0.5">{order.establishment_name}</p></div>
          <button onClick={onClose}><X size={18} className="text-stone-400" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Solde (€)</label><input type="number" min="1" className={inpSm} value={balance} onChange={e=>setBalance(e.target.value)} /></div>
            <div><label className={lbl}>Abonnement</label>
              <select className={inpSm} value={monthly} onChange={e=>setMonthly(e.target.value)}>
                <option value="19">19€/mois — Starter</option>
                <option value="29">29€/mois — Premium</option>
              </select>
            </div>
          </div>
          {balance && <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2 flex justify-between text-xs"><span className="text-stone-500">Premier prélèvement</span><span className="font-bold text-[#1a3a2a]">{Number(balance)+Number(monthly)}€</span></div>}
          {genErr && <p className="text-xs text-red-500 font-mono break-all">{genErr}</p>}
          <button onClick={generate} disabled={genLoad||!balance} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a3a2a] text-white text-sm font-semibold hover:bg-[#2d5a3a] disabled:opacity-50">
            {genLoad ? <><Loader2 size={14} className="animate-spin"/>Génération…</> : <><Link2 size={14}/>Générer le lien Stripe</>}
          </button>
          {url && (
            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs font-mono break-all text-stone-600 select-all">{url}</div>
              <div className="flex gap-2">
                <button onClick={async()=>{ await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000) }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${copied?'bg-emerald-50 border-emerald-300 text-emerald-700':'border-stone-200 text-stone-700'}`}>
                  {copied?<><Check size={12}/>Copié</>:<><Copy size={12}/>Copier</>}
                </button>
                <button onClick={sendEmail} disabled={sending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a3a2a] text-white text-xs font-semibold hover:bg-[#2d5a3a] disabled:opacity-60">
                  {sending?<><Loader2 size={12} className="animate-spin"/>Envoi…</>:sent?<><Check size={12}/>Envoyé !</>:<><Mail size={12}/>Envoyer email</>}
                </button>
              </div>
              {sendErr && <p className="text-xs text-red-500">{sendErr}</p>}
            </div>
          )}
          <div className="border-t border-stone-100 pt-3">
            <button onClick={()=>{ onBalanceReceived(order.id); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100">
              <Check size={13}/>Marquer le solde comme reçu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  type Tab = 'pipeline' | 'clients' | 'prospection' | 'stats'

  const [authed,    setAuthed]    = useState(false)
  const [pwd,       setPwd]       = useState('')
  const [loginErr,  setLoginErr]  = useState('')
  const [tab,       setTab]       = useState<Tab>('pipeline')
  const [orders,    setOrders]    = useState<DbOrder[]>([])
  const [prospects, setProspects] = useState<DbProspect[]>([])
  const [loading,   setLoading]   = useState(false)
  const [dbErr,     setDbErr]     = useState('')
  const [procId,    setProcId]    = useState<string|null>(null)  // processing order id

  const [paymentOrder,   setPaymentOrder]   = useState<DbOrder|undefined>()
  const [prospectModal,  setProspectModal]  = useState<DbProspect|'new'|undefined>()
  const [prospectFilter, setProspectFilter] = useState<DbProspectStatus|'all'>('all')

  useEffect(() => { if (sessionStorage.getItem('ss_admin')==='ok') setAuthed(true) }, [])

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true); setDbErr('')
    const [{ data:od, error:oe }, { data:pd, error:pe }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at',{ascending:false}),
      supabase.from('prospects').select('*').order('created_at',{ascending:false}),
    ])
    if (oe) setDbErr(oe.message)
    if (pe) setDbErr(pe.message)
    if (od) setOrders(od as DbOrder[])
    if (pd) setProspects(pd as DbProspect[])
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) load() }, [authed, load])

  // ── Order operations ──────────────────────────────────────────────────────
  const advanceOrder = useCallback(async (id:string, next:DbOrderStatus) => {
    setProcId(id)
    const now = new Date().toISOString()
    const upd: Partial<DbOrder> = { status: next }
    if (next==='en_creation')     upd.guide_started_at      = now
    if (next==='livre')           upd.delivered_at           = now
    if (next==='cloture')         upd.closed_at              = now
    await supabase.from('orders').update(upd).eq('id',id)
    await load(); setProcId(null)
  }, [load])

  const markEmailSent = useCallback(async (id:string) => {
    await supabase.from('orders').update({ status:'solde_en_attente', payment_email_sent_at: new Date().toISOString() }).eq('id',id)
    await load()
  }, [load])

  const markBalanceReceived = useCallback(async (id:string) => {
    await supabase.from('orders').update({ balance_paid_at: new Date().toISOString() }).eq('id',id)
    await load()
  }, [load])

  // ── Prospect operations ───────────────────────────────────────────────────
  const saveProspect = useCallback(async (d:ProspectForm, id?:string) => {
    if (id) {
      await supabase.from('prospects').update({...d, last_contact_at:new Date().toISOString()}).eq('id',id)
    } else {
      await supabase.from('prospects').insert({...d, last_contact_at:new Date().toISOString()})
    }
    await load()
  }, [load])

  const updateProspectStatus = useCallback(async (id:string, status:DbProspectStatus) => {
    await supabase.from('prospects').update({ status }).eq('id',id)
    await load()
  }, [load])

  const convertToOrder = useCallback(async (p:DbProspect) => {
    await supabase.from('orders').insert({ establishment_name:p.establishment_name, owner_name:p.contact_name, client_email:p.email, phone:p.phone, status:'acompte_recu' })
    await supabase.from('prospects').update({ status:'converti' }).eq('id',p.id)
    await load(); setTab('pipeline')
  }, [load])

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-[#1a3a2a] flex items-center justify-center px-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><Leaf size={18} className="text-white" /></div>
          <span className="font-serif text-white font-bold text-xl">ScanAndStay</span>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
          <div className="w-12 h-12 rounded-2xl bg-[#1a3a2a]/10 flex items-center justify-center mx-auto mb-5"><Lock size={22} className="text-[#1a3a2a]" /></div>
          <h1 className="font-serif text-xl font-bold text-[#1a3a2a] text-center mb-1">Administration</h1>
          <p className="text-stone-400 text-xs text-center mb-6">Accès réservé à ScanAndStay</p>
          <form onSubmit={e=>{ e.preventDefault(); if(pwd==='scanandstay2026'){sessionStorage.setItem('ss_admin','ok');setAuthed(true)}else setLoginErr('Mot de passe incorrect.') }} className="flex flex-col gap-4">
            <div>
              <label className={lbl}>Mot de passe</label>
              <input type="password" className={inp} value={pwd} onChange={e=>{setPwd(e.target.value);setLoginErr('')}} placeholder="••••••••" autoFocus />
              {loginErr && <p className="text-red-500 text-xs mt-1.5">{loginErr}</p>}
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a3a2a] text-white font-semibold text-sm hover:bg-[#2d5a3a] transition-colors">
              Accéder au dashboard <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  // ── Derived data ──────────────────────────────────────────────────────────
  const activeClients = orders.filter(o => ['livre','cloture'].includes(o.status))
  const activeProspects = prospects.filter(p => prospectFilter==='all' || p.status===prospectFilter)
  const mrr = orders.filter(o=>o.subscription_status==='actif').reduce((s,o)=>s+(o.monthly_amount||0),0)
  const totalRevenue = orders.reduce((s,o)=>s+(o.deposit||0)+(o.balance_paid_at&&o.balance?o.balance:0),0)
  const convRate = prospects.length ? Math.round(prospects.filter(p=>p.status==='converti').length/prospects.length*100) : 0

  // ── Tabs nav ──────────────────────────────────────────────────────────────
  const TABS: {id:Tab;label:string;icon:React.ReactNode;count?:number}[] = [
    { id:'pipeline',    label:'Pipeline',    icon:<ShoppingBag size={14}/>, count: orders.filter(o=>o.status!=='cloture').length },
    { id:'clients',     label:'Clients actifs', icon:<Users size={14}/>,   count: activeClients.length },
    { id:'prospection', label:'Prospection', icon:<Target size={14}/>,     count: prospects.filter(p=>!['converti','perdu'].includes(p.status)).length },
    { id:'stats',       label:'Statistiques',icon:<BarChart2 size={14}/> },
  ]

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="bg-[#1a3a2a] px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"><Leaf size={13} className="text-white" /></div>
            <span className="font-serif text-white font-semibold text-sm">ScanAndStay</span>
            <span className="text-white/40 text-[11px] ml-0.5">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {dbErr && <span className="text-red-300 text-xs hidden sm:block">⚠ {dbErr}</span>}
            <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-white/50 text-xs hover:text-white/80 transition-colors">
              <RefreshCw size={12} className={loading?'animate-spin':''} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            <button onClick={()=>{sessionStorage.removeItem('ss_admin');setAuthed(false)}} className="flex items-center gap-1.5 text-white/50 text-xs hover:text-white/80 transition-colors">
              <LogOut size={13} /><span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-screen-xl mx-auto px-4 flex overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-[#1a3a2a] text-[#1a3a2a]':'border-transparent text-stone-500 hover:text-stone-700'}`}>
              {t.icon}{t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab===t.id?'bg-[#1a3a2a]/10 text-[#1a3a2a]':'bg-stone-100 text-stone-400'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-20 text-stone-400">
          <Loader2 size={18} className="animate-spin" /><span className="text-sm">Chargement…</span>
        </div>
      )}

      {!loading && (
        <div className="max-w-screen-xl mx-auto px-4 py-6">

          {/* ══════════════════════════════════════════════════
              TAB 1 — PIPELINE KANBAN
          ══════════════════════════════════════════════════ */}
          {tab==='pipeline' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1a3a2a]">Pipeline commandes</h2>
                  <p className="text-stone-400 text-xs mt-0.5">{orders.filter(o=>o.status!=='cloture').length} commande(s) en cours</p>
                </div>
              </div>

              {/* Kanban */}
              <div className="overflow-x-auto -mx-4 px-4 pb-4">
                <div className="flex gap-3" style={{minWidth: `${PIPELINE.length * 272}px`}}>
                  {PIPELINE.map(col => {
                    const colOrders = orders.filter(o=>o.status===col.status)
                    return (
                      <div key={col.status} className="w-64 flex-shrink-0">
                        {/* Column header */}
                        <div className={`${col.headerBg} rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                            <p className={`text-xs font-bold ${col.textCol}`}>{col.label}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-white/70 px-1.5 py-0.5 rounded-full text-stone-600">{colOrders.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="flex flex-col gap-2 min-h-[120px]">
                          {colOrders.map(o => (
                            <div key={o.id} className="bg-white rounded-2xl border border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] p-4">
                              {/* Title + offer */}
                              <div className="flex items-start justify-between gap-1.5 mb-3">
                                <p className="font-semibold text-[#1a3a2a] text-sm leading-tight">{o.establishment_name || '—'}</p>
                                {o.offer && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${o.offer==='premium'?'bg-amber-50 text-amber-700':'bg-stone-100 text-stone-500'}`}>{o.offer==='premium'?'Premium':'Starter'}</span>}
                              </div>

                              {/* Amounts */}
                              <div className="grid grid-cols-2 gap-1 mb-3">
                                {o.total && <div className="rounded-lg bg-stone-50 px-2 py-1.5 text-center"><p className="text-[9px] text-stone-400 leading-tight">Total</p><p className="text-xs font-bold text-stone-700">{o.total}€</p></div>}
                                {o.deposit && <div className="rounded-lg bg-stone-50 px-2 py-1.5 text-center"><p className="text-[9px] text-stone-400 leading-tight">Acompte</p><p className="text-xs font-bold text-stone-700">{o.deposit}€</p></div>}
                                {o.balance && <div className="rounded-lg bg-stone-50 px-2 py-1.5 text-center"><p className="text-[9px] text-stone-400 leading-tight">Solde</p><p className="text-xs font-bold text-stone-700">{o.balance}€</p></div>}
                                {o.monthly_amount && <div className="rounded-lg bg-stone-50 px-2 py-1.5 text-center"><p className="text-[9px] text-stone-400 leading-tight">Mensuel</p><p className="text-xs font-bold text-stone-700">{o.monthly_amount}€</p></div>}
                              </div>

                              {/* History */}
                              <div className="space-y-0.5 mb-3">
                                <p className="text-[10px] text-stone-400">📥 Commande : {fmt(o.created_at)}</p>
                                {o.guide_started_at     && <p className="text-[10px] text-amber-600">▶ Démarré : {fmt(o.guide_started_at)}</p>}
                                {o.payment_email_sent_at && <p className="text-[10px] text-blue-600">📧 Email solde : {fmt(o.payment_email_sent_at)}</p>}
                                {o.balance_paid_at       && <p className="text-[10px] text-emerald-600">💰 Solde reçu : {fmt(o.balance_paid_at)}</p>}
                                {o.delivered_at          && <p className="text-[10px] text-emerald-600">✓ Livré : {fmt(o.delivered_at)}</p>}
                                {o.closed_at             && <p className="text-[10px] text-stone-400">✗ Clôturé : {fmt(o.closed_at)}</p>}
                              </div>

                              {/* Contact */}
                              {clientEmail(o) !== '—' && (
                                <p className="text-[10px] text-stone-400 truncate mb-3">{clientEmail(o)}</p>
                              )}

                              {/* Action */}
                              {col.action && (
                                col.action.modal ? (
                                  <button onClick={()=>setPaymentOrder(o)}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1a3a2a] text-white text-xs font-semibold hover:bg-[#2d5a3a] transition-colors">
                                    <Send size={11} />{col.action.label}
                                  </button>
                                ) : (
                                  <button
                                    disabled={procId===o.id}
                                    onClick={()=>col.action?.next && advanceOrder(o.id, col.action.next)}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:border-[#1a3a2a]/30 hover:text-[#1a3a2a] transition-colors disabled:opacity-50">
                                    {procId===o.id
                                      ? <Loader2 size={11} className="animate-spin"/>
                                      : col.status==='acompte_recu' ? <Play size={11}/>
                                      : col.status==='en_creation'  ? <Check size={11}/>
                                      : col.status==='solde_en_attente' ? <Package size={11}/>
                                      : col.status==='livre' ? <Archive size={11}/>
                                      : null}
                                    {col.action.label}
                                  </button>
                                )
                              )}
                            </div>
                          ))}
                          {colOrders.length===0 && (
                            <div className="rounded-2xl border-2 border-dashed border-stone-100 h-24 flex items-center justify-center">
                              <p className="text-[11px] text-stone-300">Aucune commande</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 2 — CLIENTS ACTIFS
          ══════════════════════════════════════════════════ */}
          {tab==='clients' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1a3a2a]">Clients actifs</h2>
                  <p className="text-stone-400 text-xs mt-0.5">{activeClients.length} client(s) — MRR : <strong className="text-[#1a3a2a]">{mrr}€/mois</strong></p>
                </div>
              </div>
              {activeClients.length===0 ? (
                <div className="rounded-2xl bg-white border border-stone-100 p-12 text-center">
                  <Users size={36} className="text-stone-200 mx-auto mb-3" />
                  <p className="text-stone-400 text-sm">Aucun client actif pour le moment.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_1px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                          {['Établissement','Email','Offre','Mensuel','Livré le','Prochain prélevement','Statut abo','Guide'].map(h=>(
                            <th key={h} className="text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {activeClients.map(o=>(
                          <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-[#1a3a2a] text-sm">{o.establishment_name}</p>
                              <p className="text-stone-400 text-xs">{clientName(o)}{o.phone?` · ${o.phone}`:''}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-stone-600">{clientEmail(o)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.offer==='premium'?'bg-amber-50 text-amber-700':'bg-stone-100 text-stone-500'}`}>
                                {o.offer==='premium'?'Premium':'Starter'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-bold text-[#1a3a2a]">{o.monthly_amount?`${o.monthly_amount}€`:'—'}</td>
                            <td className="px-4 py-3 text-xs text-stone-600">{fmt(o.delivered_at)}</td>
                            <td className="px-4 py-3 text-xs text-stone-600">
                              <span className="flex items-center gap-1"><Calendar size={11} className="text-stone-400"/>{nextBilling(o)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                o.subscription_status==='actif'     ? 'bg-emerald-50 text-emerald-700' :
                                o.subscription_status==='en_retard' ? 'bg-red-50 text-red-600' :
                                o.subscription_status==='annule'    ? 'bg-stone-100 text-stone-500' :
                                'bg-amber-50 text-amber-700'}`}>
                                {o.subscription_status==='actif'?'Actif':o.subscription_status==='en_retard'?'En retard':o.subscription_status==='annule'?'Annulé':'En attente'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {o.guide_url ? (
                                <a href={o.guide_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#1a3a2a] text-xs hover:underline">
                                  <ExternalLink size={12}/>Voir
                                </a>
                              ) : <span className="text-stone-300 text-xs">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 3 — PROSPECTION
          ══════════════════════════════════════════════════ */}
          {tab==='prospection' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1a3a2a]">Prospection</h2>
                  <p className="text-stone-400 text-xs mt-0.5">{prospects.length} prospect(s)</p>
                </div>
                <button onClick={()=>setProspectModal('new')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1a3a2a] text-white text-xs font-semibold hover:bg-[#2d5a3a] transition-colors shadow-sm">
                  <Plus size={13}/>Ajouter
                </button>
              </div>

              {/* Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {(['all', ...P_STATUS_LIST] as const).map(f=>(
                  <button key={f} onClick={()=>setProspectFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      prospectFilter===f ? 'bg-[#1a3a2a] text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                    {f==='all'?'Tous':P_LABEL[f]}
                  </button>
                ))}
              </div>

              {activeProspects.length===0 ? (
                <div className="rounded-2xl bg-white border border-stone-100 p-12 text-center">
                  <Target size={36} className="text-stone-200 mx-auto mb-3" />
                  <p className="text-stone-400 text-sm">Aucun prospect{prospectFilter!=='all'?` avec le statut "${P_LABEL[prospectFilter as DbProspectStatus]}"`:' enregistré'}.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_1px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                          {['Établissement','Contact','Email','Source','Statut','Dernier contact','Notes','Actions'].map(h=>(
                            <th key={h} className="text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {activeProspects.map(p=>(
                          <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-[#1a3a2a] text-sm">{p.establishment_name}</td>
                            <td className="px-4 py-3 text-xs text-stone-600">{p.contact_name||'—'}{p.phone&&<><br/><span className="text-stone-400">{p.phone}</span></>}</td>
                            <td className="px-4 py-3 text-xs text-stone-600">{p.email||'—'}</td>
                            <td className="px-4 py-3"><span className="text-[10px] bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full text-stone-500">{(p.source||'autre').replace('_',' ')}</span></td>
                            <td className="px-4 py-3">
                              <select value={p.status} onChange={e=>updateProspectStatus(p.id, e.target.value as DbProspectStatus)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]/30 ${P_COLOR[p.status]}`}>
                                {P_STATUS_LIST.map(st=><option key={st} value={st}>{P_LABEL[st]}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-xs text-stone-400">{fmt(p.last_contact_at)}</td>
                            <td className="px-4 py-3 text-xs text-stone-500 max-w-[160px]"><span className="truncate block">{p.notes||'—'}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <button onClick={()=>setProspectModal(p)} className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs hover:border-stone-300 transition-colors">Modifier</button>
                                {p.status!=='converti' && (
                                  <button onClick={()=>convertToOrder(p)} className="px-2.5 py-1.5 rounded-lg bg-[#1a3a2a] text-white text-xs font-semibold hover:bg-[#2d5a3a] transition-colors">Convertir</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 4 — STATISTIQUES
          ══════════════════════════════════════════════════ */}
          {tab==='stats' && (
            <div>
              <div className="mb-5">
                <h2 className="font-serif text-xl font-bold text-[#1a3a2a]">Statistiques</h2>
                <p className="text-stone-400 text-xs mt-0.5">Vue d&apos;ensemble de l&apos;activité ScanAndStay</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: <ShoppingBag size={20}/>, label:'Total commandes',  value: orders.length,                          unit:'',      color:'bg-blue-50 text-blue-600'     },
                  { icon: <TrendingUp  size={20}/>, label:'En cours',         value: orders.filter(o=>o.status!=='cloture').length, unit:'', color:'bg-amber-50 text-amber-600'   },
                  { icon: <Users       size={20}/>, label:'Clients actifs',   value: activeClients.length,                   unit:'',      color:'bg-emerald-50 text-emerald-600'},
                  { icon: <Banknote    size={20}/>, label:'Revenu encaissé',  value: totalRevenue,                           unit:'€',     color:'bg-[#1a3a2a]/5 text-[#1a3a2a]'},
                  { icon: <BarChart2   size={20}/>, label:'MRR',              value: mrr,                                    unit:'€/mois',color:'bg-violet-50 text-violet-600'  },
                  { icon: <Target      size={20}/>, label:'Taux conversion',  value: convRate,                               unit:'%',     color:'bg-orange-50 text-orange-600'  },
                ].map(({icon,label,value,unit,color})=>(
                  <div key={label} className="bg-white rounded-2xl border border-stone-100 shadow-[0_1px_12px_rgba(0,0,0,0.05)] p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
                    <p className="text-xs text-stone-500 mb-1">{label}</p>
                    <p className="font-bold text-[#1a3a2a] text-2xl leading-tight">{value}<span className="text-sm font-medium text-stone-400 ml-1">{unit}</span></p>
                  </div>
                ))}
              </div>

              {/* Pipeline breakdown */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_1px_12px_rgba(0,0,0,0.05)] p-5">
                <p className="text-sm font-bold text-[#1a3a2a] mb-4">Répartition par statut</p>
                <div className="flex flex-col gap-2.5">
                  {PIPELINE.map(col=>{
                    const n = orders.filter(o=>o.status===col.status).length
                    const pct = orders.length ? Math.round(n/orders.length*100) : 0
                    return (
                      <div key={col.status} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`}/>
                        <p className="text-xs text-stone-600 w-40 flex-shrink-0">{col.label}</p>
                        <div className="flex-1 bg-stone-100 rounded-full h-1.5">
                          <div className={`h-full rounded-full ${col.dot}`} style={{width:`${pct}%`}}/>
                        </div>
                        <p className="text-xs font-bold text-stone-700 w-8 text-right">{n}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {paymentOrder && (
        <PaymentModal order={paymentOrder} onClose={()=>setPaymentOrder(undefined)}
          onEmailSent={markEmailSent} onBalanceReceived={markBalanceReceived} />
      )}

      {prospectModal && (
        <ProspectModal
          initial={prospectModal==='new' ? undefined : prospectModal}
          onSave={d => saveProspect(d, prospectModal==='new' ? undefined : prospectModal.id)}
          onClose={()=>setProspectModal(undefined)} />
      )}
    </div>
  )
}
