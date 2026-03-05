// src/lib/services/reference.ts

import { getSupabase } from '../supabase';

/**
 * Generates a unique reference number in format: RQ-YYYYMMDD-XXXX
 * Checks database for collisions and retries up to 5 times.
 */
export async function generateReferenceNumber(): Promise<string> {
  const supabase = getSupabase();
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const now = new Date();
    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('');

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O, 1/I
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }

    const ref = `RQ-${datePart}-${rand}`;

    // check uniqueness
    const { count } = await supabase
      .from('quote_requests')
      .select('id', { count: 'exact', head: true })
      .eq('reference_number', ref);

    if (count === 0) return ref;
  }

  // fallback: use timestamp for guaranteed uniqueness
  return `RQ-${Date.now()}`;
}