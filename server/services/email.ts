import { Resend } from "resend";
import { storage } from "../storage";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM || "Kairós Gráfica <noreply@kairos.com.br>";

// ── Layout ──

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:100%;">
<!-- Header -->
<tr><td style="background:#111111;padding:24px 32px;text-align:center;">
<span style="color:#d4af37;font-size:24px;font-weight:700;letter-spacing:2px;">KAIRÓS</span>
<span style="color:#999;font-size:14px;display:block;margin-top:4px;">GRÁFICA</span>
</td></tr>
<!-- Body -->
<tr><td style="padding:32px;">
${body}
</td></tr>
<!-- Footer -->
<tr><td style="background:#fafafa;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
<p style="margin:0;color:#999;font-size:12px;">Kairós Gráfica — Qualidade que marca.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// ── Send helper ──

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not configured — skipping email");
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    console.log(`[Email] Sent "${subject}" to ${to}`);
  } catch (err: any) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, err?.message || err);
  }
}

// ── Templates ──

function sendOrderConfirmedEmail(to: string, orderId: string, total: string): Promise<void> {
  const shortId = orderId.slice(0, 8).toUpperCase();
  return sendEmail(to, `Pagamento confirmado — Pedido #${shortId}`, layout(
    "Pagamento Confirmado",
    `<h2 style="margin:0 0 16px;color:#111;">Pagamento confirmado!</h2>
<p style="color:#555;line-height:1.6;">Seu pedido <strong>#${shortId}</strong> foi confirmado com sucesso.</p>
<table style="width:100%;margin:20px 0;border-collapse:collapse;">
<tr><td style="padding:12px;background:#f9f9f9;border-radius:8px;">
<span style="color:#999;font-size:13px;">Total</span><br>
<span style="color:#111;font-size:22px;font-weight:700;">R$ ${total}</span>
</td></tr>
</table>
<p style="color:#555;line-height:1.6;">Em breve seu pedido entrará em produção. Você receberá um e-mail a cada atualização de status.</p>`,
  ));
}

function sendOrderInProductionEmail(to: string, orderId: string): Promise<void> {
  const shortId = orderId.slice(0, 8).toUpperCase();
  return sendEmail(to, `Pedido #${shortId} em produção`, layout(
    "Em Produção",
    `<h2 style="margin:0 0 16px;color:#111;">Seu pedido está em produção!</h2>
<p style="color:#555;line-height:1.6;">O pedido <strong>#${shortId}</strong> entrou na fase de produção. Nossa equipe está preparando seus materiais com todo o cuidado.</p>
<p style="color:#555;line-height:1.6;">Assim que a produção for concluída e o pedido for despachado, enviaremos o código de rastreio.</p>`,
  ));
}

function sendOrderShippedEmail(to: string, orderId: string, trackingCode: string): Promise<void> {
  const shortId = orderId.slice(0, 8).toUpperCase();
  return sendEmail(to, `Pedido #${shortId} enviado — Rastreio: ${trackingCode}`, layout(
    "Pedido Enviado",
    `<h2 style="margin:0 0 16px;color:#111;">Seu pedido foi enviado!</h2>
<p style="color:#555;line-height:1.6;">O pedido <strong>#${shortId}</strong> saiu para entrega.</p>
<table style="width:100%;margin:20px 0;border-collapse:collapse;">
<tr><td style="padding:16px;background:#f0f7ff;border-radius:8px;text-align:center;">
<span style="color:#555;font-size:13px;">Código de Rastreio</span><br>
<span style="color:#111;font-size:20px;font-weight:700;font-family:monospace;letter-spacing:1px;">${trackingCode}</span>
</td></tr>
</table>
<p style="color:#555;line-height:1.6;">Acompanhe a entrega pelo site dos Correios ou da transportadora.</p>`,
  ));
}

function sendOrderDeliveredEmail(to: string, orderId: string): Promise<void> {
  const shortId = orderId.slice(0, 8).toUpperCase();
  return sendEmail(to, `Pedido #${shortId} entregue`, layout(
    "Pedido Entregue",
    `<h2 style="margin:0 0 16px;color:#111;">Pedido entregue!</h2>
<p style="color:#555;line-height:1.6;">O pedido <strong>#${shortId}</strong> foi entregue com sucesso.</p>
<p style="color:#555;line-height:1.6;">Obrigado por confiar na Kairós Gráfica! Se precisar de algo, estamos à disposição.</p>`,
  ));
}

function sendOrderCancelledEmail(to: string, orderId: string): Promise<void> {
  const shortId = orderId.slice(0, 8).toUpperCase();
  return sendEmail(to, `Pedido #${shortId} cancelado`, layout(
    "Pedido Cancelado",
    `<h2 style="margin:0 0 16px;color:#111;">Pedido cancelado</h2>
<p style="color:#555;line-height:1.6;">O pedido <strong>#${shortId}</strong> foi cancelado.</p>
<p style="color:#555;line-height:1.6;">Se isso foi um engano ou se precisar de ajuda, entre em contato conosco.</p>`,
  ));
}

// ── Welcome Email ──

export function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(" ")[0];
  return sendEmail(to, `Bem-vindo à Kairós Gráfica, ${firstName}!`, layout(
    "Bem-vindo",
    `<h2 style="margin:0 0 16px;color:#111;">Bem-vindo à Kairós Gráfica!</h2>
<p style="color:#555;line-height:1.6;">Olá <strong>${firstName}</strong>, sua conta foi criada com sucesso.</p>
<p style="color:#555;line-height:1.6;">Agora você pode acessar nosso catálogo completo de impressos de alta qualidade e fazer seus pedidos com facilidade.</p>
<table style="width:100%;margin:24px 0;border-collapse:collapse;">
<tr><td align="center">
<a href="${process.env.SITE_URL || "https://kairos.com.br"}/grafica" style="display:inline-block;padding:14px 32px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Ver Catálogo</a>
</td></tr>
</table>
<p style="color:#555;line-height:1.6;">Se precisar de ajuda, estamos à disposição!</p>`,
  ));
}

// ── Trigger by status ──

export async function triggerOrderEmail(
  orderId: string,
  newStatus: string,
  trackingCode?: string,
): Promise<void> {
  try {
    const order = await storage.getOrder(orderId);
    if (!order) return;

    const customer = await storage.getCustomer(order.customerId);
    if (!customer?.email) return;

    const to = customer.email;

    switch (newStatus) {
      case "confirmed":
        await sendOrderConfirmedEmail(to, orderId, order.total);
        break;
      case "production":
        await sendOrderInProductionEmail(to, orderId);
        break;
      case "shipped":
        if (trackingCode) {
          await sendOrderShippedEmail(to, orderId, trackingCode);
        }
        break;
      case "delivered":
        await sendOrderDeliveredEmail(to, orderId);
        break;
      case "cancelled":
        await sendOrderCancelledEmail(to, orderId);
        break;
    }
  } catch (err: any) {
    console.error(`[Email] triggerOrderEmail failed for order ${orderId}:`, err?.message || err);
  }
}
