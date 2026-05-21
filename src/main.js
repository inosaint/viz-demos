import * as THREE from 'three';
import { gsap } from 'gsap';

// X/Twitter in-app browser overlays its toolbar on the viewport; bump nav up
if (/Twitter/i.test(navigator.userAgent)) {
  document.documentElement.classList.add('ua-twitter');
}
import { PD, STOP_PLANET, STOP_SIDE } from './data.js';
import { renderer, scene, camera, lookAt, planets, saturnRings, coronaMeshes, ellipsePos } from './scene.js';
import { STOP_IMAGES } from './images.js';

// ─── Camera target helpers ────────────────────────────────────────────────────
const _up      = new THREE.Vector3(0, 1, 0);
const _lookDir = new THREE.Vector3();
const _right   = new THREE.Vector3();

// Returns { pos:[x,y,z], look:[x,y,z] }.
// side: +1 = planet on right half, -1 = planet on left half.
function targetForPlanet(pi, side) {
  const p = planets[pi].position;
  const { r } = PD[pi];

  if (pi === 0) {
    const dist = r * 5, shift = r * 2.5;
    return { pos: [dist, r * 0.5, 0], look: [0, 0, side * shift] };
  }

  const len = Math.hypot(p.x, p.z) || 1;
  const pn_x = p.x / len, pn_z = p.z / len;
  // Rotate 90° CCW from outward so the sunlit hemisphere faces the camera
  const dist = r * 5.5, h = r * 1.1;
  const cx = p.x + (-pn_z) * dist;
  const cy = h;
  const cz = p.z + (pn_x) * dist;
  _lookDir.set(p.x - cx, -cy, p.z - cz).normalize();
  _right.crossVectors(_lookDir, _up).normalize();
  const shift = r * 2.8;
  return {
    pos:  [cx, cy, cz],
    look: [p.x - _right.x * side * shift, 0, p.z - _right.z * side * shift],
  };
}

// ─── Stop activation ──────────────────────────────────────────────────────────
let activeStop = 0;
let fadeInTween = null;
let trackIdx = null;
let panAngle = 0;

function activateStop(idx) {
  if (fadeInTween) fadeInTween.kill();
  trackIdx = null;
  panAngle = 0;

  // Hide all panels; mark only the new one active (controls pointer-events on mobile)
  document.querySelectorAll('.text-panel').forEach(p => {
    gsap.to(p, { opacity: 0, duration: 0.25, overwrite: true });
    p.classList.remove('active');
  });
  document.getElementById(`tp-${idx}`)?.classList.add('active');

  const sp   = STOP_PLANET[idx];
  const side = STOP_SIDE[idx];
  // On mobile, center the planet (no split-screen offset)
  const effectiveSide = window.innerWidth < 680 ? 0 : side;
  let pos, look, dur;

  if (idx === 0) {
    pos = [133, 88, 119]; look = [82, 0, 71]; dur = 2.0;
  } else if (sp === 'belt') {
    pos = [37, 24, 85]; look = [-9, 0, 68]; dur = 1.8;
  } else {
    const t = targetForPlanet(sp, effectiveSide); pos = t.pos; look = t.look;
    dur = idx === 1 ? 2.5 : 1.8;
  }

  gsap.to(camera.position, { x:pos[0], y:pos[1], z:pos[2], duration:dur, ease:'power2.inOut', overwrite:true });
  gsap.to(lookAt,           { x:look[0],y:look[1],z:look[2],duration:dur, ease:'power2.inOut', overwrite:true });

  const panel = document.getElementById(`tp-${idx}`);
  if (!panel) return;

  // Panel fades in and stays visible until the user scrolls to the next stop
  const mobile = window.innerWidth < 680;
  fadeInTween = gsap.fromTo(
    panel,
    { opacity: 0, y: (idx === 0 || mobile) ? 0 : 20 },
    { opacity: 1, y: 0, duration: idx === 0 ? 1.4 : 0.85, ease: 'power2.out', delay: dur * 0.7 }
  );

  if (typeof sp === 'number') gsap.delayedCall(dur, () => { trackIdx = sp; });

  // On mobile: position card in peek state immediately (don't wait for fade-in;
  // offsetHeight is valid even at opacity 0, and waiting creates a race where
  // a tap before the delayedCall fires animates y:0 → y:0 (no-op).
  if (window.innerWidth < 680 && idx > 0) {
    const card = panel.querySelector('.quote-card');
    if (card) {
      // Set immediately, then refresh after layout/images settle in case
      // offsetHeight changed due to gallery images loading.
      setPeek(card);
      gsap.delayedCall(0.05, () => setPeek(card));
      gsap.delayedCall(dur * 0.7 + 0.1, () => {
        if (!card.classList.contains('expanded')) setPeek(card);
      });
    }
  }
}

// ─── Arrow navigation ─────────────────────────────────────────────────────────
const TOTAL_STOPS = 12;
const navPrev = document.getElementById('nav-prev');
const navNext = document.getElementById('nav-next');

function updateNav() {
  navPrev.disabled = activeStop === 0;
  navNext.disabled = false;
  const atEnd = activeStop === TOTAL_STOPS - 1;
  navNext.textContent = atEnd ? 'back to start' : '→';
  navNext.classList.toggle('restart', atEnd);
}

function goTo(idx) {
  if (idx === activeStop) return;
  closeCards();
  activeStop = idx;
  activateStop(idx);
  updateNav();
}

function nextStop() { goTo(activeStop === TOTAL_STOPS - 1 ? 0 : activeStop + 1); }

navPrev.addEventListener('click', () => { if (activeStop > 0) goTo(activeStop - 1); });
navNext.addEventListener('click', nextStop);

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault(); nextStop();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault(); if (activeStop > 0) goTo(activeStop - 1);
  }
});

// Mobile: card peek → modal on tap, swipe-down to dismiss
// GSAP owns the card's y transform to avoid backdrop-filter/CSS-transition conflicts on iOS
const cardBackdrop = document.getElementById('card-backdrop');

// Pure DOM style manipulation — no GSAP on the card to avoid transform conflicts.
function peekY(card) {
  const h = card.offsetHeight || window.innerHeight * 0.9;
  return Math.max(0, h - window.innerHeight * 0.2);
}
function setPeek(card) {
  card.style.transition = 'none';
  card.style.transform = `translateY(${peekY(card)}px)`;
}
function openCard(card) {
  // Guarantee we start from peek before animating up
  card.style.transition = 'none';
  card.style.transform = `translateY(${peekY(card)}px)`;
  void card.offsetHeight; // force reflow so browser commits the above
  card.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
  card.style.transform = 'translateY(0)';
  card.classList.add('expanded');
  cardBackdrop.classList.add('visible');
}
function closeCards() {
  document.querySelectorAll('.quote-card.expanded').forEach(c => {
    c.classList.remove('expanded');
    c.style.transition = 'transform 0.32s ease-in';
    c.style.transform = `translateY(${peekY(c)}px)`;
  });
  cardBackdrop.classList.remove('visible');
}

// Tap backdrop to close the expanded card
cardBackdrop.addEventListener('click', closeCards);
cardBackdrop.addEventListener('touchend', (e) => { e.preventDefault(); closeCards(); }, { passive: false });

let _cardTouchY = 0;
document.querySelectorAll('.quote-card').forEach(card => {
  card.addEventListener('touchstart', e => {
    _cardTouchY = e.touches[0].clientY;
  }, { passive: true });

  card.addEventListener('touchend', e => {
    if (window.innerWidth >= 680) return;
    const dy = e.changedTouches[0].clientY - _cardTouchY;
    if (card.classList.contains('expanded')) {
      // Tap or swipe down → close
      if (Math.abs(dy) < 20 || dy > 52) { e.preventDefault(); closeCards(); }
    } else {
      // Tap or swipe up → open
      if (Math.abs(dy) < 20 || dy < -30) { e.preventDefault(); openCard(card); }
    }
  }, { passive: false });
});

// Swipe navigation (disabled when a modal card is open)
let _touchX = 0, _touchTarget = null;
window.addEventListener('touchstart', e => {
  _touchX = e.touches[0].clientX; _touchTarget = e.target;
}, { passive: true });
window.addEventListener('touchend', e => {
  if (_touchTarget?.closest?.('.quote-card.expanded')) return;
  const dx = e.changedTouches[0].clientX - _touchX;
  if (Math.abs(dx) < 60) return;
  if (dx < 0) nextStop();
  else if (dx > 0 && activeStop > 0) goTo(activeStop - 1);
}, { passive: true });

// ─── GSAP ticker — orbital motion + camera tracking + render ─────────────────
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {

  PD.forEach(({ a, e, omega, theta0, speed }, i) => {
    if (a === 0) { planets[0].rotation.y += 0.001; return; }
    const [px,, pz] = ellipsePos(a, e, omega, theta0 + time * speed);
    planets[i].position.set(px, 0, pz);
    planets[i].rotation.y += speed * 0.08;
  });

  saturnRings.forEach(r => r.position.copy(planets[6].position));

  if (trackIdx !== null) {
    panAngle += 0.0008; // ~2.75°/s — slow cinematic orbit
    const side = window.innerWidth < 680 ? 0 : STOP_SIDE[activeStop];
    const t = targetForPlanet(trackIdx, side);
    const pl = planets[trackIdx].position;
    // Rotate camera and lookAt around the planet by panAngle
    const cp = Math.cos(panAngle), sp = Math.sin(panAngle);
    const dxc = t.pos[0] - pl.x,  dzc = t.pos[2] - pl.z;
    const dxl = t.look[0] - pl.x, dzl = t.look[2] - pl.z;
    const tx = pl.x + dxc * cp - dzc * sp;
    const tz = pl.z + dxc * sp + dzc * cp;
    const lx = pl.x + dxl * cp - dzl * sp;
    const lz = pl.z + dxl * sp + dzl * cp;
    camera.position.x += (tx - camera.position.x) * 0.012;
    camera.position.y += (t.pos[1] - camera.position.y) * 0.012;
    camera.position.z += (tz - camera.position.z) * 0.012;
    lookAt.x += (lx - lookAt.x) * 0.04;
    lookAt.y += (t.look[1] - lookAt.y) * 0.04;
    lookAt.z += (lz - lookAt.z) * 0.04;
  }

  const pulse = 1 + Math.sin(time * 1.1) * 0.04;
  coronaMeshes.forEach(m => m.scale.setScalar(pulse));

  camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  renderer.render(scene, camera);
});

// ─── Resize ───────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Inject NASA image galleries into each panel below the planet name
STOP_IMAGES.forEach((images, stop) => {
  if (!images) return;
  const panel = document.getElementById(`tp-${stop}`);
  if (!panel) return;
  const h2 = panel.querySelector('h2');
  if (!h2) return;
  const div = document.createElement('div');
  div.className = 'img-gallery';
  images.forEach(({ id, alt }) => {
    const img = document.createElement('img');
    img.src = `https://images-assets.nasa.gov/image/${id}/${id}~thumb.jpg`;
    img.alt = alt;
    img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    div.appendChild(img);
  });
  h2.insertAdjacentElement('afterend', div);
});

updateNav();
activateStop(0);
