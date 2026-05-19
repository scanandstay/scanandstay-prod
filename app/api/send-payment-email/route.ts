import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function buildHtml(
  clientName: string,
  establishmentName: string,
  balanceAmount: number,
  monthlyAmount: number,
  paymentUrl: string,
): string {
  const total = balanceAmount + monthlyAmount
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Header -->
        <tr><td align="center" style="padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#2d6a4f;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-size:18px;line-height:36px;">✦</span>
              </td>
              <td style="padding-left:10px;font-size:16px;font-weight:700;color:#1a3a2a;letter-spacing:-0.3px;">
                ScanAndStay
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 24px rgba(0,0,0,0.07);">

          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#2d6a4f;text-transform:uppercase;letter-spacing:1.5px;">Votre guide est prêt</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#1a3a2a;line-height:1.3;">
            Bonjour ${clientName} 👋
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
            Votre guide d'accueil numérique <strong style="color:#1a3a2a;">${establishmentName}</strong> est terminé et prêt à être livré.
            Pour finaliser votre commande, réglez le solde ci-dessous.
          </p>

          <!-- Amounts -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
            <tr>
              <td style="font-size:13px;color:#78716c;padding-bottom:8px;">Solde 50% à la livraison</td>
              <td align="right" style="font-size:13px;font-weight:700;color:#1a3a2a;padding-bottom:8px;">${balanceAmount}€</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#78716c;padding-bottom:12px;">Abonnement mensuel (1er mois)</td>
              <td align="right" style="font-size:13px;font-weight:700;color:#1a3a2a;padding-bottom:12px;">${monthlyAmount}€</td>
            </tr>
            <tr style="border-top:1px solid #e7e5e4;">
              <td style="font-size:15px;font-weight:700;color:#1a3a2a;padding-top:12px;">Total à payer</td>
              <td align="right" style="font-size:18px;font-weight:700;color:#1a3a2a;padding-top:12px;">${total}€</td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${paymentUrl}"
                style="display:inline-block;background:#1a3a2a;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 40px;border-radius:14px;letter-spacing:0.2px;">
                Payer maintenant →
              </a>
            </td></tr>
          </table>

          <p style="margin:24px 0 0;font-size:12px;color:#a8a29e;text-align:center;line-height:1.6;">
            Paiement sécurisé par Stripe · Facture envoyée automatiquement<br>
            L'abonnement mensuel sera renouvelé chaque mois à partir de la livraison.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.6;">
            Une question ? <a href="mailto:romthomas@icloud.com" style="color:#2d6a4f;text-decoration:none;">romthomas@icloud.com</a><br>
            ScanAndStay · Guides d'accueil numériques premium
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  try {
    const { clientName, clientEmail, establishmentName, balanceAmount, monthlyAmount, paymentUrl } = await req.json()

    if (!clientEmail || !paymentUrl) {
      return NextResponse.json({ error: 'clientEmail and paymentUrl are required' }, { status: 400 })
    }

    const result = await resend.emails.send({
      from: 'ScanAndStay <noreply@scanandstay.net>',
      to: clientEmail,
      subject: `Votre guide est prêt — Lien de paiement ScanAndStay`,
      html: buildHtml(clientName, establishmentName, Number(balanceAmount), Number(monthlyAmount), paymentUrl),
    })

    console.log('[send-payment-email] Sent to:', clientEmail, '— result:', JSON.stringify(result))
    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (err) {
    console.error('[send-payment-email] Error:', err instanceof Error ? err.message : JSON.stringify(err))
    return NextResponse.json({ error: err instanceof Error ? err.message : JSON.stringify(err) }, { status: 500 })
  }
}
