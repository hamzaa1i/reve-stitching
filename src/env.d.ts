/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    admin?: {
      sub: string;
      iat: number;
      exp: number;
    };
  }
}