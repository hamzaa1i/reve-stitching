import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { aW as maybeRenderHead, a5 as addAttribute, b8 as renderTemplate } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$Layout } from './Layout_Bm9rNR0d.mjs';
import 'clsx';
import { r as renderScript } from './script_CN3n2meJ.mjs';

const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ProductCard;
  const { name, image, rating, moq, features, index = 0 } = Astro2.props;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const isUnsplash = image.includes("unsplash.com");
  return renderTemplate`${maybeRenderHead()}<article class="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-600/8 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-green-400/5" data-tilt> <!-- Image --> <div class="relative aspect-[4/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800"> <!-- Skeleton shimmer (hidden once image loads) --> <div class="absolute inset-0 animate-pulse bg-zinc-300/50 dark:bg-zinc-700/50" data-skeleton aria-hidden="true"></div> <img${addAttribute(image, "src")}${addAttribute(name, "alt")}${addAttribute(index < 4 ? "eager" : "lazy", "loading")} decoding="async"${addAttribute(isUnsplash ? `${image}&w=400 400w, ${image}&w=600 600w, ${image}&w=800 800w` : void 0, "srcset")}${addAttribute(isUnsplash ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" : void 0, "sizes")} class="relative z-[1] h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105" onload="this.style.opacity='1';var s=this.parentElement.querySelector('[data-skeleton]');if(s)s.style.display='none'"> <!-- MOQ Badge --> <div class="absolute left-4 top-4 z-[2] rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-green-600 backdrop-blur-sm dark:bg-zinc-900/90 dark:text-green-400">
MOQ: ${moq} pcs
</div> <!-- Hover Overlay --> <div class="absolute inset-0 z-[3] flex items-end bg-gradient-to-t from-green-700/80 via-green-700/20 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"> <a href="/contact/" class="w-full rounded-lg bg-white py-3 text-center text-sm font-semibold text-green-600 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-green-400 dark:hover:bg-zinc-800">
Inquire Now
</a> </div> </div> <!-- Content --> <div class="p-6"> <!-- Rating --> <div class="mb-3 flex items-center gap-1.5"> <div class="flex items-center gap-0.5"> ${Array.from({ length: 5 }).map((_, i) => renderTemplate`<svg${addAttribute(`h-4 w-4 ${i < fullStars ? "text-amber-400" : i === fullStars && hasHalf ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`, "class")} viewBox="0 0 20 20" fill="currentColor"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">${rating}</span> </div> <!-- Name --> <h3 class="mb-3 text-lg font-bold leading-snug text-zinc-900 transition-colors duration-300 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400"> ${name} </h3> <!-- Features --> <ul class="space-y-1.5"> ${features.map((feature) => renderTemplate`<li class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"> <svg class="h-4 w-4 shrink-0 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path> </svg> ${feature} </li>`)} </ul> </div> </article>`;
}, "/home/hamzaa1i/reve-stitching/src/components/ProductCard.astro", void 0);

const USD_TO_GBP_RATE = 0.79;
const CURRENCY_CONFIG = {
  USD: {
    symbol: "$",
    code: "USD",
    locale: "en-US",
    name: "US Dollar",
    flag: "🇺🇸"
  },
  GBP: {
    symbol: "£",
    code: "GBP",
    locale: "en-GB",
    name: "British Pound",
    flag: "🇬🇧"
  }
};
const BASE_PRICES = {
  tshirts: { min: 3.5, max: 8 },
  polos: { min: 5, max: 12 },
  hoodies: { min: 8, max: 18 },
  joggers: { min: 6, max: 15 },
  sweatshirts: { min: 7, max: 16 },
  ladies: { min: 4, max: 14 },
  kids: { min: 3, max: 10 }
};
const PRODUCT_LABELS = {
  tshirts: "Premium Cotton T-Shirts",
  polos: "Corporate Polo Shirts",
  hoodies: "Premium Hoodies",
  joggers: "Athletic Joggers",
  sweatshirts: "Sweatshirts Collection",
  ladies: "Ladies' Wear",
  kids: "Kids' Wear"
};
const FABRIC_MULTIPLIERS = {
  single_jersey: 1,
  double_jersey: 1.15,
  terry_fleece: 1.3,
  pique: 1.1,
  interlock: 1.15,
  lycra_rib: 1.2
};
const FABRIC_LABELS = {
  single_jersey: "Single Jersey (120–200 GSM)",
  double_jersey: "Double Jersey (180–300 GSM)",
  terry_fleece: "Terry Fleece (240–400 GSM)",
  pique: "Pique Cotton",
  interlock: "Interlock",
  lycra_rib: "Lycra Rib"
};
const QUANTITY_TIERS = [
  { min: 100, max: 249, multiplier: 1.5, label: "Small Batch" },
  { min: 250, max: 499, multiplier: 1.25, label: "Starter" },
  { min: 500, max: 999, multiplier: 1.1, label: "Standard" },
  { min: 1e3, max: 2499, multiplier: 1, label: "Optimal" },
  { min: 2500, max: 4999, multiplier: 0.93, label: "Volume Discount" },
  { min: 5e3, max: Infinity, multiplier: 0.87, label: "High Volume" }
];
const CUSTOMIZATION_COSTS = {
  screen_print: { min: 0.5, max: 1.5 },
  embroidery: { min: 1.5, max: 3.5 },
  dtg: { min: 2, max: 4 },
  custom_labels: { min: 0.3, max: 0.8 }
};
const CUSTOMIZATION_LABELS = {
  screen_print: "Screen Printing",
  embroidery: "Embroidery",
  dtg: "DTG Printing",
  custom_labels: "Custom Labels"
};

const $$PriceCalculator = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PriceCalculator;
  const { defaultProduct, compact = false } = Astro2.props;
  const productsJson = JSON.stringify(
    Object.entries(PRODUCT_LABELS).map(([key, label]) => ({
      key,
      label,
      base: BASE_PRICES[key]
    }))
  );
  const fabricsJson = JSON.stringify(
    Object.entries(FABRIC_LABELS).map(([key, label]) => ({
      key,
      label,
      multiplier: FABRIC_MULTIPLIERS[key]
    }))
  );
  const customizationsJson = JSON.stringify(
    Object.entries(CUSTOMIZATION_LABELS).map(([key, label]) => ({
      key,
      label,
      cost: CUSTOMIZATION_COSTS[key]
    }))
  );
  const tiersJson = JSON.stringify(QUANTITY_TIERS);
  const currencyConfigJson = JSON.stringify(CURRENCY_CONFIG);
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "price-calculator overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
    compact && "price-calculator--compact"
  ], "class:list")} id="price-calculator"${addAttribute(productsJson, "data-products")}${addAttribute(fabricsJson, "data-fabrics")}${addAttribute(customizationsJson, "data-customizations")}${addAttribute(tiersJson, "data-tiers")}${addAttribute(currencyConfigJson, "data-currency-config")}${addAttribute(USD_TO_GBP_RATE, "data-exchange-rate")}${addAttribute(defaultProduct || "tshirts", "data-default-product")} data-astro-cid-qwf4iyfs> <!-- ━━━ HEADER ━━━ --> <div class="border-b border-zinc-100 px-6 pb-4 pt-6 dark:border-zinc-800 sm:px-8 sm:pt-8" data-astro-cid-qwf4iyfs> <div class="flex items-center justify-between" data-astro-cid-qwf4iyfs> <div class="flex items-center gap-3" data-astro-cid-qwf4iyfs> <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/10 dark:bg-green-500/10" data-astro-cid-qwf4iyfs> <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-astro-cid-qwf4iyfs> <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" data-astro-cid-qwf4iyfs></path> </svg> </div> <div data-astro-cid-qwf4iyfs> <h3 class="text-lg font-bold text-zinc-900 dark:text-white" data-astro-cid-qwf4iyfs>Instant Price Estimate</h3> <p class="text-sm text-zinc-500 dark:text-zinc-400" data-astro-cid-qwf4iyfs>Get a rough quote in seconds</p> </div> </div> <div class="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800" id="currency-toggle" data-astro-cid-qwf4iyfs> <button type="button" class="currency-btn currency-btn--active" data-currency="USD" title="US Dollars" data-astro-cid-qwf4iyfs> <span class="currency-flag" data-astro-cid-qwf4iyfs>🇺🇸</span><span class="currency-code" data-astro-cid-qwf4iyfs>USD</span> </button> <button type="button" class="currency-btn" data-currency="GBP" title="British Pounds" data-astro-cid-qwf4iyfs> <span class="currency-flag" data-astro-cid-qwf4iyfs>🇬🇧</span><span class="currency-code" data-astro-cid-qwf4iyfs>GBP</span> </button> </div> </div> </div> <!-- ━━━ FORM ━━━ --> <div class="space-y-5 px-6 py-6 sm:px-8" data-astro-cid-qwf4iyfs> <div class="calc-field" data-astro-cid-qwf4iyfs> <label for="calc-product" class="calc-label" data-astro-cid-qwf4iyfs>Product Type</label> <div class="relative" data-astro-cid-qwf4iyfs> <select id="calc-product" class="calc-select" data-astro-cid-qwf4iyfs> ${Object.entries(PRODUCT_LABELS).map(([key, label]) => renderTemplate`<option${addAttribute(key, "value")}${addAttribute(key === (defaultProduct || "tshirts"), "selected")} data-astro-cid-qwf4iyfs>${label}</option>`)} </select> <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" data-astro-cid-qwf4iyfs> <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-qwf4iyfs><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" data-astro-cid-qwf4iyfs></path></svg> </div> </div> </div> <div class="calc-field" data-astro-cid-qwf4iyfs> <label for="calc-quantity" class="calc-label" data-astro-cid-qwf4iyfs>Quantity</label> <div class="relative" data-astro-cid-qwf4iyfs> <input type="number" id="calc-quantity" min="100" max="100000" step="50" value="1000" class="calc-input pr-12" inputmode="numeric" data-astro-cid-qwf4iyfs> <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>pcs</span> </div> <div class="mt-2.5 flex flex-wrap gap-2" data-astro-cid-qwf4iyfs> ${[250, 500, 1e3, 2500, 5e3].map((qty) => renderTemplate`<button type="button"${addAttribute(["calc-quick-qty", qty === 1e3 && "calc-quick-qty--active"], "class:list")}${addAttribute(qty, "data-qty")} data-astro-cid-qwf4iyfs> ${qty >= 1e3 ? `${qty / 1e3}k` : qty} </button>`)} </div> </div> <div class="calc-field" data-astro-cid-qwf4iyfs> <label for="calc-fabric" class="calc-label" data-astro-cid-qwf4iyfs>Fabric <span class="ml-1 font-normal text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>(optional)</span></label> <div class="relative" data-astro-cid-qwf4iyfs> <select id="calc-fabric" class="calc-select" data-astro-cid-qwf4iyfs> <option value="" data-astro-cid-qwf4iyfs>— Select fabric —</option> ${Object.entries(FABRIC_LABELS).map(([key, label]) => renderTemplate`<option${addAttribute(key, "value")} data-astro-cid-qwf4iyfs>${label}</option>`)} </select> <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" data-astro-cid-qwf4iyfs> <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-qwf4iyfs><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" data-astro-cid-qwf4iyfs></path></svg> </div> </div> </div> <div class="calc-field" data-astro-cid-qwf4iyfs> <span class="calc-label" data-astro-cid-qwf4iyfs>Customizations</span> <div class="mt-1 grid grid-cols-2 gap-x-4 gap-y-2.5" data-astro-cid-qwf4iyfs> ${Object.entries(CUSTOMIZATION_LABELS).map(([key, label]) => renderTemplate`<label class="calc-checkbox-label"${addAttribute(`calc-custom-${key}`, "for")} data-astro-cid-qwf4iyfs> <input type="checkbox"${addAttribute(`calc-custom-${key}`, "id")}${addAttribute(key, "value")} class="calc-checkbox"${addAttribute(key, "data-customization")} data-astro-cid-qwf4iyfs> <span data-astro-cid-qwf4iyfs>${label}</span> </label>`)} </div> </div> </div> <!-- ━━━ RESULTS ━━━ --> <div class="px-6 pb-6 sm:px-8 sm:pb-8" id="calc-results" data-astro-cid-qwf4iyfs> <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800 sm:p-6" data-astro-cid-qwf4iyfs> <div class="mb-4 flex items-start justify-between gap-4" data-astro-cid-qwf4iyfs> <div data-astro-cid-qwf4iyfs> <div class="mb-1 flex items-center gap-2" data-astro-cid-qwf4iyfs> <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-astro-cid-qwf4iyfs><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" data-astro-cid-qwf4iyfs></path></svg> <span class="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400" data-astro-cid-qwf4iyfs>Estimated Total</span> </div> <div class="flex items-baseline gap-1.5" data-astro-cid-qwf4iyfs> <span class="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl" id="calc-total-min" data-astro-cid-qwf4iyfs>$3,500</span> <span class="text-lg text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>–</span> <span class="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl" id="calc-total-max" data-astro-cid-qwf4iyfs>$8,000</span> </div> </div> <div id="calc-savings-badge" class="hidden flex-shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 dark:border-emerald-500/30 dark:bg-emerald-500/10" data-astro-cid-qwf4iyfs> <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400" id="calc-savings-text" data-astro-cid-qwf4iyfs>Save 13%</span> </div> </div> <div class="mb-5 grid grid-cols-3 gap-3" data-astro-cid-qwf4iyfs> <div class="rounded-lg border border-zinc-100 bg-white p-2.5 text-center dark:border-zinc-700 dark:bg-zinc-900" data-astro-cid-qwf4iyfs> <div class="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>Per Unit</div> <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200" id="calc-per-unit" data-astro-cid-qwf4iyfs>$3.50 – $8.00</div> </div> <div class="rounded-lg border border-zinc-100 bg-white p-2.5 text-center dark:border-zinc-700 dark:bg-zinc-900" data-astro-cid-qwf4iyfs> <div class="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>Lead Time</div> <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200" id="calc-lead-time" data-astro-cid-qwf4iyfs>30–35 days</div> </div> <div class="rounded-lg border border-zinc-100 bg-white p-2.5 text-center dark:border-zinc-700 dark:bg-zinc-900" data-astro-cid-qwf4iyfs> <div class="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs>Tier</div> <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200" id="calc-tier-label" data-astro-cid-qwf4iyfs>Optimal</div> </div> </div> <p class="mb-5 flex items-start gap-1.5 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500" data-astro-cid-qwf4iyfs> <svg class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-300 dark:text-zinc-600" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-qwf4iyfs><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" data-astro-cid-qwf4iyfs></path></svg> <span data-astro-cid-qwf4iyfs>Final pricing depends on exact specifications, artwork complexity, and shipping destination. Request a detailed quote for an accurate figure.</span> </p> <a id="calc-cta" href="/quote?product=tshirts&quantity=1000" class="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md dark:bg-green-500 dark:text-zinc-950 dark:hover:bg-green-400" data-astro-cid-qwf4iyfs> <span data-astro-cid-qwf4iyfs>Get Detailed Quote</span> <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" data-astro-cid-qwf4iyfs><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" data-astro-cid-qwf4iyfs></path></svg> </a> </div> </div> </div>  ${renderScript($$result, "/home/hamzaa1i/reve-stitching/src/components/PriceCalculator.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hamzaa1i/reve-stitching/src/components/PriceCalculator.astro", void 0);

const $$Products = createComponent(($$result, $$props, $$slots) => {
  const products = [
    {
      name: "Premium Cotton T-Shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.9,
      moq: 500,
      features: ["100% Combed Cotton", "SGS Quality Certified", "Pre-Shrunk Fabric", "Custom Prints & Colors"]
    },
    {
      name: "Corporate Polo Shirts",
      image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.8,
      moq: 300,
      features: ["Pique Cotton Construction", "Moisture Management", "Reinforced Collars", "Custom Embroidery"]
    },
    {
      name: "Premium Hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.9,
      moq: 250,
      features: ["Terry Fleece / Heavy Jersey", "YKK Zippers Available", "Brushed Interior Finish", "Screen Print & Embroidery"]
    },
    {
      name: "Athletic Joggers",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.7,
      moq: 400,
      features: ["Moisture Management Fabric", "Cotton-Polyester Blend", "Elastic Cuffs & Waistband", "Zippered Pockets Option"]
    },
    {
      name: "Sweatshirts Collection",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.8,
      moq: 350,
      features: ["Double Jersey Options", "Fleece & French Terry", "Crew & Half-Zip Styles", "Custom Dye Options"]
    },
    {
      name: "Ladies' Wear Collection",
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.9,
      moq: 300,
      features: ["Modal Blends Available", "Lycra Rib Options", "Delicate Finishing", "Trend-Forward Designs"]
    },
    {
      name: "Kids' Wear Range",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.8,
      moq: 500,
      features: ["100% Skin-Friendly Cotton", "Certified Safe Dyes", "Reinforced Stitching", "Fun Prints & Patterns"]
    },
    {
      name: "Specialized Fabric Garments",
      image: "https://images.unsplash.com/photo-1769867414844-d77ccb5b5543?auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4.7,
      moq: 200,
      features: ["Lurex Mixed Fabrics", "Burnout Printed Options", "Performance Blends", "Custom Development"]
    }
  ];
  const fabrics = [
    { name: "Single Jersey", desc: "Lightweight, breathable knit perfect for t-shirts and casual wear. Smooth face, soft hand feel.", weight: "120–200 GSM" },
    { name: "Double Jersey", desc: "Thicker, more structured knit ideal for polos and upscale casual garments. Excellent dimensional stability.", weight: "180–300 GSM" },
    { name: "Terry Fleece", desc: "Soft looped interior for warmth — hoodies, sweatshirts, and loungewear. Brushed or unbrushed options.", weight: "240–400 GSM" },
    { name: "Lycra Rib", desc: "Stretchy, form-fitting fabric for activewear, trims, and ladies' wear. Outstanding recovery and comfort.", weight: "170–280 GSM" },
    { name: "Interlock", desc: "Smooth double-knit structure with excellent drape and stability. Ideal for premium basics.", weight: "160–280 GSM" },
    { name: "Moisture Management", desc: "High-performance wicking fabric for sportswear and athletic lines. Rapid dry technology.", weight: "140–220 GSM" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Our Products", "description": "Explore Reve Stitching's range of premium knitted garments — T-Shirts, Polos, Hoodies, Joggers, Ladies' Wear, Kids' Wear, and specialized fabric garments." }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative bg-zinc-50 py-28 dark:bg-zinc-950 lg:py-36" aria-label="Products hero"> <div class="pointer-events-none absolute inset-0 dark:hidden" aria-hidden="true" style="background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);background-size:72px 72px"></div> <div class="pointer-events-none absolute inset-0 hidden dark:block" aria-hidden="true" style="background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:72px 72px"></div> <div class="relative z-10 mx-auto max-w-[90rem] px-6 text-center sm:px-8 lg:px-12 xl:px-16"> <div class="mb-6 flex items-center justify-center gap-3" data-animate="fade-up"> <span class="block h-px w-8 bg-green-600 dark:bg-green-400" aria-hidden="true"></span> <span class="text-[11px] font-semibold uppercase tracking-[0.3em] text-green-600 dark:text-green-400">Our Products</span> <span class="block h-px w-8 bg-green-600 dark:bg-green-400" aria-hidden="true"></span> </div> <h1 class="font-serif text-3xl font-bold text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl" data-animate="fade-up" data-delay="0.08">
Premium Knitted <span class="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">Garments</span> </h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400" data-animate="fade-up" data-delay="0.16">
From classic cotton tees to specialized performance wear, we manufacture a diverse range of knitted garments with precision and care.
</p> </div> </section>  <section class="bg-white py-24 dark:bg-zinc-950 lg:py-32" aria-label="Price calculator" id="calculate"> <div class="mx-auto max-w-[90rem] px-6 sm:px-8 lg:px-12 xl:px-16"> <div class="mx-auto max-w-3xl"> <div class="mb-10 text-center"> <h2 class="text-2xl font-bold text-zinc-900 dark:text-white" data-animate="fade-up">
Calculate Your Order Cost
</h2> <p class="mx-auto mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400" data-animate="fade-up" data-delay="0.1">
Select a product below, adjust quantity and options to see instant pricing estimates for your bulk order.
</p> </div> <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-lg shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-8" data-animate="fade-up" data-delay="0.15"> ${renderComponent($$result2, "PriceCalculator", $$PriceCalculator, {})} </div> </div> </div> </section>  <section class="bg-zinc-50 py-28 dark:bg-zinc-900 lg:py-36" aria-labelledby="products-heading"> <div class="mx-auto max-w-[90rem] px-6 sm:px-8 lg:px-12 xl:px-16"> <div class="mb-16 text-center"> <span class="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-green-600 dark:text-green-400" data-animate="fade-up">Product Range</span> <h2 id="products-heading" class="font-serif text-2xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl" data-animate="fade-up" data-delay="0.08">
What We <span class="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">Manufacture</span> </h2> <p class="mx-auto mt-4 max-w-xl text-base text-zinc-500 dark:text-zinc-400" data-animate="fade-up" data-delay="0.16">
Eight core product categories, each customizable to your brand specifications.
</p> </div> <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> ${products.map((product, i) => renderTemplate`<div data-animate="fade-up"${addAttribute(String(i * 0.06), "data-delay")}> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "name": product.name, "image": product.image, "rating": product.rating, "moq": product.moq, "features": product.features, "index": i })} </div>`)} </div> </div> </section>  <section class="bg-white py-28 dark:bg-zinc-950 lg:py-36" aria-labelledby="fabrics-heading"> <div class="mx-auto max-w-[90rem] px-6 sm:px-8 lg:px-12 xl:px-16"> <div class="mb-16 text-center"> <span class="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-green-600 dark:text-green-400" data-animate="fade-up">Fabric Portfolio</span> <h2 id="fabrics-heading" class="font-serif text-2xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl" data-animate="fade-up" data-delay="0.08">
Our <span class="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">Fabric</span> Range
</h2> <p class="mx-auto mt-4 max-w-xl text-base text-zinc-500 dark:text-zinc-400" data-animate="fade-up" data-delay="0.16">
We work with a diverse range of high-quality knitted fabrics to meet every requirement.
</p> </div> <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"> ${fabrics.map((fabric, i) => renderTemplate`<article class="group rounded-2xl border border-zinc-200 bg-zinc-50 p-8 transition-all duration-500 hover:border-green-500/20 hover:shadow-lg hover:shadow-green-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-400/20" data-animate="fade-up" data-delay="0" data-tilt> <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-600 dark:group-hover:bg-green-500"> <svg class="h-7 w-7 text-green-600 transition-colors group-hover:text-white dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"> <path d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.43 14.25m11.142 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25"></path> </svg> </div> <h3 class="text-lg font-bold text-zinc-900 dark:text-white">${fabric.name}</h3> <p class="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">${fabric.desc}</p> <span class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400"> <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> ${fabric.weight} </span> </article>`)} </div> </div> </section>  <section class="relative bg-zinc-900 py-24 dark:bg-zinc-950 lg:py-32" aria-label="Call to action"> <div class="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" style="background-image:radial-gradient(circle at 1px 1px, white 1px, transparent 0);background-size:40px 40px"></div> <div class="relative z-10 mx-auto max-w-[90rem] px-6 sm:px-8 lg:px-12 xl:px-16"> <div class="flex flex-col items-center justify-between gap-8 lg:flex-row"> <div> <h2 class="font-serif text-2xl font-bold text-white sm:text-3xl" data-animate="fade-up">Need Custom Specifications?</h2> <p class="mt-2 text-zinc-400" data-animate="fade-up" data-delay="0.1">Send us your tech pack — we'll provide a detailed quote within 24 hours.</p> </div> <a href="/quote/" class="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-950 shadow-lg transition-all hover:bg-green-400" data-magnetic data-animate="fade-up" data-delay="0.15">
Request a Quote
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg> </a> </div> </div> </section> ` })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/products.astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/products.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Products,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
