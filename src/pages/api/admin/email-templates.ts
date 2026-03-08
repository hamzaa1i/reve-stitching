// src/pages/api/admin/email-templates.ts

import type { APIRoute } from 'astro';
import { getAdminFromCookies } from '../../../lib/auth';
import { getTemplateSettings, saveTemplateSettings, getDefaultSettings } from '../../../lib/email-templates/template-storage';
import { clearTemplateCache } from '../../../lib/email-templates/_layout';

export const prerender = false;

// GET - Fetch current settings
export const GET: APIRoute = async ({ cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const settings = await getTemplateSettings();
    return json({ success: true, settings });
  } catch (err) {
    return json({ error: 'Failed to load settings' }, 500);
  }
};

// POST - Save settings
export const POST: APIRoute = async ({ request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const allowedFields = [
      'company_name', 'tagline', 'logo_text', 'brand_color',
      'whatsapp_number', 'support_email', 'website_url', 'footer_text'
    ];
    
    const updates: Record<string, string> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = String(body[field]).trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return json({ error: 'No valid fields to update' }, 400);
    }

    const result = await saveTemplateSettings(updates);
    
    if (result.success) {
      // Clear cache so new emails use updated settings
      clearTemplateCache();
      console.log(`[Admin] Email template updated by ${admin.sub}`);
    }

    return json(result);
  } catch (err) {
    console.error('[API] Save template error:', err);
    return json({ error: 'Failed to save settings' }, 500);
  }
};

// DELETE - Reset to defaults
export const DELETE: APIRoute = async ({ cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const defaults = getDefaultSettings();
    const result = await saveTemplateSettings(defaults);
    
    if (result.success) {
      clearTemplateCache();
      console.log(`[Admin] Email template reset to defaults by ${admin.sub}`);
    }

    return json({ success: true, settings: defaults });
  } catch (err) {
    return json({ error: 'Failed to reset settings' }, 500);
  }
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}