// src/lib/services/storage.ts

import { getSupabase } from '../supabase';

const BUCKET = 'quote-uploads';

/**
 * Uploads a single file to Supabase Storage and returns the storage path.
 */
export async function uploadFile(
  referenceNumber: string,
  folder: string,
  file: File
): Promise<string | null> {
  const supabase = getSupabase();

  // sanitize filename
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');

  const timestamp = Date.now();
  const path = `${referenceNumber}/${folder}/${timestamp}_${safeName}`;

  try {
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error(`[Storage] Upload failed for ${safeName}:`, error.message);
      return null;
    }

    console.log(`[Storage] Uploaded: ${data.path}`);
    return data.path;
  } catch (err) {
    console.error(`[Storage] Exception uploading ${safeName}:`, err);
    return null;
  }
}

/**
 * Creates a signed download URL for a storage path (valid for 1 hour).
 */
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error(`[Storage] Signed URL failed for ${path}:`, error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Uploads multiple files and returns an array of storage paths.
 */
export async function uploadMultipleFiles(
  referenceNumber: string,
  folder: string,
  files: File[]
): Promise<string[]> {
  const paths: string[] = [];

  for (const file of files) {
    if (file.size === 0) continue;
    const path = await uploadFile(referenceNumber, folder, file);
    if (path) paths.push(path);
  }

  return paths;
}