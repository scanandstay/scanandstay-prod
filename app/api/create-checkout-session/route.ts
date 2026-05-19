import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Log env var presence at module load time (values never logged for security)
const secretKey = process.env.STRIPE_SECRET_KEY
console.log('[Stripe] STRIPE_SECRET_KEY present:', !!secretKey)
console.log('[Stripe] STRIPE_SECRET_KEY prefix:', secretKey?.slice(0, 8) ?? 'MISSING')
console.log('[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY present:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
console.log('[Stripe] NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL ?? 'not set')

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(req: NextRequest) {
  console.log('[create-checkout-session] POST called')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (e) {
    console.error('[create-checkout-session] Failed to parse request body:', e)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { total, establishmentName, email, ...orderMeta } = body
  console.log('[create-checkout-session] total:', total, 'establishment:', establishmentName, 'email:', email)

  if (!total || Number(total) <= 0) {
    return NextResponse.json({ error: 'Montant invalide', received: total }, { status: 400 })
  }

  const deposit = Math.round(Number(total) / 2)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  console.log('[create-checkout-session] deposit:', deposit, 'baseUrl:', baseUrl)

  // Build string-only metadata (Stripe: 500 chars/value, 50 keys max)
  const metadata: Record<string, string> = {
    establishmentName: String(establishmentName || '').slice(0, 499),
    total: String(total),
    deposit: String(deposit),
  }
  for (const [k, v] of Object.entries(orderMeta)) {
    if (v !== undefined && v !== null) {
      metadata[k] = String(v).slice(0, 499)
    }
  }
  console.log('[create-checkout-session] metadata keys:', Object.keys(metadata))

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte ScanAndStay — ${establishmentName || "Guide d'accueil"}`,
              description: "Acompte 50% pour démarrer la création de votre guide d'accueil numérique",
            },
            unit_amount: deposit * 100,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      customer_email: email ? String(email) : undefined,
      invoice_creation: { enabled: true },
      payment_intent_data: {
        description: `ScanAndStay — ${establishmentName}`,
      },
      metadata,
      success_url: `${baseUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/onboarding`,
    })

    console.log('[create-checkout-session] Session created:', session.id)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      console.error('[create-checkout-session] Stripe error:', {
        type: err.type,
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        rawType: err.rawType,
      })
      return NextResponse.json(
        {
          error: err.message,
          stripeType: err.type,
          stripeCode: err.code,
          statusCode: err.statusCode,
        },
        { status: err.statusCode ?? 500 }
      )
    }
    console.error('[create-checkout-session] Unexpected error:', err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}
