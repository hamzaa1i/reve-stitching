/**
 * src/scripts/animations.js
 * Premium Animation Engine — Phase 1: Stripped for B2B Performance
 *
 * Removed: Particles, Custom Cursor, Click Ripples, Spotlight, Grain, Section Snap
 * Kept: Smooth scroll, Reveals, Counters, Magnetic CTAs, Parallax, Tilt (selective)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════ */
const CONFIG = {
  scroll: {
    duration: 1.6,
    wheelMultiplier: 0.55,
    touchMultiplier: 1.2,
  },
  cursor: {
    magneticDistance: 80,
    magneticStrength: 0.4,
  },
  anim: {
    revealOffset: 50,
    revealDuration: 0.9,
    stagger: 0.08,
    fastVelocity: 1200,
    fastDuration: 0.12,
    moderateVelocity: 600,
    moderateDurationFactor: 0.5,
  },
};

/* ═══════════════════════════════════════════
   SHARED STATE
   ═══════════════════════════════════════════ */
const STATE = {
  lenis: null,
  tickerCallback: null,
  directScrollHandler: null,
  isDesktop: false,
  isReducedMotion: false,
  perfTier: 'full',
  contexts: {},
  cleanupFns: [],
};

/* ═══════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════ */
function checkDesktop() {
  return window.innerWidth >= 1024 && !('ontouchstart' in window);
}

function checkReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function registerContext(name, fn) {
  if (STATE.contexts[name]) STATE.contexts[name].revert();
  STATE.contexts[name] = gsap.context(fn);
}

function onCleanup(fn) {
  STATE.cleanupFns.push(fn);
}

/**
 * Scale animation duration by performance tier.
 * Lite devices get 50% shorter animations, mid gets 75%.
 */
function getDuration(base) {
  if (STATE.perfTier === 'lite') return base * 0.5;
  if (STATE.perfTier === 'mid') return base * 0.75;
  return base;
}

/**
 * Scale stagger delay — mobile and lite devices get tighter staggering
 * so later children don't appear ages after the first.
 */
function getStagger(base) {
  if (!STATE.isDesktop) return base * 0.5;
  if (STATE.perfTier === 'lite') return base * 0.5;
  if (STATE.perfTier === 'mid') return base * 0.75;
  return base;
}

/* ═══════════════════════════════════════════
   PERFORMANCE DETECTION
   ═══════════════════════════════════════════ */
function detectPerformanceTier() {
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 4;

  const start = performance.now();
  let sum = 0;
  for (let i = 0; i < 50000; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  const benchTime = performance.now() - start;

  let tier = 'full';
  if (cores <= 2 || memory <= 2 || benchTime > 15) {
    tier = 'lite';
  } else if (cores <= 4 || memory <= 4 || benchTime > 8) {
    tier = 'mid';
  }

  console.log(
    `%c⚡ Performance: ${tier.toUpperCase()} %c(${cores} cores, ${memory}GB, bench: ${benchTime.toFixed(1)}ms)`,
    'color: #22c55e; font-weight: bold; font-size: 14px',
    'color: #888; font-size: 11px'
  );

  return tier;
}

/* ═══════════════════════════════════════════
   TEXT SPLITTING — lines
   ═══════════════════════════════════════════ */
function splitIntoLines(element) {
  const text = element.textContent.trim();
  if (!text) return [];

  const words = text.split(/\s+/);
  element.innerHTML = '';
  element.setAttribute('aria-label', text);

  const tempSpans = words.map((word, i) => {
    const s = document.createElement('span');
    s.style.display = 'inline';
    s.textContent = word;
    element.appendChild(s);
    if (i < words.length - 1) element.appendChild(document.createTextNode(' '));
    return s;
  });

  const lines = [];
  let currentLine = [];
  let currentTop = null;

  tempSpans.forEach((s) => {
    const top = s.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) < 4) {
      currentLine.push(s.textContent);
      if (currentTop === null) currentTop = top;
    } else {
      lines.push(currentLine.join(' '));
      currentLine = [s.textContent];
      currentTop = top;
    }
  });
  if (currentLine.length) lines.push(currentLine.join(' '));

  element.innerHTML = '';
  lines.forEach((lineText) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'split-line-wrapper';
    const inner = document.createElement('div');
    inner.className = 'split-line';
    inner.textContent = lineText;
    wrapper.appendChild(inner);
    element.appendChild(wrapper);
  });

  return element.querySelectorAll('.split-line');
}

/* ═══════════════════════════════════════════
   MODULE: SMOOTH SCROLL (Lenis)
   ═══════════════════════════════════════════ */
async function initSmoothScroll() {
  const duration = STATE.perfTier === 'lite' ? 1.0 : CONFIG.scroll.duration;

  // Skip Lenis entirely on lite tier — native scroll is faster on slow devices
  if (STATE.perfTier === 'lite') {
    STATE.directScrollHandler = function () { ScrollTrigger.update(); };
    window.addEventListener('scroll', STATE.directScrollHandler, { passive: true });
    return;
  }

  try {
    let LenisClass = null;

    if (window.Lenis) {
      LenisClass = window.Lenis;
    } else {
      try {
        const module = await import('lenis');
        LenisClass = module.default || module.Lenis;
      } catch {
        return;
      }
    }

    if (!LenisClass) return;

    STATE.lenis = new LenisClass({
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: CONFIG.scroll.wheelMultiplier,
      touchMultiplier: CONFIG.scroll.touchMultiplier,
      normalizeWheel: true,
      infinite: false,
      prevent: (node) => {
        if (!node || !node.closest) return false;
        return node.closest('#chat-window') !== null ||
               node.closest('#mobile-menu') !== null;
      },
    });

    STATE.lenis.on('scroll', ScrollTrigger.update);

    STATE.tickerCallback = (time) => {
      if (STATE.lenis) STATE.lenis.raf(time * 1000);
    };
    gsap.ticker.add(STATE.tickerCallback);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = STATE.lenis;

    // Direct scroll listener for touch devices — bypasses Lenis raf delay
    // so ScrollTrigger updates immediately on native touch scroll
    if (!STATE.isDesktop || 'ontouchstart' in window) {
      STATE.directScrollHandler = function () { ScrollTrigger.update(); };
      window.addEventListener('scroll', STATE.directScrollHandler, { passive: true });
    }
  } catch (e) {
    console.warn('Lenis init skipped:', e);
    // Fallback: ensure ScrollTrigger updates on native scroll
    STATE.directScrollHandler = function () { ScrollTrigger.update(); };
    window.addEventListener('scroll', STATE.directScrollHandler, { passive: true });
  }
}

/* ═══════════════════════════════════════════
   MODULE: SCROLL PROGRESS BAR
   ═══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  const glow = document.getElementById('scroll-progress-glow');
  if (!bar) return;

  registerContext('scrollProgress', () => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(bar, { scaleY: self.progress });
        if (glow && STATE.perfTier !== 'lite') {
          gsap.set(glow, {
            y: self.progress * window.innerHeight - 15,
            opacity: 0.4 + self.progress * 0.6,
          });
        }
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: MAGNETIC ELEMENTS (CTAs only)
   ═══════════════════════════════════════════ */
function initMagneticElements() {
  if (!STATE.isDesktop) return;

  const elements = document.querySelectorAll('[data-magnetic]');
  if (!elements.length) return;

  const handlers = [];

  elements.forEach((el) => {
    const strength = CONFIG.cursor.magneticStrength;
    const distance = CONFIG.cursor.magneticDistance;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const d = dist(e.clientX, e.clientY, cx, cy);

      if (d < distance) {
        const pull = 1 - d / distance;
        gsap.to(el, {
          x: (e.clientX - cx) * strength * pull,
          y: (e.clientY - cy) * strength * pull,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    handlers.push({ el, onMove, onLeave });
  });

  onCleanup(() => {
    handlers.forEach(({ el, onMove, onLeave }) => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: REVEAL ANIMATIONS (data-animate)
   Velocity-aware: fast scroll → near-instant appearance
   ═══════════════════════════════════════════ */
function initRevealAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  elements.forEach((el) => {
    if (el.closest('[data-stagger]') && !el.hasAttribute('data-stagger')) return;
    if (el.hasAttribute('data-bento-item')) return;
    if (el.hasAttribute('data-cta-title')) return;
    if (el.hasAttribute('data-cta-button')) return;
    if (el.closest('[data-hero-entrance]')) return;

    const type = el.getAttribute('data-animate');
    const delay = parseFloat(el.getAttribute('data-delay') || '0');

    const fromState = { opacity: 0 };
    const toState = {
      opacity: 1,
      ease: 'power3.out',
      clearProps: 'transform',
    };

    switch (type) {
      case 'reveal': {
        const rect = el.getBoundingClientRect();
        const vpCenter = window.innerWidth / 2;
        const elCenter = rect.left + rect.width / 2;
        const bias = (elCenter - vpCenter) / vpCenter;
        fromState.x = bias * CONFIG.anim.revealOffset * 0.8;
        fromState.y = CONFIG.anim.revealOffset * (1 - Math.abs(bias) * 0.5);
        toState.x = 0;
        toState.y = 0;
        break;
      }
      case 'fade-up':
        fromState.y = CONFIG.anim.revealOffset;
        toState.y = 0;
        break;
      case 'fade-down':
        fromState.y = -CONFIG.anim.revealOffset;
        toState.y = 0;
        break;
      case 'fade-left':
        fromState.x = -CONFIG.anim.revealOffset;
        toState.x = 0;
        break;
      case 'fade-right':
        fromState.x = CONFIG.anim.revealOffset;
        toState.x = 0;
        break;
      case 'scale':
        fromState.scale = 0.92;
        toState.scale = 1;
        break;
      case 'scale-in':
        fromState.scale = 0.85;
        toState.scale = 1;
        break;
      case 'text-reveal':
        fromState.y = 30;
        fromState.filter = 'blur(8px)';
        toState.y = 0;
        toState.filter = 'blur(0px)';
        break;
      case 'clip-up':
        fromState.clipPath = 'inset(100% 0 0 0)';
        toState.clipPath = 'inset(0% 0 0 0)';
        break;
      case 'fade-in':
      default:
        break;
    }

    // Set initial hidden state immediately (no FOUC, no waiting for scroll)
    gsap.set(el, fromState);

    // Create a single-fire ScrollTrigger with velocity awareness
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: function (self) {
        var velocity = Math.abs(self.getVelocity()) || 0;
        var isFast = velocity > CONFIG.anim.fastVelocity;
        var isModerate = !isFast && velocity > CONFIG.anim.moderateVelocity;

        var duration = CONFIG.anim.revealDuration;
        if (isFast) {
          duration = CONFIG.anim.fastDuration;
        } else if (isModerate) {
          duration = CONFIG.anim.revealDuration * CONFIG.anim.moderateDurationFactor;
        } else {
          duration = getDuration(duration);
        }

        // clip-up has a longer default duration
        if (type === 'clip-up' && !isFast) duration = 1.2;

        var effectiveDelay = isFast ? 0 : delay;

        gsap.to(el, {
          ...toState,
          duration: duration,
          delay: effectiveDelay,
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: STAGGER CHILDREN (data-stagger)
   Velocity-aware + once: true for instant appearance on fast scroll
   ═══════════════════════════════════════════ */
function initStaggerAnimations() {
  const parents = document.querySelectorAll('[data-stagger]');

  parents.forEach((parent) => {
    const children = Array.from(parent.children);
    if (!children.length) return;

    const staggerDelay = parseFloat(parent.getAttribute('data-stagger') || '0.12');
    const isDirectional = parent.hasAttribute('data-stagger-directional');

    // Set initial hidden state immediately
    if (isDirectional) {
      children.forEach((child) => {
        const rect = child.getBoundingClientRect();
        const vpCenter = window.innerWidth / 2;
        const elCenter = rect.left + rect.width / 2;
        const bias = (elCenter - vpCenter) / vpCenter;
        gsap.set(child, { opacity: 0, x: bias * 30, y: 25 });
      });
    } else {
      gsap.set(children, { opacity: 0, y: 30 });
    }

    ScrollTrigger.create({
      trigger: parent,
      start: 'top 88%',
      once: true,
      onEnter: (self) => {
        var velocity = Math.abs(self.getVelocity()) || 0;
        var isFast = velocity > CONFIG.anim.fastVelocity;
        var stagger = isFast ? 0.02 : getStagger(staggerDelay);
        var duration = isFast ? CONFIG.anim.fastDuration : getDuration(0.7);

        if (isDirectional) {
          children.forEach((child, i) => {
            gsap.to(child, {
              opacity: 1, x: 0, y: 0,
              duration: duration,
              delay: i * stagger,
              ease: 'power3.out',
              clearProps: 'transform',
            });
          });
        } else {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: 'power3.out',
            clearProps: 'transform',
          });
        }
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: HERO ANIMATIONS
   ═══════════════════════════════════════════ */
function initHeroAnimations() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  initHeroEntrance(hero);

  registerContext('hero', () => {
    const deco = hero.querySelector('[data-hero-deco]');
    if (deco) {
      gsap.to(deco, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }

    const heroContent = hero.querySelector('[data-hero-content]');
    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: -15,
        opacity: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });
    }

    const heroBg = hero.querySelector('[data-hero-bg]');
    if (heroBg) {
      gsap.fromTo(heroBg, { scale: 1 }, {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  });
}

function initHeroEntrance(hero) {
  const entrance = hero.querySelector('[data-hero-entrance]');
  if (!entrance) return;

  const label = entrance.querySelector('[data-hero-label]');
  const lines = entrance.querySelectorAll('[data-hero-line]');
  const paragraph = entrance.querySelector('[data-hero-paragraph]');
  const buttons = entrance.querySelector('[data-hero-buttons]');
  const trust = entrance.querySelector('[data-hero-trust]');

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' },
    delay: 0.2,
  });

  if (label) {
    tl.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 });
  }

  if (lines.length) {
    tl.fromTo(lines,
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1 },
      '-=0.4'
    );
  }

  if (paragraph) {
    tl.fromTo(paragraph, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
  }

  if (buttons) {
    tl.fromTo(buttons,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      '-=0.4'
    );
  }

  if (trust) {
    tl.fromTo(trust, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');
  }
}

/* ═══════════════════════════════════════════
   MODULE: COUNTERS (data-counter)
   Velocity-aware: fast scroll → fast count
   ═══════════════════════════════════════════ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');

  counters.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target) || target === 0) return;

    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    const obj = { value: 0 };

    el.textContent = prefix + '0' + suffix;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: (self) => {
        var velocity = Math.abs(self.getVelocity()) || 0;
        var isFast = velocity > CONFIG.anim.fastVelocity;
        var duration = isFast ? 0.4 : 2.5;

        gsap.to(obj, {
          value: target,
          duration: duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent =
              prefix +
              (decimals > 0 ? obj.value.toFixed(decimals) : Math.floor(obj.value).toLocaleString()) +
              suffix;
          },
          onComplete: () => {
            el.textContent =
              prefix +
              (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) +
              suffix;
          },
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: BENTO GRID
   Velocity-aware + once: true
   ═══════════════════════════════════════════ */
function initBentoGrid() {
  const grids = document.querySelectorAll('[data-bento]');
  if (!grids.length) return;

  registerContext('bento', () => {
    grids.forEach((grid) => {
      const items = grid.querySelectorAll('[data-bento-item]');
      if (!items.length) return;

      gsap.set(items, { y: 60, opacity: 0, scale: 0.95 });

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        once: true,
        onEnter: (self) => {
          var velocity = Math.abs(self.getVelocity()) || 0;
          var isFast = velocity > CONFIG.anim.fastVelocity;
          var stagger = isFast ? 0.02 : 0.08;
          var duration = isFast ? CONFIG.anim.fastDuration : getDuration(0.9);

          gsap.to(items, {
            y: 0, opacity: 1, scale: 1,
            stagger: stagger,
            duration: duration,
            ease: 'power3.out',
            clearProps: 'transform',
          });
        },
      });

      if (STATE.isDesktop && STATE.perfTier !== 'lite') {
        items.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            items.forEach((sib) => {
              if (sib !== item) gsap.to(sib, { opacity: 0.5, duration: 0.4 });
            });
          });
          item.addEventListener('mouseleave', () => {
            items.forEach((sib) => {
              gsap.to(sib, { opacity: 1, duration: 0.4 });
            });
          });
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: CTA SECTION
   Velocity-aware + once: true
   ═══════════════════════════════════════════ */
function initCTASection() {
  const cta = document.querySelector('[data-cta-section]');
  if (!cta) return;

  document.fonts.ready.then(() => {
    registerContext('cta', () => {
      const title = cta.querySelector('[data-cta-title]');
      if (title) {
        const lines = splitIntoLines(title);
        if (lines.length) {
          gsap.set(lines, { yPercent: 105, opacity: 0 });

          ScrollTrigger.create({
            trigger: cta,
            start: 'top 70%',
            once: true,
            onEnter: (self) => {
              var velocity = Math.abs(self.getVelocity()) || 0;
              var isFast = velocity > CONFIG.anim.fastVelocity;
              var stagger = isFast ? 0.02 : 0.1;
              var duration = isFast ? CONFIG.anim.fastDuration : 1;

              gsap.to(lines, {
                yPercent: 0,
                opacity: 1,
                stagger: stagger,
                duration: duration,
                ease: 'power4.out',
              });
            },
          });
        }
      }

      const btn = cta.querySelector('[data-cta-button]');
      if (btn) {
        gsap.set(btn, { scale: 0.8, opacity: 0 });

        ScrollTrigger.create({
          trigger: cta,
          start: 'top 65%',
          once: true,
          onEnter: (self) => {
            var velocity = Math.abs(self.getVelocity()) || 0;
            var isFast = velocity > CONFIG.anim.fastVelocity;
            var duration = isFast ? CONFIG.anim.fastDuration : 0.8;
            var ease = isFast ? 'power2.out' : 'back.out(1.7)';

            gsap.to(btn, {
              scale: 1, opacity: 1,
              duration: duration,
              ease: ease,
            });
          },
        });
      }

      ScrollTrigger.refresh();
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: PARALLAX
   ═══════════════════════════════════════════ */
function initParallax() {
  if (STATE.perfTier === 'lite') return;

  const elements = document.querySelectorAll('[data-parallax], [data-speed]');

  elements.forEach((el) => {
    const rawSpeed = parseFloat(
      el.getAttribute('data-parallax') || el.getAttribute('data-speed') || '0.3'
    );

    const offset = el.hasAttribute('data-speed')
      ? (1 - rawSpeed) * 100
      : rawSpeed * 25;

    gsap.to(el, {
      yPercent: offset,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: IMAGE PARALLAX
   ═══════════════════════════════════════════ */
function initImageParallax() {
  if (STATE.perfTier === 'lite') return;

  const containers = document.querySelectorAll('[data-img-parallax]');
  if (!containers.length) return;

  containers.forEach((container) => {
    const img = container.querySelector('img');
    if (!img) return;

    gsap.fromTo(img, { scale: 1.12 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: HORIZONTAL SCROLL
   ═══════════════════════════════════════════ */
function initHorizontalScroll() {
  var section = document.querySelector('[data-horizontal-scroll]');
  var track = document.querySelector('[data-horizontal-track]');
  if (!section || !track) return;
  if (window.innerWidth < 1024) return;

  var cards = track.children;
  if (cards.length < 2) return;

  gsap.set(track, { x: 0 });
  track.style.scrollLeft = '0';
  track.style.scrollSnapType = 'none';
  track.style.scrollBehavior = 'auto';
  var hWrapper = track.parentElement;
  if (hWrapper) hWrapper.style.overflow = '';

  track.style.position = 'relative';
  track.style.overflowX = 'visible';
  void track.offsetHeight;

  var cardWidth = cards[0].offsetWidth;
  var gap = cards.length >= 2
    ? cards[1].offsetLeft - cards[0].offsetLeft - cardWidth
    : 0;
  var totalContentWidth = cards.length * cardWidth + (cards.length - 1) * gap;
  var paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  var paddingRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
  var visibleWidth = track.clientWidth - paddingLeft - paddingRight;
  var totalScroll = totalContentWidth - visibleWidth;

  if (totalScroll <= 0) {
    track.style.position = '';
    track.style.overflowX = '';
    if (hWrapper) hWrapper.style.overflow = '';
    return;
  }

  if (hWrapper) hWrapper.style.overflow = 'hidden';

  gsap.to(track, {
    x: -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=' + totalScroll,
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  var leftArrow = section.querySelector('#products-prev');
  var rightArrow = section.querySelector('#products-next');
  var step = cardWidth + gap;

  if (leftArrow) {
    leftArrow.addEventListener('click', function () {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY - step, { duration: 0.6 });
      } else {
        window.scrollBy({ top: -step, behavior: 'smooth' });
      }
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', function () {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + step, { duration: 0.6 });
      } else {
        window.scrollBy({ top: step, behavior: 'smooth' });
      }
    });
  }
}

/* ═══════════════════════════════════════════
   MODULE: 3D TILT (desktop, not lite)
   ═══════════════════════════════════════════ */
function init3DTilt() {
  if (!STATE.isDesktop || STATE.perfTier === 'lite') return;

  const elements = document.querySelectorAll('[data-tilt]');
  if (!elements.length) return;

  const handlers = [];

  elements.forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax) || 8;
    const perspective = parseFloat(el.dataset.tiltPerspective) || 800;

    el.style.transformStyle = 'preserve-3d';
    el.style.perspective = perspective + 'px';

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      gsap.to(el, {
        rotateX: (0.5 - y) * maxTilt,
        rotateY: (x - 0.5) * maxTilt,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    handlers.push({ el, onMove, onLeave });
  });

  onCleanup(() => {
    handlers.forEach(({ el, onMove, onLeave }) => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0 });
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: FLOATING ELEMENTS
   ═══════════════════════════════════════════ */
function initFloatingElements() {
  if (STATE.perfTier === 'lite') return;

  registerContext('floating', () => {
    document.querySelectorAll('[data-float]').forEach((el) => {
      const amplitude = parseFloat(el.dataset.floatAmplitude) || 15;
      const duration = parseFloat(el.dataset.floatDuration) || 4;

      gsap.to(el, {
        y: amplitude,
        duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to(el, {
        rotation: 3,
        duration: duration * 1.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: PAGE TRANSITIONS
   ═══════════════════════════════════════════ */
let pageTransitionsReady = false;

function initPageTransitions() {
  if (pageTransitionsReady) return;
  pageTransitionsReady = true;

  document.addEventListener('astro:before-preparation', () => {
    const progress = document.getElementById('page-progress');
    if (progress) {
      gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 0.7, duration: 2, ease: 'power1.out' });
    }
  });

  document.addEventListener('astro:before-swap', () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (STATE.lenis) { STATE.lenis.destroy(); STATE.lenis = null; }
  });

  document.addEventListener('astro:after-swap', () => {
    const progress = document.getElementById('page-progress');
    if (progress) {
      gsap.to(progress, {
        scaleX: 1, duration: 0.3, ease: 'power2.out',
        onComplete: () => {
          gsap.to(progress, {
            opacity: 0, duration: 0.3, delay: 0.1,
            onComplete: () => { gsap.set(progress, { scaleX: 0, opacity: 1 }); },
          });
        },
      });
    }
    window.scrollTo(0, 0);
  });
}

/* ═══════════════════════════════════════════
   MODULE: PINNED STEPS
   ═══════════════════════════════════════════ */
function initPinnedSteps() {
  var sections = document.querySelectorAll('[data-pinned-steps]');
  if (!sections.length) return;

  sections.forEach(function (section) {
    var panels = Array.from(section.querySelectorAll('[data-step-panel]'));
    var indicators = Array.from(section.querySelectorAll('[data-step-indicator]'));
    if (!panels.length) return;

    if (section['_stepAbort']) section['_stepAbort'].abort();
    section['_stepAbort'] = new AbortController();
    var signal = section['_stepAbort'].signal;

    section.style.overflow = '';
    var innerFlex = section.children[0];
    if (innerFlex) innerFlex.style.height = '';

    panels.forEach(function (panel) {
      panel.style.position = '';
      panel.style.inset = '';
      panel.style.display = '';
      panel.style.transition = '';
      panel.style.opacity = '';
      panel.style.transform = '';
      panel.style.visibility = '';
      panel.style.pointerEvents = '';
    });
    indicators.forEach(function (ind) {
      ind.style.cursor = '';
      ind.classList.remove('is-active');
    });

    var isDesktop = window.innerWidth >= 1024;
    var currentIdx = 0;

    if (isDesktop && STATE.isReducedMotion) {
      section.style.overflow = 'visible';
      if (innerFlex) innerFlex.style.height = 'auto';

      panels.forEach(function (panel) {
        panel.style.display = 'flex';
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
      });

      if (indicators[0]) indicators[0].classList.add('is-active');
      indicators.forEach(function (ind, i) {
        ind.style.cursor = 'pointer';
        ind.addEventListener('click', function () {
          panels[i].scrollIntoView({ behavior: 'instant', block: 'center' });
          indicators.forEach(function (ind2, j) {
            ind2.classList.toggle('is-active', j === i);
          });
        }, { signal: signal });
      });

    } else if (isDesktop) {
      panels.forEach(function (panel, i) {
        if (i === 0) {
          panel.style.display = 'flex';
          panel.style.opacity = '1';
        } else {
          panel.style.display = 'none';
          panel.style.opacity = '0';
        }
      });

      if (indicators[0]) indicators[0].classList.add('is-active');
      indicators.forEach(function (ind) { ind.style.cursor = 'pointer'; });

      section.addEventListener('click', function (e) {
        var target = e.target;
        if (!target || typeof target.closest !== 'function') return;
        var indicator = target.closest('[data-step-indicator]');
        if (!indicator) return;
        var idx = indicators.indexOf(indicator);
        if (idx === -1 || idx === currentIdx) return;

        panels[currentIdx].style.display = 'none';
        panels[currentIdx].style.opacity = '0';

        panels[idx].style.display = 'flex';
        panels[idx].style.opacity = '1';

        indicators.forEach(function (ind, i) {
          ind.classList.toggle('is-active', i === idx);
        });

        currentIdx = idx;
      }, { signal: signal });

    } else {
      panels.forEach(function (panel) {
        panel.style.display = 'flex';
        panel.style.opacity = '1';
      });
    }
  });
}

/* ═══════════════════════════════════════════
   FALLBACK
   ═══════════════════════════════════════════ */
function makeEverythingVisible() {
  const sel = '[data-animate], [data-stagger] > *, [data-bento-item], [data-cta-title], [data-cta-button], .gsap-reveal, .animate-in, .fade-in, .reveal, [data-scroll], [data-fade], [data-hero-line], [data-hero-label], [data-hero-paragraph], [data-hero-buttons], [data-hero-trust]';
  document.querySelectorAll(sel).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
    el.style.clipPath = 'none';
    el.style.visibility = 'visible';
  });

  document.querySelectorAll('[data-horizontal-track]').forEach(function(track) {
    track.style.overflowX = 'auto';
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollBehavior = 'smooth';
    track.style.scrollLeft = '0';
    track.style.transform = 'none';
    delete track._hscroll;
    var w = track.parentElement;
    if (w) w.style.overflow = '';
  });

  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
  });
}

/* ═══════════════════════════════════════════
   CLEANUP
   ═══════════════════════════════════════════ */
function cleanup() {
  Object.keys(STATE.contexts).forEach((key) => {
    if (STATE.contexts[key]) { STATE.contexts[key].revert(); delete STATE.contexts[key]; }
  });
  STATE.cleanupFns.forEach((fn) => fn());
  STATE.cleanupFns = [];
  ScrollTrigger.getAll().forEach((st) => st.kill());
  ScrollTrigger.clearMatchMedia();
  if (STATE.tickerCallback) { gsap.ticker.remove(STATE.tickerCallback); STATE.tickerCallback = null; }
  if (STATE.lenis) { STATE.lenis.destroy(); STATE.lenis = null; window.__lenis = null; }
  if (STATE.directScrollHandler) {
    window.removeEventListener('scroll', STATE.directScrollHandler);
    STATE.directScrollHandler = null;
  }
  document.documentElement.classList.remove('has-custom-cursor', 'is-scrolling-fast');
}

/* ═══════════════════════════════════════════
   MASTER INIT
   ═══════════════════════════════════════════ */
export async function initAnimations() {
  try {
    cleanup();

    STATE.isReducedMotion = checkReducedMotion();
    if (STATE.isReducedMotion) {
      makeEverythingVisible();
      document.documentElement.classList.add('gsap-ready');
      return;
    }

    // Removed limitCallbacks: true — it was throttling triggers on fast mobile scroll
    ScrollTrigger.config({});

    STATE.isDesktop = checkDesktop();
    STATE.perfTier = detectPerformanceTier();

    await initSmoothScroll();

    document.documentElement.classList.add('gsap-ready');

    requestAnimationFrame(() => {
      try {
        initScrollProgress();
        initMagneticElements();
        initRevealAnimations();
        initStaggerAnimations();
        initHeroAnimations();
        initCounterAnimations();
        initBentoGrid();
        initPinnedSteps();
        initParallax();
        initImageParallax();
        initHorizontalScroll();
        init3DTilt();
        initFloatingElements();
        initPageTransitions();
        initCTASection();

        document.addEventListener('visibilitychange', function () {
          var tracks = document.querySelectorAll('.marquee-track');
          for (var i = 0; i < tracks.length; i++) {
            tracks[i].style.animationPlayState = document.hidden ? 'paused' : 'running';
          }
        });

        ScrollTrigger.refresh();

        setTimeout(function () { ScrollTrigger.refresh(); }, 600);
      } catch (e) {
        console.warn('Animation init error:', e);
        makeEverythingVisible();
      }
    });
  } catch (e) {
    console.warn('GSAP init error:', e);
    makeEverythingVisible();
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const wasDesktop = STATE.isDesktop;
    STATE.isDesktop = checkDesktop();
    if (wasDesktop !== STATE.isDesktop) initAnimations();
    ScrollTrigger.refresh();
  }, 300);
});

const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
motionMQ.addEventListener('change', () => {
  initAnimations();
});