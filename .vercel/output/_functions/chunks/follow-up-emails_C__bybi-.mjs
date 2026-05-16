import { Resend } from 'resend';
import { a as generateQuoteUnderReviewEmail, g as generateAdminReminderEmail, b as buildAdminReminderDiscordPayload, c as generateReengagementEmail } from './quote-reengagement_Cg833LUq.mjs';

const ADMIN_EMAIL = process.env.TEAM_EMAIL || "hamzali.revesystems@gmail.com";
const FROM_ADDRESS = "Reve Stitching <notifications@revestitching.com>";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";
const THRESHOLD_24H = 24;
const THRESHOLD_48H = 48;
const THRESHOLD_7D = 168;
const MAX_EMAILS_PER_RUN = 10;
const ADMIN_ACTION_SUPPRESS_HOURS = 48;
function hoursSince(dateString) {
  const created = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  return (now.getTime() - created.getTime()) / (1e3 * 60 * 60);
}
function hoursSinceOptional(dateString) {
  if (!dateString) return null;
  return hoursSince(dateString);
}
function timestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function logEmail(supabase, quoteId, emailType, recipient, resendId, status, errorMessage) {
  try {
    await supabase.from("email_log").insert({
      quote_id: quoteId,
      email_type: emailType,
      recipient,
      resend_id: resendId,
      status,
      error_message: errorMessage || null
    });
  } catch (err) {
    console.error(`[FollowUp] Failed to write email_log:`, err);
  }
}
async function sendDiscordWebhook(payload) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("[FollowUp] Discord webhook URL not configured, skipping");
    return;
  }
  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8e3)
    });
    if (!res.ok) {
      console.error(`[FollowUp] Discord webhook failed: ${res.status}`);
    }
  } catch (err) {
    console.error("[FollowUp] Discord webhook error:", err);
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function send24HourFollowUp(quote, resend, supabase) {
  const tag = `[FollowUp][24h][${quote.reference_number}]`;
  console.log(`${tag} Sending to ${quote.email}...`);
  try {
    const { subject, html } = await generateQuoteUnderReviewEmail(quote);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [quote.email],
      subject,
      html,
      replyTo: "info@revestitching.com",
      // ← ADD THIS
      tags: [
        { name: "type", value: "24h_followup" },
        { name: "quote_ref", value: quote.reference_number }
      ]
    });
    if (error) {
      console.error(`${tag} Resend error:`, error);
      await logEmail(supabase, quote.id, "24h_followup", quote.email, null, "failed", error.message);
      return { success: false, error: error.message };
    }
    await supabase.from("quote_requests").update({
      follow_up_24h_sent: true,
      last_email_sent_at: timestamp()
    }).eq("id", quote.id);
    await logEmail(supabase, quote.id, "24h_followup", quote.email, data?.id || null, "sent");
    console.log(`${tag} ✅ Sent successfully (Resend ID: ${data?.id})`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`${tag} ❌ Exception:`, message);
    await logEmail(supabase, quote.id, "24h_followup", quote.email, null, "failed", message);
    return { success: false, error: message };
  }
}
async function send48HourAdminReminder(quote, resend, supabase) {
  const tag = `[FollowUp][48h-admin][${quote.reference_number}]`;
  console.log(`${tag} Sending admin reminder...`);
  try {
    const { subject, html } = await generateAdminReminderEmail(quote);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [ADMIN_EMAIL],
      subject,
      html,
      replyTo: "info@revestitching.com",
      // ← ADD THIS
      tags: [
        { name: "type", value: "48h_admin_reminder" },
        { name: "quote_ref", value: quote.reference_number }
      ]
    });
    if (error) {
      console.error(`${tag} Resend error:`, error);
      await logEmail(supabase, quote.id, "48h_admin", ADMIN_EMAIL, null, "failed", error.message);
      return { success: false, error: error.message };
    }
    await logEmail(supabase, quote.id, "48h_admin", ADMIN_EMAIL, data?.id || null, "sent");
    const discordPayload = buildAdminReminderDiscordPayload(quote);
    sendDiscordWebhook(discordPayload).catch(() => {
    });
    await supabase.from("quote_requests").update({
      admin_reminder_sent: true,
      last_email_sent_at: timestamp()
    }).eq("id", quote.id);
    console.log(`${tag} ✅ Admin reminder sent (Resend ID: ${data?.id})`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`${tag} ❌ Exception:`, message);
    await logEmail(supabase, quote.id, "48h_admin", ADMIN_EMAIL, null, "failed", message);
    return { success: false, error: message };
  }
}
async function send7DayReengagement(quote, resend, supabase) {
  const tag = `[FollowUp][7d][${quote.reference_number}]`;
  console.log(`${tag} Sending re-engagement to ${quote.email}...`);
  try {
    const { subject, html } = await generateReengagementEmail(quote);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [quote.email],
      subject,
      html,
      replyTo: "info@revestitching.com",
      // ← ADD THIS
      tags: [
        { name: "type", value: "7d_reengagement" },
        { name: "quote_ref", value: quote.reference_number }
      ]
    });
    if (error) {
      console.error(`${tag} Resend error:`, error);
      await logEmail(supabase, quote.id, "7d_reengagement", quote.email, null, "failed", error.message);
      return { success: false, error: error.message };
    }
    await supabase.from("quote_requests").update({
      reengagement_sent: true,
      last_email_sent_at: timestamp()
    }).eq("id", quote.id);
    await logEmail(supabase, quote.id, "7d_reengagement", quote.email, data?.id || null, "sent");
    console.log(`${tag} ✅ Sent successfully (Resend ID: ${data?.id})`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`${tag} ❌ Exception:`, message);
    await logEmail(supabase, quote.id, "7d_reengagement", quote.email, null, "failed", message);
    return { success: false, error: message };
  }
}
async function checkAndSendFollowUps(supabase) {
  const startTime = Date.now();
  console.log(`
${"═".repeat(60)}`);
  console.log(`[FollowUp] Starting follow-up check at ${timestamp()}`);
  console.log(`${"═".repeat(60)}`);
  const result = {
    quotesProcessed: 0,
    emailsSent: 0,
    errors: 0,
    details: []
  };
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[FollowUp] ❌ RESEND_API_KEY not configured");
    return result;
  }
  const resend = new Resend(resendApiKey);
  const { data: quotes, error: queryError } = await supabase.from("quote_requests").select("*").eq("status", "new").or(
    "follow_up_24h_sent.eq.false,admin_reminder_sent.eq.false,reengagement_sent.eq.false"
  ).order("created_at", { ascending: true }).limit(10);
  if (queryError) {
    console.error("[FollowUp] ❌ Database query error:", queryError);
    return result;
  }
  if (!quotes || quotes.length === 0) {
    console.log("[FollowUp] No pending follow-ups found. All clear. ✨");
    return result;
  }
  console.log(`[FollowUp] Found ${quotes.length} quote(s) to check`);
  let emailCount = 0;
  for (const quote of quotes) {
    if (emailCount >= MAX_EMAILS_PER_RUN) {
      console.log(`[FollowUp] Rate limit reached (${MAX_EMAILS_PER_RUN} emails). Stopping.`);
      break;
    }
    const hours = hoursSince(quote.created_at);
    result.quotesProcessed++;
    if (quote.automation_paused) {
      console.log(`[FollowUp] Skipping ${quote.reference_number} (automation paused)`);
      continue;
    }
    if (quote.status !== "new") {
      console.log(`[FollowUp] Skipping ${quote.reference_number} (status = ${quote.status})`);
      continue;
    }
    const lastActionHours = hoursSinceOptional(quote.last_admin_action_at);
    if (lastActionHours !== null && lastActionHours < ADMIN_ACTION_SUPPRESS_HOURS) {
      console.log(
        `[FollowUp] Skipping ${quote.reference_number} (admin action ${lastActionHours.toFixed(1)}h ago)`
      );
      continue;
    }
    console.log(
      `
[FollowUp] Processing ${quote.reference_number} (${hours.toFixed(1)}h old, status: ${quote.status})`
    );
    if (hours >= THRESHOLD_24H && !quote.follow_up_24h_sent) {
      const res = await send24HourFollowUp(quote, resend, supabase);
      result.details.push({
        reference: quote.reference_number,
        type: "24h_followup",
        success: res.success,
        error: res.error
      });
      if (res.success) {
        result.emailsSent++;
        emailCount++;
      } else {
        result.errors++;
      }
      await delay(500);
    }
    if (hours >= THRESHOLD_48H && !quote.admin_reminder_sent) {
      const res = await send48HourAdminReminder(quote, resend, supabase);
      result.details.push({
        reference: quote.reference_number,
        type: "48h_admin",
        success: res.success,
        error: res.error
      });
      if (res.success) {
        result.emailsSent++;
        emailCount++;
      } else {
        result.errors++;
      }
      await delay(500);
    }
    if (hours >= THRESHOLD_7D && !quote.reengagement_sent) {
      const res = await send7DayReengagement(quote, resend, supabase);
      result.details.push({
        reference: quote.reference_number,
        type: "7d_reengagement",
        success: res.success,
        error: res.error
      });
      if (res.success) {
        result.emailsSent++;
        emailCount++;
      } else {
        result.errors++;
      }
      await delay(500);
    }
  }
  const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
  console.log(`
${"─".repeat(60)}`);
  console.log(`[FollowUp] Complete in ${elapsed}s`);
  console.log(`[FollowUp] Processed: ${result.quotesProcessed} quotes`);
  console.log(`[FollowUp] Sent: ${result.emailsSent} emails`);
  console.log(`[FollowUp] Errors: ${result.errors}`);
  console.log(`${"═".repeat(60)}
`);
  return result;
}

export { checkAndSendFollowUps as c };
