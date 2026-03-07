// src/lib/services/whatsapp-links.ts

/**
 * WhatsApp link utilities — used by widget, admin panel, and fallback
 * when Twilio is unavailable. Works everywhere, zero dependencies.
 */

const BUSINESS_NUMBER = import.meta.env.WHATSAPP_BUSINESS_NUMBER || '923001234567';

/**
 * Sanitize phone number to E.164-ish format (digits only, no +)
 * Handles: +92-300-1234567, 0092 300 1234567, 03001234567
 */
export function sanitizePhone(raw: string): string {
  // Strip everything except digits
  let digits = raw.replace(/\D/g, '');

  // Pakistan local format: 03XX → 923XX
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '92' + digits.slice(1);
  }

  // UK local format: 07XXX → 447XXX
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '44' + digits.slice(1);
  }

  // Strip leading 00 (international prefix)
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  return digits;
}

/**
 * Generate wa.me click-to-chat URL
 * Works on desktop (WhatsApp Web) and mobile (WhatsApp app)
 */
export function buildWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleanPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Build link for buyer → business (website widget)
 */
export function buildBuyerChatLink(context?: {
  productName?: string;
  pageUrl?: string;
}): string {
  let message = 'Hi, I\'m interested in your manufacturing services.';

  if (context?.productName) {
    message = `Hi, I'm interested in ${context.productName}. Can you help with pricing and MOQ?`;
  }

  if (context?.pageUrl) {
    message += `\n\nI was looking at: ${context.pageUrl}`;
  }

  return buildWhatsAppLink(BUSINESS_NUMBER, message);
}

/**
 * Build link for admin → buyer (quote follow-up)
 */
export function buildAdminToBuyerLink(buyer: {
  phone: string;
  name: string;
  companyName?: string;
  quoteRef: string;
}): string {
  const greeting = buyer.companyName
    ? `Hi ${buyer.name} from ${buyer.companyName}`
    : `Hi ${buyer.name}`;

  const message = [
    `${greeting},`,
    '',
    `Thank you for your quote request (Ref: ${buyer.quoteRef}) on Reve Stitching.`,
    '',
    `I'd like to discuss your requirements in detail. When would be a good time to connect?`,
    '',
    'Best regards,',
    'Reve Stitching Sales Team',
  ].join('\n');

  return buildWhatsAppLink(buyer.phone, message);
}

/**
 * Build self-notification link (for manual forwarding / fallback)
 */
export function buildQuoteAlertLink(quote: {
  refNumber: string;
  companyName: string;
  productType: string;
  quantity: number;
  quoteId: string;
}): string {
  const message = [
    '🆕 New Quote Request',
    '',
    `Ref: ${quote.refNumber}`,
    `From: ${quote.companyName}`,
    `Product: ${quote.productType}`,
    `Quantity: ${quote.quantity} pcs`,
    '',
    `📋 View: https://revestitching.com/admin/quotes/${quote.quoteId}`,
  ].join('\n');

  return buildWhatsAppLink(BUSINESS_NUMBER, message);
}