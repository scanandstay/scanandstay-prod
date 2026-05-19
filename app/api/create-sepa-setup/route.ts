import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  : null

export async function POST(req: NextRequest) {
  console.log('[create-sepa-setup] POST received')

  if (!stripe) {
    console.error('[create-sepa-setup] STRIPE_SECRET_KEY missing')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const { clientEmail, clientName, establishmentName, monthlyAmount } = await req.json()
    console.log('[create-sepa-setup]', { clientEmail, clientName, establishmentName, monthlyAmount })

    if (!clientEmail) {
      return NextResponse.json({ error: 'clientEmail requis' }, { status: 400 })
    }
    if (!monthlyAmount || Number(monthlyAmount) <= 0) {
      return NextResponse.json({ error: 'monthlyAmount invalide' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Créer ou récupérer le client Stripe par email
    const existing = await stripe.customers.list({ email: clientEmail, limit: 1 })
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({
          email: clientEmail,
          name: clientName || undefined,
          metadata: { establishmentName: establishmentName || '' },
        })
    console.log('[create-sepa-setup] customer:', customer.id)

    // Checkout Session en mode setup — SEPA uniquement
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      payment_method_types: ['sepa_debit'],
      customer: customer.id,
      metadata: {
        clientEmail: clientEmail,
        clientName: clientName || '',
        establishmentName: establishmentName || '',
        monthlyAmount: String(monthlyAmount),
        type: 'sepa_setup',
      },
      success_url: `${baseUrl}/onboarding/sepa-success?amount=${encodeURIComponent(monthlyAmount)}&name=${encodeURIComponent(establishmentName || '')}`,
      cancel_url: `${baseUrl}/admin`,
    })

    console.log('[create-sepa-setup] Session created:', session.id, session.url)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[create-sepa-setup] Error:', err instanceof Error ? err.message : JSON.stringify(err))
    return NextResponse.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 },
    )
  }
}
