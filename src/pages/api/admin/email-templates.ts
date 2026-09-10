// src/pages/api/admin/email-templates.ts

import type { APIRoute } from 'astro';
import { getAdminFromCookies } from '../../../lib/auth';
import { getTemplateSettings, saveTemplateSettings, getDefaultSettings } from '../../../lib/email-templates/template-storage';
import { clearTemplateCache } from '../../../lib/email-templates/_layout';
import { json } from '../../../lib/utils';
import { isSameOriginRequest } from '../../../lib/admin-operations';
import { z } from 'zod';

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
  if (!isSameOriginRequest(request)) return json({ error: 'Cross-site request rejected' }, 403);

  try {
    const body = await request.json();
    const parsed = z.object({
      company_name: z.string().trim().min(1).max(120).optional(),
      tagline: z.string().trim().max(240).optional(),
      logo_text: z.string().trim().min(1).max(12).optional(),
      brand_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      whatsapp_number: z.string().trim().regex(/^\+?[0-9 ()-]{7,30}$/).optional(),
      support_email: z.string().trim().email().max(254).optional(),
      website_url: z.string().trim().url().max(500).optional(),
      footer_text: z.string().trim().max(1_000).optional(),
    }).strict().safeParse(body);
    if (!parsed.success) return json({ error: 'Invalid template settings' }, 422);
    const updates = parsed.data;

    if (Object.keys(updates).length === 0) {
      return json({ error: 'No valid fields to update' }, 400);
    }

    const result = await saveTemplateSettings(updates);
    
    if (result.success) {
      // Clear cache so new emails use updated settings
      clearTemplateCache();
      console.log(`[Admin] Email template updated by ${admin.sub}`);
    }

    if (!result.success) {
      return json({ error: 'Failed to save settings' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('[API] Save template error:', err);
    return json({ error: 'Failed to save settings' }, 500);
  }
};

// DELETE - Reset to defaults
export const DELETE: APIRoute = async ({ cookies, request }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!isSameOriginRequest(request)) return json({ error: 'Cross-site request rejected' }, 403);

  try {
    const defaults = getDefaultSettings();
    const result = await saveTemplateSettings(defaults);
    if (!result.success) {
      return json({ error: 'Failed to reset settings' }, 500);
    }

    clearTemplateCache();
    console.log(`[Admin] Email template reset to defaults by ${admin.sub}`);
    return json({ success: true, settings: defaults });
  } catch (err) {
    return json({ error: 'Failed to reset settings' }, 500);
  }
};
