import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

// ── Env checks at module load ──
console.log('[webhook] STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY)
console.log('[webhook] STRIPE_SECRET_KEY prefix:', process.env.STRIPE_SECRET_KEY?.slice(0, 8) ?? 'MISSING')
console.log('[webhook] STRIPE_WEBHOOK_SECRET present:', !!process.env.STRIPE_WEBHOOK_SECRET)
console.log('[webhook] STRIPE_WEBHOOK_SECRET prefix:', process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 8) ?? 'MISSING')
console.log('[webhook] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY)
console.log('[webhook] RESEND_API_KEY prefix:', process.env.RESEND_API_KEY?.slice(0, 6) ?? 'MISSING')

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  : null

const OFFER_LABELS: Record<string, string> = {
  starter: 'Starter — 299€ + 19€/mois',
  premium: 'Premium — 599€ + 29€/mois',
  multi: 'Multi-propriétés — Sur devis',
}

function buildClientEmail(m: Record<string, string>): string {
  const deposit = Number(m.deposit || 0)
  const total = Number(m.total || 0)
  const solde = total - deposit
  const offerLabel = OFFER_LABELS[m.offer] || m.offer || '—'
  return [
    `Bonjour ${m.billingName || m.ownerName || ''},`,
    '',
    'Merci pour votre commande ScanAndStay !',
    `Nous avons bien reçu votre acompte de ${deposit}€ pour votre guide ${m.establishmentName}.`,
    'Votre guide sera livré sous 7 jours ouvrables.',
    '',
    '=== RÉCAPITULATIF ===',
    `Offre : ${offerLabel}`,
    `Langues : ${m.languages || '—'}`,
    `Total : ${total}€`,
    `Acompte payé : ${deposit}€`,
    `Solde à la livraison : ${solde}€`,
    "Abonnement mensuel dû 30 jours après livraison.",
    '',
    'Pour toute question : romthomas@icloud.com',
    '',
    'À très bientôt,',
    'Romain — ScanAndStay',
  ].join('\n')
}

function buildNotificationEmail(m: Record<string, string>, amountPaid: number): string {
  const today = new Date().toLocaleDateString('fr-BE')
  const lines: string[] = [
    '=== NOUVELLE COMMANDE PAYÉE — SCANANDSTAY ===',
    `Date : ${today}`,
    `Acompte reçu : ${amountPaid}€`,
    '',
    '--- CLIENT ---',
    `Nom facturation : ${m.billingName || '—'}`,
    `Email client : ${m.email || '—'}`,
    `Email facturation : ${m.billingEmail || '—'}`,
    `Téléphone : ${m.phone || '—'}`,
  ]
  if (m.billingVat) lines.push(`Numéro TVA : ${m.billingVat}`)
  if (m.billingIban) lines.push(`IBAN client : ${m.billingIban}`)
  lines.push(
    '',
    '--- ÉTABLISSEMENT ---',
    `Nom : ${m.establishmentName || '—'}`,
    `Adresse : ${m.address || '—'}`,
    `Propriétaires : ${m.ownerName || '—'}`,
    '',
    '--- ADRESSE DE FACTURATION ---',
    `${m.billingAddress || '—'}`,
    `${m.billingPostalCity || '—'} — ${m.billingCountry || '—'}`,
    '',
    '--- COMMANDE ---',
    `Offre : ${OFFER_LABELS[m.offer] || m.offer || '—'}`,
    `Langues : ${m.languages || '—'}`,
    `Recherche commerces : ${m.localResearch || 'non'}`,
    `Recherche activités : ${m.activitiesResearch || 'non'}`,
    `Plaques en bois gravées : ${m.qrPlates || '0'}`,
    '',
    `TOTAL : ${m.total || '—'}€`,
    `Acompte 50% payé : ${m.deposit || '—'}€`,
    `Solde 50% à la livraison : ${Number(m.total || 0) - Number(m.deposit || 0)}€`,
  )
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  console.log('[webhook] POST received')

  try {
  // ── 0. Guard — stripe client must be initialised ──
  if (!stripe) {
    console.error('[webhook] STRIPE_SECRET_KEY missing at runtime — cannot process webhook')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  // ── 1. Read raw body ──
  let body: string
  try {
    body = await req.text()
    console.log('[webhook] body length:', body.length)
  } catch (e) {
    console.error('[webhook] Failed to read body:', e)
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 })
  }

  // ── 2. Check stripe-signature header ──
  const sig = req.headers.get('stripe-signature')
  console.log('[webhook] stripe-signature present:', !!sig)
  if (!sig) {
    console.error('[webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // ── 3. Check webhook secret ──
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // ── 4. Verify signature ──
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log('[webhook] Signature verified. Event type:', event.type, '— id:', event.id)
  } catch (e) {
    console.error('[webhook] Signature verification failed:', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { error: 'Invalid signature', detail: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    )
  }

  // ── 5. Handle checkout.session.completed ──
  if (event.type === 'checkout.session.completed') {
    console.log('[webhook] Processing checkout.session.completed')

    try {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[webhook] session.mode:', session.mode)

      // ── 5a. Mode setup — domiciliation SEPA ──────────────────────────────
      if (session.mode === 'setup') {
        console.log('[webhook] Handling SEPA setup session')
        const m = (session.metadata ?? {}) as Record<string, string>

        try {
          const setupIntentId = typeof session.setup_intent === 'string'
            ? session.setup_intent
            : session.setup_intent?.id ?? null

          if (!setupIntentId) {
            console.error('[webhook] setup_intent missing from session')
          } else {
            const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
            console.log('[webhook] SetupIntent status:', setupIntent.status)

            const paymentMethodId = typeof setupIntent.payment_method === 'string'
              ? setupIntent.payment_method
              : setupIntent.payment_method?.id ?? null

            const customerId = typeof session.customer === 'string'
              ? session.customer
              : session.customer?.id ?? null

            console.log('[webhook] SEPA paymentMethodId:', paymentMethodId, '— customerId:', customerId)

            if (paymentMethodId && customerId) {
              // Attacher le PM au customer et le définir par défaut
              await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })
              await stripe.customers.update(customerId, {
                invoice_settings: { default_payment_method: paymentMethodId },
              })
              console.log('[webhook] SEPA payment method attached to customer:', customerId)

              const monthlyAmountCents = Math.round(Number(m.monthlyAmount || 0) * 100)

              if (monthlyAmountCents > 0) {
                // Créer le prix récurrent
                const price = await stripe.prices.create({
                  currency: 'eur',
                  unit_amount: monthlyAmountCents,
                  recurring: { interval: 'month' },
                  product_data: {
                    name: `Abonnement ScanAndStay — ${m.establishmentName || 'Guide'}`,
                  },
                })

                // Créer l'abonnement — commence immédiatement
                const subscription = await stripe.subscriptions.create({
                  customer: customerId,
                  items: [{ price: price.id }],
                  default_payment_method: paymentMethodId,
                  collection_method: 'charge_automatically',
                  metadata: {
                    clientName: m.clientName || '',
                    clientEmail: m.clientEmail || '',
                    establishmentName: m.establishmentName || '',
                    source: 'sepa_setup',
                  },
                })
                console.log('[webhook] SEPA subscription created:', subscription.id, '— status:', subscription.status)
              } else {
                console.warn('[webhook] monthlyAmount missing or zero — subscription not created')
              }
            } else {
              console.error('[webhook] Missing paymentMethodId or customerId for SEPA setup')
            }
          }
        } catch (sepaErr) {
          console.error('[webhook] SEPA setup handler error:', sepaErr instanceof Error ? sepaErr.stack : JSON.stringify(sepaErr))
        }

        return NextResponse.json({ received: true })
      }

      // ── 5b. Mode payment — logique existante ─────────────────────────────
      console.log('[webhook] session object type:', typeof session)

      const m = (session.metadata ?? {}) as Record<string, string>
      console.log('[webhook] metadata parsed OK — keys:', Object.keys(m))

      const amountPaid = Math.round((session.amount_total ?? 0) / 100)
      console.log('[webhook] Session id:', session.id, '— amount paid:', amountPaid, '€')

      // ── Resolve client email step by step ──
      console.log('[webhook] Resolving client email…')

      let billingEmailMeta: string | null = null
      try { billingEmailMeta = m.billingEmail?.trim() || null } catch (e) { console.error('[webhook] billingEmail read error:', e) }
      console.log('[webhook] billingEmail from metadata:', billingEmailMeta ?? 'EMPTY')

      let customerDetailsEmail: string | null = null
      try { customerDetailsEmail = session.customer_details?.email?.trim() || null } catch (e) { console.error('[webhook] customer_details.email read error:', e) }
      console.log('[webhook] customer_details.email:', customerDetailsEmail ?? 'EMPTY')

      let customerEmailField: string | null = null
      try { customerEmailField = (session as unknown as { customer_email?: string }).customer_email?.trim() || null } catch (e) { console.error('[webhook] customer_email field read error:', e) }
      console.log('[webhook] session.customer_email:', customerEmailField ?? 'EMPTY')

      const clientEmail = billingEmailMeta || customerDetailsEmail || customerEmailField
      console.log('[webhook] clientEmail:', clientEmail ?? 'NO CLIENT EMAIL FOUND')
      if (!clientEmail) {
        console.error('[webhook] NO CLIENT EMAIL FOUND — full metadata dump:', JSON.stringify(m))
      }

      // ── 6. Auto-create monthly subscription for admin payment links ──
      if (m.type === 'solde_abonnement' && stripe) {
        console.log('[webhook] Detected admin payment link — attempting auto-subscription creation')
        try {
          const paymentIntent = session.payment_intent
            ? await stripe.paymentIntents.retrieve(String(session.payment_intent))
            : null

          const paymentMethodId = paymentIntent
            ? (typeof paymentIntent.payment_method === 'string'
                ? paymentIntent.payment_method
                : paymentIntent.payment_method?.id ?? null)
            : null

          console.log('[webhook] paymentMethodId:', paymentMethodId ?? 'NOT FOUND')

          const subEmail = m.clientEmail || clientEmail
          const monthlyAmountCents = Math.round(Number(m.monthlyAmount || 0) * 100)

          if (paymentMethodId && subEmail && monthlyAmountCents > 0) {
            // Create or retrieve Stripe customer
            const customers = await stripe.customers.list({ email: subEmail, limit: 1 })
            const customer = customers.data.length > 0
              ? customers.data[0]
              : await stripe.customers.create({
                  email: subEmail,
                  name: m.clientName || undefined,
                  metadata: { establishmentName: m.establishmentName || '' },
                })
            console.log('[webhook] Stripe customer:', customer.id)

            // Attach payment method to customer
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
            await stripe.customers.update(customer.id, {
              invoice_settings: { default_payment_method: paymentMethodId },
            })
            console.log('[webhook] Payment method attached to customer')

            // Create monthly subscription (start billing in 30 days)
            const trialEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

            // Create the recurring price inline (SDK type workaround via price creation)
            const price = await stripe.prices.create({
              currency: 'eur',
              unit_amount: monthlyAmountCents,
              recurring: { interval: 'month' },
              product_data: {
                name: `Abonnement ScanAndStay — ${m.establishmentName || 'Guide'}`,
              },
            })

            const subscription = await stripe.subscriptions.create({
              customer: customer.id,
              items: [{ price: price.id }],
              default_payment_method: paymentMethodId,
              trial_end: trialEnd,
              collection_method: 'charge_automatically',
              metadata: {
                clientName: m.clientName || '',
                establishmentName: m.establishmentName || '',
                source: 'admin_payment_link',
              },
            })
            console.log('[webhook] Monthly subscription created:', subscription.id, '— trial ends:', new Date(trialEnd * 1000).toLocaleDateString('fr-BE'))
          } else {
            console.warn('[webhook] Skipping subscription creation — missing paymentMethodId, email, or monthlyAmount. paymentMethodId:', paymentMethodId, 'subEmail:', subEmail, 'monthlyAmountCents:', monthlyAmountCents)
          }
        } catch (subErr) {
          console.error('[webhook] Subscription creation failed:', subErr instanceof Error ? subErr.stack : JSON.stringify(subErr))
        }
      }

      // ── 7. Send emails via Resend ──
      console.log('[webhook] Checking RESEND_API_KEY…')
      const resendKey = process.env.RESEND_API_KEY
      console.log('[webhook] RESEND_API_KEY present at send time:', !!resendKey)

      if (resendKey) {
        const resend = new Resend(resendKey)
        console.log('[webhook] Resend instance created OK')

        // Email 1 — notification to Romain
        console.log('[webhook] About to send emails')
        console.log('[webhook] Sending Email 1 to romthomas@icloud.com…')
        try {
          const r1 = await resend.emails.send({
            from: 'ScanAndStay <noreply@scanandstay.net>',
            to: 'romthomas@icloud.com',
            subject: `Commande payée — ${m.establishmentName || 'Nouvel établissement'} — ${amountPaid}€`,
            text: buildNotificationEmail(m, amountPaid),
          })
          console.log('[webhook] Email 1 sent. Result:', JSON.stringify(r1))
        } catch (e) {
          console.error('[webhook] Email 1 FAILED:', e instanceof Error ? e.message : JSON.stringify(e))
        }

        // Email 2 — confirmation to client
        if (clientEmail) {
          console.log('[webhook] >>> Sending Email 2 (client confirmation) to:', clientEmail)
          try {
            const r2 = await resend.emails.send({
              from: 'ScanAndStay <noreply@scanandstay.net>',
              to: clientEmail,
              subject: 'Confirmation de commande — ScanAndStay',
              text: buildClientEmail(m),
            })
            console.log('[webhook] <<< Email 2 sent. Result:', JSON.stringify(r2))
          } catch (e) {
            console.error('[webhook] <<< Email 2 FAILED:', e instanceof Error ? e.message : JSON.stringify(e))
          }
        } else {
          console.error('[webhook] NO CLIENT EMAIL FOUND — skipping Email 2')
        }
      } else {
        console.warn('[webhook] RESEND_API_KEY not set — printing emails to console:')
        console.log('--- ROMAIN ---')
        console.log(buildNotificationEmail(m, amountPaid))
        console.log('--- CLIENT ---')
        console.log(buildClientEmail(m))
      }
    } catch (e) {
      console.error('[webhook] UNCAUGHT ERROR in checkout.session.completed handler:', e instanceof Error ? e.stack : JSON.stringify(e))
    }
  } else {
    console.log('[webhook] Unhandled event type:', event.type, '— ignoring')
  }

  return NextResponse.json({ received: true })

  } catch (globalErr) {
    console.error('[webhook] GLOBAL UNCAUGHT ERROR:', globalErr instanceof Error ? globalErr.stack : JSON.stringify(globalErr))
    return NextResponse.json({ error: 'Internal server error', detail: globalErr instanceof Error ? globalErr.message : String(globalErr) }, { status: 500 })
  }
}
