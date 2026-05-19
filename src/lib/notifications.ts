import { Resend } from 'resend';

interface ContactData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

interface ChatData {
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
}

export async function notifyNewContact(data: ContactData) {
  // Email
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not found');
      return;
    }

    const resend = new Resend(apiKey);
    
    const result = await resend.emails.send({
      from: 'notifications@revestitching.com',
      to: 'hamzali.revesystems@gmail.com',
      subject: `🔔 New Contact: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
        <a href="https://revestitching.com/admin">View in Admin Panel</a>
      `,
    });

    console.log('Email sent successfully:', result);
  } catch (e) {
    console.error('Email failed:', e);
  }

  // Discord
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const result = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🔔 New Contact Form',
            color: 0x3B82F6,
            fields: [
              { name: 'Name', value: data.name, inline: true },
              { name: 'Email', value: data.email, inline: true },
              { name: 'Subject', value: data.subject },
              { name: 'Message', value: data.message.substring(0, 200) },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      if (!result.ok) {
        console.error('Discord failed:', await result.text());
      } else {
        console.log('Discord notification sent');
      }
    } catch (e) {
      console.error('Discord failed:', e);
    }
  }
}

export async function notifyNewChat(data: ChatData) {
  // Email
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not found');
      return;
    }

    const resend = new Resend(apiKey);
    
    const result = await resend.emails.send({
      from: 'notifications@revestitching.com',
      to: 'hamzali.revesystems@gmail.com',
      subject: '💬 New Live Chat Request',
      html: `
        <h2>Someone Requested Live Chat</h2>
        <p><strong>Name:</strong> ${data.visitorName || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${data.visitorEmail || 'Not provided'}</p>
        <a href="https://revestitching.com/admin/chat/${data.sessionId}">Open Chat</a>
      `,
    });

    console.log('Chat email sent successfully:', result);
  } catch (e) {
    console.error('Chat email failed:', e);
  }

  // Discord
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const result = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '💬 New Live Chat',
            color: 0x10B981,
            fields: [
              { name: 'Name', value: data.visitorName || 'Anonymous', inline: true },
              { name: 'Email', value: data.visitorEmail || 'Not provided', inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      if (!result.ok) {
        console.error('Discord chat notification failed:', await result.text());
      } else {
        console.log('Discord chat notification sent');
      }
    } catch (e) {
      console.error('Discord chat notification failed:', e);
    }
  }
}

// ═══════════════════════════════════════════════════
// QUOTE NOTIFICATIONS (add these at the bottom)
// ═══════════════════════════════════════════════════

import type { QuoteRequest } from './types/quote';

export async function notifyNewQuote(quote: QuoteRequest) {
  const PRODUCT_NAMES: Record<string, string> = {
    't-shirts': 'Premium Cotton T-Shirts',
    'polo-shirts': 'Corporate Polo Shirts',
    'hoodies': 'Premium Hoodies',
    'joggers': 'Athletic Joggers',
    'sweatshirts': 'Sweatshirts Collection',
    'ladies-wear': "Ladies' Wear",
    'kids-wear': "Kids' Wear Range",
    'custom': 'Custom / Other',
  };

  const productLabel = PRODUCT_NAMES[quote.product_type] || quote.product_type;
  const adminUrl = `https://revestitching.com/admin/quote/${quote.id}`;

  // Email to team
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not found');
      return;
    }

    const resend = new Resend(apiKey);
    
    await resend.emails.send({
      from: 'notifications@revestitching.com',
      to: 'hamzali.revesystems@gmail.com',
      subject: `🎯 New Quote: ${quote.reference_number} — ${quote.company_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #166534; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🎯 New Quote Request</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0;">${quote.reference_number}</p>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #166534; font-size: 16px; margin: 0 0 16px;">Contact</h2>
            <p><strong>Company:</strong> ${quote.company_name}</p>
            <p><strong>Contact:</strong> ${quote.contact_person}</p>
            <p><strong>Email:</strong> ${quote.email}</p>
            ${quote.phone ? `<p><strong>Phone:</strong> ${quote.phone}</p>` : ''}
            
            <h2 style="color: #166534; font-size: 16px; margin: 24px 0 16px;">Order Details</h2>
            <p><strong>Product:</strong> ${productLabel}</p>
            <p><strong>Quantity:</strong> ${quote.quantity.toLocaleString()} pcs</p>
            <p><strong>Fabric:</strong> ${quote.fabric_type} — ${quote.gsm} GSM</p>
            <p><strong>Destination:</strong> ${quote.destination}</p>
            <p><strong>Delivery:</strong> ${quote.target_date}</p>
            ${quote.is_rush ? '<p style="color: #d97706;"><strong>⚡ RUSH ORDER</strong></p>' : ''}
            
            ${quote.ai_summary ? `
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: #166534; font-size: 14px; margin: 0 0 8px;">🤖 AI Analysis</h3>
              <p style="margin: 0; font-size: 14px;">${quote.ai_summary}</p>
              ${quote.estimated_price_range ? `<p style="margin: 8px 0 0; color: #166534;"><strong>Est. Price:</strong> ${quote.estimated_price_range}</p>` : ''}
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 24px;">
              <a href="${adminUrl}" style="display: inline-block; padding: 12px 32px; background: #166534; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                View Full Details →
              </a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; background: #f9fafb; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">Reve Stitching Quote System • Faisalabad, Pakistan</p>
          </div>
        </div>
      `,
    });

    console.log('Quote team notification sent:', quote.reference_number);
  } catch (e) {
    console.error('Quote email failed:', e);
  }

  // Discord notification
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const flags: string[] = [];
      if (quote.is_rush) flags.push('⚡ Rush Order');
      if (quote.has_sample) flags.push('📦 Sample Requested');
      if (quote.quantity >= 5000) flags.push('🔥 Large Order');

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `🎯 New Quote: ${quote.reference_number}`,
            url: adminUrl,
            color: 0x166534,
            fields: [
              { name: '🏢 Company', value: quote.company_name, inline: true },
              { name: '👤 Contact', value: `${quote.contact_person}\n${quote.email}`, inline: true },
              { name: '📦 Product', value: productLabel, inline: true },
              { name: '🔢 Quantity', value: `${quote.quantity.toLocaleString()} pcs`, inline: true },
              { name: '🧵 Fabric', value: `${quote.fabric_type} ${quote.gsm}gsm`, inline: true },
              { name: '🌍 Destination', value: quote.destination.toUpperCase(), inline: true },
              ...(quote.estimated_price_range
                ? [{ name: '💰 Est. Price', value: quote.estimated_price_range, inline: true }]
                : []),
              ...(flags.length
                ? [{ name: '🚩 Flags', value: flags.join(' • '), inline: false }]
                : []),
              ...(quote.ai_summary
                ? [{ name: '🤖 AI Summary', value: quote.ai_summary.slice(0, 500), inline: false }]
                : []),
            ],
            footer: { text: 'Reve Stitching Quote System' },
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      console.log('Quote Discord notification sent:', quote.reference_number);
    } catch (e) {
      console.error('Quote Discord notification failed:', e);
    }
  }
}

export async function sendQuoteCustomerConfirmation(quote: QuoteRequest) {
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    
    await resend.emails.send({
      from: 'notifications@revestitching.com',
      to: quote.email,
      subject: `Quote Request Received — ${quote.reference_number}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #166534; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 18px;">Reve Stitching</h1>
            <p style="color: #bbf7d0; margin: 6px 0 0; font-size: 12px;">Premium Knitted Garments Manufacturer</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="margin: 0 0 12px; font-size: 18px; color: #111;">Thank you, ${quote.contact_person}!</h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #4b5563; line-height: 1.6;">
              We've received your quote request and our team is reviewing it. You'll hear back from us within <strong>24 hours</strong> with a detailed quotation.
            </p>
            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Your Reference Number</p>
              <p style="margin: 0; font-size: 24px; font-weight: 700; color: #166534; letter-spacing: 1px;">${quote.reference_number}</p>
            </div>
            <p style="margin: 0; font-size: 13px; color: #6b7280;">
              Please keep this reference number for your records. If you have any urgent queries, reply to this email or contact us directly.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; background: #f9fafb; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">Reve Stitching • Faisalabad, Pakistan • revestitching.com</p>
          </div>
        </div>
      `,
    });

    console.log('Customer confirmation sent to:', quote.email);
  } catch (e) {
    console.error('Customer confirmation failed:', e);
  }
}