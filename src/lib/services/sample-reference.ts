// src/lib/services/sample-reference.ts

export function generateSampleReference(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SR-${dateStr}-${random}`;
  }