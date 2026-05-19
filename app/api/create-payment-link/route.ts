import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  : null

export async function POST(req: NextRequest) {
  console.log('[create-payment-link] POST received')

  if (!stripe) {
    console.error('[create-payment-link] STRIPE_SECRET_KEY missing')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const { clientName, clientEmail, establishmentName, balanceAmount, monthlyAmount } = await req.json()
    console.log('[create-payment-link]', { clientName, clientEmail, establishmentName, balanceAmount, monthlyAmount })

    if (!balanceAmount || balanceAmount <= 0) {
      return NextResponse.json({ error: 'Montant du solde invalide' }, { status: 400 })
    }
    if (!monthlyAmount || monthlyAmount <= 0) {
      return NextResponse.json({ error: "Montant de l'abonnement invalide" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Checkout Session — two line items:
    // 1. Solde 50% (one-time)
    // 2. Premier mois d'abonnement (one-time)
    // Payment method saved for future recurring subscription (SEPA or card)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Solde 50% — Guide ScanAndStay — ${establishmentName}`,
              description: `Solde à la livraison — ${clientName}`,
            },
            unit_amount: Math.round(balanceAmount * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Abonnement mensuel — 1er mois — ${establishmentName}`,
              description: `${monthlyAmount}€/mois — renouvellement mensuel`,
            },
            unit_amount: Math.round(monthlyAmount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: clientEmail || undefined,
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },
      payment_intent_data: {
        description: `ScanAndStay — Solde + abonnement — ${establishmentName}`,
        // Save payment method for future recurring SEPA/card subscription
        setup_future_usage: 'off_session',
        metadata: {
          clientName: clientName || '',
          clientEmail: clientEmail || '',
          establishmentName: establishmentName || '',
          monthlyAmount: String(monthlyAmount),
          type: 'solde_abonnement',
        },
      },
      success_url: `${baseUrl}/onboarding/success`,
      cancel_url: `${baseUrl}/admin`,
    })

    console.log('[create-payment-link] Session created:', session.id, session.url)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[create-payment-link] Error:', err instanceof Error ? err.message : JSON.stringify(err))
    return NextResponse.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 }
    )
  }
}
