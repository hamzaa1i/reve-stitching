/**
 * src/scripts/animations.js
 * Premium Animation Engine — Reve Stitching
 *
 * Merges existing system with premium effects:
 * Lenis smooth scroll, section snapping, custom cursor,
 * mouse-reactive background, particles, grain, scroll progress,
 * enhanced reveals, hero, CTA, bento, 3D tilt, parallax,
 * horizontal scroll, floating elements, page transitions.
 *
 * Backward compatible with all existing data attributes.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════ */
const CONFIG = {
  scroll: {
    duration: 1.4,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.5,
  },
  snap: {
    enabled: true,
    velocityThreshold: 0.5,
    distanceThreshold: 0.3,
    duration: 1.0,
    delay: 120,
  },
  cursor: {
    magneticDistance: 80,
    magneticStrength: 0.3,
  },
  particles: {
    count: 25,
    minSize: 2,
    maxSize: 5,
    repelDistance: 150,
    repelStrength: 30,
  },
  anim: {
    revealOffset: 40,
    revealDuration: 0.9,
    stagger: 0.08,
  },
};

/* ═══════════════════════════════════════════
   SHARED STATE
   ═══════════════════════════════════════════ */
const STATE = {
  lenis: null,
  tickerCallback: null,
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  isDesktop: false,
  isReducedMotion: false,
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

function lerp(a, b, t) {
  return a + (b - a) * t;
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

/* ═══════════════════════════════════════════
   TEXT SPLITTING — lines
   ═══════════════════════════════════════════ */
function splitIntoLines(element) {
  const text = element.textContent.trim();
  if (!text) return [];

  const words = text.split(/\s+/);
  element.innerHTML = '';
  element.setAttribute('aria-label', text);

  // Render words to measure line breaks
  const tempSpans = words.map((word, i) => {
    const s = document.createElement('span');
    s.style.display = 'inline';
    s.textContent = word;
    element.appendChild(s);
    if (i < words.length - 1) element.appendChild(document.createTextNode(' '));
    return s;
  });

  // Group by vertical position
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

  // Rebuild with clip wrappers
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
   NOISE TEXTURE GENERATOR
   ═══════════════════════════════════════════ */
function createNoiseTexture() {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 28;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/* ═══════════════════════════════════════════
   MODULE: SMOOTH SCROLL (Lenis)
   ═══════════════════════════════════════════ */
async function initSmoothScroll() {
  try {
    let LenisClass = null;

    if (window.Lenis) {
      LenisClass = window.Lenis;
    } else {
      try {
        const module = await import('lenis');
        LenisClass = module.default || module.Lenis;
      } catch {
        console.warn('Lenis not available, using native scroll');
        return;
      }
    }

    if (!LenisClass) return;

    STATE.lenis = new LenisClass({
      duration: CONFIG.scroll.duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: CONFIG.scroll.wheelMultiplier,
      touchMultiplier: CONFIG.scroll.touchMultiplier,
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
  } catch (e) {
    console.warn('Lenis init skipped:', e);
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
        if (glow) {
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
   MODULE: SCROLL VELOCITY DETECTION
   ═══════════════════════════════════════════ */
function initScrollVelocity() {
  if (!STATE.lenis) return;

  let fastClass = false;

  const handler = ({ velocity }) => {
    const abs = Math.abs(velocity);
    if (abs > 2.5 && !fastClass) {
      fastClass = true;
      document.documentElement.classList.add('is-scrolling-fast');
    } else if (abs < 1 && fastClass) {
      fastClass = false;
      document.documentElement.classList.remove('is-scrolling-fast');
    }
  };

  STATE.lenis.on('scroll', handler);
  onCleanup(() => {
    STATE.lenis?.off('scroll', handler);
    document.documentElement.classList.remove('is-scrolling-fast');
  });
}

/* ═══════════════════════════════════════════
   MODULE: SECTION SNAPPING (soft magnetic)
   ═══════════════════════════════════════════ */
function initSectionSnap() {
  if (!CONFIG.snap.enabled || !STATE.lenis) return;

  // Skip pinned horizontal-scroll sections
  const sections = document.querySelectorAll('[data-snap]:not([data-horizontal-scroll])');
  if (sections.length < 2) return;

  let snapTimeout = null;
  let isSnapping = false;

  const handler = ({ velocity }) => {
    if (isSnapping) return;
    clearTimeout(snapTimeout);

    if (Math.abs(velocity) < CONFIG.snap.velocityThreshold) {
      snapTimeout = setTimeout(() => {
        const vh = window.innerHeight;
        let closest = null;
        let closestDist = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          const threshold = vh * CONFIG.snap.distanceThreshold;

          if (distance < threshold && distance < closestDist) {
            closestDist = distance;
            closest = section;
          }
        });

        if (closest && closestDist > 5) {
          isSnapping = true;
          STATE.lenis.scrollTo(closest, {
            duration: CONFIG.snap.duration,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            onComplete: () => { isSnapping = false; },
          });
        }
      }, CONFIG.snap.delay);
    }
  };

  STATE.lenis.on('scroll', handler);
  onCleanup(() => {
    STATE.lenis?.off('scroll', handler);
    clearTimeout(snapTimeout);
  });
}

/* ═══════════════════════════════════════════
   MODULE: CUSTOM CURSOR
   ═══════════════════════════════════════════ */
function initCustomCursor() {
  if (!STATE.isDesktop) return;

  const dot = document.getElementById('cursor-dot');
  const follower = document.getElementById('cursor-follower');
  const label = document.getElementById('cursor-label');
  const trailContainer = document.getElementById('cursor-trail');
  if (!dot || !follower) return;

  document.documentElement.classList.add('has-custom-cursor');

  // Quick setters for dot (instant positioning)
  const setDotX = gsap.quickSetter(dot, 'x', 'px');
  const setDotY = gsap.quickSetter(dot, 'y', 'px');

  // Trail dots setup
  const trailDots = trailContainer
    ? Array.from(trailContainer.querySelectorAll('.cursor-trail-dot'))
    : [];
  const trailPositions = trailDots.map(() => ({
    x: STATE.mouse.x,
    y: STATE.mouse.y,
  }));

  // --- Mouse move handler ---
  const onMouseMove = (e) => {
    STATE.mouse.x = e.clientX;
    STATE.mouse.y = e.clientY;

    // Dot follows instantly
    setDotX(e.clientX);
    setDotY(e.clientY);

    // Follower follows with spring delay
    gsap.to(follower, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    // Update CSS vars for gradient/spotlight
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  };

  // --- Trail animation on GSAP ticker ---
  const updateTrail = () => {
    for (let i = 0; i < trailDots.length; i++) {
      const target = i === 0
        ? { x: STATE.mouse.x, y: STATE.mouse.y }
        : trailPositions[i - 1];
      const ease = 0.25 - i * 0.02;
      trailPositions[i].x = lerp(trailPositions[i].x, target.x, ease);
      trailPositions[i].y = lerp(trailPositions[i].y, target.y, ease);
      gsap.set(trailDots[i], {
        x: trailPositions[i].x,
        y: trailPositions[i].y,
        opacity: (1 - i / trailDots.length) * 0.35,
      });
    }
  };
  gsap.ticker.add(updateTrail);

  // --- Cursor state management ---
  const setCursorState = (state, labelText = '') => {
    follower.classList.remove('is-link', 'is-view', 'is-drag', 'has-label');
    dot.classList.remove('is-text', 'is-hidden');

    if (state === 'link') {
      follower.classList.add('is-link', 'has-label');
      dot.classList.add('is-hidden');
      label.textContent = labelText || '●';
    } else if (state === 'view') {
      follower.classList.add('is-view', 'has-label');
      dot.classList.add('is-hidden');
      label.textContent = labelText || 'View';
    } else if (state === 'text') {
      dot.classList.add('is-text');
    } else if (state === 'drag') {
      follower.classList.add('is-drag', 'has-label');
      label.textContent = labelText || 'Drag';
    }
  };

  const resetCursorState = () => {
    follower.classList.remove('is-link', 'is-view', 'is-drag', 'has-label');
    dot.classList.remove('is-text', 'is-hidden');
    label.textContent = '';
  };

  // Event delegation for hover detection
  const onMouseOver = (e) => {
    const t = e.target;
    if (t.closest('a, button, [data-cursor="link"], input[type="submit"], [role="button"]')) {
      setCursorState('link');
    } else if (t.closest('img, video, [data-cursor="view"], picture')) {
      setCursorState('view');
    } else if (t.closest('[data-cursor="drag"], [data-tilt]')) {
      setCursorState('drag');
    }
  };

  const onMouseOut = (e) => {
    const related = e.relatedTarget;
    if (
      !related ||
      (!related.closest('a, button, [role="button"]') &&
        !related.closest('img, video, picture') &&
        !related.closest('[data-tilt]'))
    ) {
      resetCursorState();
    }
  };

  // --- Cursor color inversion on dark sections ---
  const darkSections = document.querySelectorAll(
    '[data-cursor-dark], .bg-primary-dark'
  );

  registerContext('cursorInversion', () => {
    darkSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          dot.classList.add('is-inverted');
          follower.classList.add('is-inverted');
        },
        onLeave: () => {
          dot.classList.remove('is-inverted');
          follower.classList.remove('is-inverted');
        },
        onEnterBack: () => {
          dot.classList.add('is-inverted');
          follower.classList.add('is-inverted');
        },
        onLeaveBack: () => {
          dot.classList.remove('is-inverted');
          follower.classList.remove('is-inverted');
        },
      });
    });
  });

  // --- Click ripple ---
  const onMouseDown = (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    document.body.appendChild(ripple);
    gsap.set(ripple, { x: e.clientX, y: e.clientY });
    gsap.to(ripple, {
      scale: 3,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    });
  };

  // --- Activate spotlight ---
  const spotlight = document.getElementById('spotlight');
  if (spotlight) spotlight.classList.add('is-active');

  // --- Bind all events ---
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseover', onMouseOver, { passive: true });
  document.addEventListener('mouseout', onMouseOut, { passive: true });
  window.addEventListener('mousedown', onMouseDown, { passive: true });

  onCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseout', onMouseOut);
    window.removeEventListener('mousedown', onMouseDown);
    gsap.ticker.remove(updateTrail);
    document.documentElement.classList.remove('has-custom-cursor');
    dot.classList.remove('is-inverted', 'is-text', 'is-hidden');
    follower.classList.remove(
      'is-inverted', 'is-link', 'is-view', 'is-drag', 'has-label'
    );
    if (spotlight) spotlight.classList.remove('is-active');
  });
}

/* ═══════════════════════════════════════════
   MODULE: MAGNETIC ELEMENTS
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
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
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
   MODULE: MOUSE BACKGROUND (Particles + Grain)
   ═══════════════════════════════════════════ */
function initMouseBackground() {
  const container = document.getElementById('particles-container');
  const grainEl = document.getElementById('grain-overlay');

  // Generate grain texture
  if (grainEl) {
    grainEl.style.backgroundImage = `url(${createNoiseTexture()})`;
  }

  // Particles — desktop only
  if (!container || !STATE.isDesktop) return;

  const particles = [];
  const count = CONFIG.particles.count;

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'particle';
    const size =
      CONFIG.particles.minSize +
      Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize);
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.opacity = String(0.2 + Math.random() * 0.5);
    container.appendChild(div);

    particles.push({
      el: div,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseX: Math.random() * window.innerWidth,
      baseY: Math.random() * window.innerHeight,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.2 + Math.random() * 0.3,
      floatRadius: 30 + Math.random() * 60,
    });
  }

  let time = 0;

  const updateParticles = (_, dt) => {
    time += dt / 1000;
    const mx = STATE.mouse.x;
    const my = STATE.mouse.y;

    particles.forEach((p) => {
      // Floating base motion
      const targetX =
        p.baseX +
        Math.sin(time * p.floatSpeed + p.floatPhase) * p.floatRadius;
      const targetY =
        p.baseY +
        Math.cos(time * p.floatSpeed * 0.7 + p.floatPhase) * p.floatRadius;

      // Cursor repulsion
      const d = dist(targetX, targetY, mx, my);
      let repelX = 0;
      let repelY = 0;

      if (d < CONFIG.particles.repelDistance && d > 0) {
        const force =
          (1 - d / CONFIG.particles.repelDistance) *
          CONFIG.particles.repelStrength;
        repelX = ((targetX - mx) / d) * force;
        repelY = ((targetY - my) / d) * force;
      }

      // Smooth interpolation
      p.x = lerp(p.x, targetX + repelX, 0.05);
      p.y = lerp(p.y, targetY + repelY, 0.05);
      gsap.set(p.el, { x: p.x, y: p.y });
    });
  };

  gsap.ticker.add(updateParticles);

  const onResize = () => {
    particles.forEach((p) => {
      p.baseX = Math.random() * window.innerWidth;
      p.baseY = Math.random() * window.innerHeight;
    });
  };
  window.addEventListener('resize', onResize, { passive: true });

  onCleanup(() => {
    gsap.ticker.remove(updateParticles);
    window.removeEventListener('resize', onResize);
    particles.forEach((p) => p.el.remove());
  });
}

/* ═══════════════════════════════════════════
   MODULE: REVEAL ANIMATIONS (data-animate)
   Backward compatible with existing attributes
   ═══════════════════════════════════════════ */
function initRevealAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  elements.forEach((el) => {
    // Skip elements handled by dedicated modules
    if (el.closest('[data-stagger]') && !el.hasAttribute('data-stagger')) return;
    if (el.hasAttribute('data-bento-item')) return;
    if (el.hasAttribute('data-cta-title')) return;
    if (el.hasAttribute('data-cta-button')) return;

    const type = el.getAttribute('data-animate');
    const delay = parseFloat(el.getAttribute('data-delay') || '0');

    const fromState = { opacity: 0 };
    const toState = {
      opacity: 1,
      duration: CONFIG.anim.revealDuration,
      delay,
      ease: 'power3.out',
      clearProps: 'transform',
    };

    switch (type) {
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
        toState.duration = 1.2;
        break;
      case 'fade-in':
      default:
        break;
    }

    gsap.fromTo(el, fromState, {
      ...toState,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: STAGGER CHILDREN (data-stagger)
   Backward compatible with existing attribute
   ═══════════════════════════════════════════ */
function initStaggerAnimations() {
  const parents = document.querySelectorAll('[data-stagger]');

  parents.forEach((parent) => {
    const children = Array.from(parent.children);
    if (!children.length) return;

    const staggerDelay = parseFloat(
      parent.getAttribute('data-stagger') || '0.12'
    );

    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: staggerDelay,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: parent,
          start: 'top 88%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ═══════════════════════════════════════════
   MODULE: HERO ANIMATIONS
   ═══════════════════════════════════════════ */
function initHeroAnimations() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  registerContext('hero', () => {
    // Decorative element — slow parallax
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

    // Content scroll-away (opt-in via data-hero-content)
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

    // Background Ken Burns zoom
    const heroBg = hero.querySelector('[data-hero-bg]');
    if (heroBg) {
      gsap.fromTo(
        heroBg,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }
  });
}

/* ═══════════════════════════════════════════
   MODULE: COUNTER ANIMATIONS (data-counter)
   Backward compatible
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

    gsap.to(obj, {
      value: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent =
          prefix +
          (decimals > 0
            ? obj.value.toFixed(decimals)
            : Math.floor(obj.value).toLocaleString()) +
          suffix;
      },
      onComplete: () => {
        el.textContent =
          prefix +
          (decimals > 0
            ? target.toFixed(decimals)
            : target.toLocaleString()) +
          suffix;
      },
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: BENTO GRID
   ═══════════════════════════════════════════ */
function initBentoGrid() {
  const grids = document.querySelectorAll('[data-bento]');
  if (!grids.length) return;

  registerContext('bento', () => {
    grids.forEach((grid) => {
      const items = grid.querySelectorAll('[data-bento-item]');
      if (!items.length) return;

      // Staggered entrance
      gsap.fromTo(
        items,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: { each: 0.08 },
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Desktop: dim siblings on hover
      if (STATE.isDesktop) {
        items.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            items.forEach((sibling) => {
              if (sibling !== item) {
                gsap.to(sibling, { opacity: 0.5, duration: 0.4 });
              }
            });
          });
          item.addEventListener('mouseleave', () => {
            items.forEach((sibling) => {
              gsap.to(sibling, { opacity: 1, duration: 0.4 });
            });
          });
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: CTA SECTION (text split + button)
   ═══════════════════════════════════════════ */
function initCTASection() {
  const cta = document.querySelector('[data-cta-section]');
  if (!cta) return;

  // Wait for fonts before splitting text
  document.fonts.ready.then(() => {
    registerContext('cta', () => {
      // Split heading into animated lines
      const title = cta.querySelector('[data-cta-title]');
      if (title) {
        const lines = splitIntoLines(title);
        if (lines.length) {
          gsap.from(lines, {
            yPercent: 105,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: cta,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          });
        }
      }

      // Button scale-in
      const btn = cta.querySelector('[data-cta-button]');
      if (btn) {
        gsap.fromTo(
          btn,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: cta,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Refresh after text split changed layout
      ScrollTrigger.refresh();
    });
  });
}

/* ═══════════════════════════════════════════
   MODULE: PARALLAX (data-parallax + data-speed)
   Backward compatible
   ═══════════════════════════════════════════ */
function initParallax() {
  const elements = document.querySelectorAll('[data-parallax], [data-speed]');

  elements.forEach((el) => {
    const rawSpeed = parseFloat(
      el.getAttribute('data-parallax') ||
        el.getAttribute('data-speed') ||
        '0.3'
    );

    // data-parallax uses speed * 25, data-speed uses (1-speed) * 100
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
   MODULE: HORIZONTAL SCROLL (Desktop only)
   Backward compatible — unchanged
   ═══════════════════════════════════════════ */
function initHorizontalScroll() {
  const section = document.querySelector('[data-horizontal-scroll]');
  const track = document.querySelector('[data-horizontal-track]');

  if (!section || !track) return;
  if (window.innerWidth < 1024) return;

  const totalScroll = track.scrollWidth - window.innerWidth;
  if (totalScroll <= 0) return;

  gsap.to(track, {
    x: -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
}

/* ═══════════════════════════════════════════
   MODULE: 3D TILT ON HOVER (Desktop only)
   ═══════════════════════════════════════════ */
function init3DTilt() {
  if (!STATE.isDesktop) return;

  const elements = document.querySelectorAll('[data-tilt]');
  if (!elements.length) return;

  const handlers = [];

  elements.forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax) || 12;
    const perspective = parseFloat(el.dataset.tiltPerspective) || 800;

    el.style.transformStyle = 'preserve-3d';
    el.style.perspective = perspective + 'px';

    // Optional glare overlay
    let glareEl = null;
    if (el.dataset.tiltGlare !== undefined) {
      glareEl = document.createElement('div');
      glareEl.style.cssText = `
        position: absolute; inset: 0; border-radius: inherit;
        pointer-events: none; z-index: 10;
        background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%);
        opacity: 0; transition: opacity 0.4s;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(glareEl);
    }

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

      if (glareEl) {
        glareEl.style.opacity = '1';
        const angle =
          Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 180;
        glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.2) 0%, transparent 50%)`;
      }
    };

    const onLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
      if (glareEl) glareEl.style.opacity = '0';
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
   MODULE: FLOATING ELEMENTS (sine wave motion)
   ═══════════════════════════════════════════ */
function initFloatingElements() {
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
   MODULE: BLUR-UP IMAGE LOADING
   ═══════════════════════════════════════════ */
function initBlurUpImages() {
  document.querySelectorAll('[data-blur-up]').forEach((img) => {
    const reveal = () => {
      gsap.to(img, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => img.classList.add('is-loaded'),
      });
    };

    if (img.complete && img.naturalHeight > 0) {
      reveal();
    } else {
      img.addEventListener('load', reveal, { once: true });
    }
  });
}

/* ═══════════════════════════════════════════
   MODULE: SCROLL-TO-TOP BUTTON
   ═══════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  registerContext('scrollTop', () => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top -400',
      onEnter: () => btn.classList.add('is-visible'),
      onLeaveBack: () => btn.classList.remove('is-visible'),
    });
  });

  const clickHandler = () => {
    if (STATE.lenis) {
      STATE.lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  btn.addEventListener('click', clickHandler);
  onCleanup(() => {
    btn.removeEventListener('click', clickHandler);
    btn.classList.remove('is-visible');
  });
}

/* ═══════════════════════════════════════════
   MODULE: PAGE TRANSITIONS
   Listeners attach once, persist across navigations
   ═══════════════════════════════════════════ */
let pageTransitionsReady = false;

function initPageTransitions() {
  if (pageTransitionsReady) return;
  pageTransitionsReady = true;

  // Progress bar during navigation
  document.addEventListener('astro:before-preparation', () => {
    const progress = document.getElementById('page-progress');
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        { scaleX: 0.7, duration: 2, ease: 'power1.out' }
      );
    }
  });

  // Cleanup before DOM swap
  document.addEventListener('astro:before-swap', () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (STATE.lenis) {
      STATE.lenis.destroy();
      STATE.lenis = null;
    }
  });

  // Complete progress bar after swap
  document.addEventListener('astro:after-swap', () => {
    const progress = document.getElementById('page-progress');
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(progress, {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            onComplete: () => {
              gsap.set(progress, { scaleX: 0, opacity: 1 });
            },
          });
        },
      });
    }
    window.scrollTo(0, 0);
  });
}

/* ═══════════════════════════════════════════
   FALLBACK — force everything visible
   ═══════════════════════════════════════════ */
function makeEverythingVisible() {
  const sel =
    '[data-animate], [data-stagger] > *, [data-bento-item], ' +
    '[data-cta-title], [data-cta-button]';
  document.querySelectorAll(sel).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
    el.style.clipPath = 'none';
    el.style.visibility = 'visible';
  });
}

/* ═══════════════════════════════════════════
   CLEANUP — kills everything before re-init
   ═══════════════════════════════════════════ */
function cleanup() {
  // Revert all GSAP contexts
  Object.keys(STATE.contexts).forEach((key) => {
    if (STATE.contexts[key]) {
      STATE.contexts[key].revert();
      delete STATE.contexts[key];
    }
  });

  // Run manual cleanup functions
  STATE.cleanupFns.forEach((fn) => fn());
  STATE.cleanupFns = [];

  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => st.kill());
  ScrollTrigger.clearMatchMedia();

  // Destroy Lenis
  if (STATE.tickerCallback) {
    gsap.ticker.remove(STATE.tickerCallback);
    STATE.tickerCallback = null;
  }
  if (STATE.lenis) {
    STATE.lenis.destroy();
    STATE.lenis = null;
  }

  // Remove runtime classes
  document.documentElement.classList.remove(
    'has-custom-cursor',
    'is-scrolling-fast'
  );
}

/* ═══════════════════════════════════════════
   MASTER INIT — exported, called by Layout.astro
   ═══════════════════════════════════════════ */
export async function initAnimations() {
  try {
    cleanup();

    // Detect capabilities
    STATE.isDesktop = checkDesktop();
    STATE.isReducedMotion = checkReducedMotion();

    // Smooth scroll first (async — waits for Lenis import)
    await initSmoothScroll();

    // Signal that GSAP initialized (clears 3-sec fallback)
    document.documentElement.classList.add('gsap-ready');

    // Reduced motion: show everything, keep smooth scroll only
    if (STATE.isReducedMotion) {
      makeEverythingVisible();
      return;
    }

    // Wait one frame for DOM paint, then init all modules
    requestAnimationFrame(() => {
      try {
        // --- Scroll system ---
        initScrollProgress();
        initScrollVelocity();
        initSectionSnap();

        // --- Cursor & mouse effects (desktop only) ---
        initCustomCursor();
        initMagneticElements();
        initMouseBackground();

        // --- Content animations ---
        initRevealAnimations();
        initStaggerAnimations();
        initHeroAnimations();
        initCounterAnimations();
        initBentoGrid();
        initCTASection();

        // --- Movement effects ---
        initParallax();
        initHorizontalScroll();
        init3DTilt();
        initFloatingElements();
        initBlurUpImages();

        // --- UI elements ---
        initScrollToTop();
        initPageTransitions();

        // Recalculate all trigger positions
        ScrollTrigger.refresh();
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
   RESPONSIVE — re-init on desktop/mobile switch
   ═══════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const wasDesktop = STATE.isDesktop;
    STATE.isDesktop = checkDesktop();
    if (wasDesktop !== STATE.isDesktop) {
      initAnimations();
    }
    ScrollTrigger.refresh();
  }, 300);
});