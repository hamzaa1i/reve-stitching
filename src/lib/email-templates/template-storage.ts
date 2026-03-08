// src/lib/email-templates/template-storage.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface EmailTemplateSettings {
  id: string;
  company_name: string;
  tagline: string;
  logo_text: string;
  brand_color: string;
  whatsapp_number: string;
  support_email: string;
  website_url: string;
  footer_text: string;
  updated_at: string;
}

const DEFAULT_SETTINGS: Omit<EmailTemplateSettings, 'id' | 'updated_at'> = {
  company_name: 'Reve Stitching',
  tagline: 'Premium Garment Manufacturing',
  logo_text: 'R',
  brand_color: '#166534',
  whatsapp_number: '+92 332 9555786',
  support_email: 'info@revestitching.com',
  website_url: 'https://revestitching.com',
  footer_text: `Reve Stitching (Pvt.) Ltd.
100% Export-Oriented Knitted Garment Manufacturer
Faisalabad, Pakistan`,
};

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getTemplateSettings(): Promise<EmailTemplateSettings> {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('email_template_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.warn('[Template] No settings found, using defaults');
    return {
      id: 'default',
      ...DEFAULT_SETTINGS,
      updated_at: new Date().toISOString(),
    };
  }

  return data as EmailTemplateSettings;
}

export async function saveTemplateSettings(
  settings: Partial<Omit<EmailTemplateSettings, 'id' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  // Get existing row
  const { data: existing } = await supabase
    .from('email_template_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('email_template_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      console.error('[Template] Save failed:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('email_template_settings')
      .insert({
        ...DEFAULT_SETTINGS,
        ...settings,
      });

    if (error) {
      console.error('[Template] Insert failed:', error);
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export function getDefaultSettings(): typeof DEFAULT_SETTINGS {
  return { ...DEFAULT_SETTINGS };
}