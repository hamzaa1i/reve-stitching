/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      name: string;
      company: string | null;
      role: string;
      status: string;
      avatarUrl?: string | null;
    };
    admin?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}
