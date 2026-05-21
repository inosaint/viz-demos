import * as THREE from 'three';
import { PD } from './data.js';
import { T } from './textures.js';

// ─── Renderer / scene / camera ────────────────────────────────────────────────
export const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(133, 88, 119);

// Tweened each frame by GSAP; camera.lookAt() applied in ticker
export const lookAt = { x: 82, y: 0, z: 71 };

// ─── Lights ───────────────────────────────────────────────────────────────────
// decay:0 = no distance falloff, so every planet sees the same sunlight intensity
scene.add(new THREE.PointLight(0xfff5e0, 4, 0, 0));
scene.add(new THREE.AmbientLight(0x202245, 0.25));

// ─── Shared round sprite for Points (avoids default square quads) ─────────────
const _circleSprite = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 16;
  const g = c.getContext('2d');
  g.beginPath(); g.arc(8, 8, 7, 0, Math.PI * 2);
  g.fillStyle = '#fff'; g.fill();
  return new THREE.CanvasTexture(c);
})();

// ─── Stars ────────────────────────────────────────────────────────────────────
{
  const n = 12000, pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - 0.5) * 3000;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.45, map: _circleSprite, transparent: true, alphaTest: 0.5 })));
}

// ─── Orbit math ───────────────────────────────────────────────────────────────
export function ellipsePos(a, e, omega, theta) {
  const b  = a * Math.sqrt(1 - e * e);
  const c  = a * e;
  const xO = a * Math.cos(theta) - c;
  const zO = b * Math.sin(theta);
  const cw = Math.cos(omega), sw = Math.sin(omega);
  return [xO * cw - zO * sw, 0, xO * sw + zO * cw];
}

function makeOrbitLine(a, e, omega) {
  const pts = [];
  for (let i = 0; i <= 256; i++) {
    const [x,, z] = ellipsePos(a, e, omega, (i / 256) * Math.PI * 2);
    pts.push(new THREE.Vector3(x, 0, z));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })
  );
}

// ─── Planet meshes ────────────────────────────────────────────────────────────
export const planets = PD.map(({ name, a, e, omega, theta0, r }, i) => {
  const mat = i === 0
    ? new THREE.MeshBasicMaterial({ map: T[name] })
    : new THREE.MeshStandardMaterial({ map: T[name], roughness: 0.85 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 64), mat);
  if (a > 0) {
    const [px,, pz] = ellipsePos(a, e, omega, theta0);
    mesh.position.set(px, 0, pz);
  }
  scene.add(mesh);
  return mesh;
});

// Orbit lines
PD.filter(p => p.a > 0).forEach(({ a, e, omega }) => scene.add(makeOrbitLine(a, e, omega)));

// ─── Asteroid belt ────────────────────────────────────────────────────────────
{
  const n = 4000, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 63 + Math.random() * 12 + Math.sin(angle * 3) * 2.5;
    pos[i*3]   = r * Math.cos(angle);
    pos[i*3+1] = (Math.random() - 0.5) * 0.9;
    pos[i*3+2] = r * Math.sin(angle);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x888888, size: 0.18, map: _circleSprite, transparent: true, alphaTest: 0.5 })));
}

// ─── Sun corona (for sun r=10) ────────────────────────────────────────────────
export const coronaMeshes = [14, 20, 28].map((r, i) => {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(r, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xff8800, transparent: true,
      opacity: 0.05 - i * 0.012,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  scene.add(m); return m;
});

// ─── Saturn rings (for saturn r=4.8) ─────────────────────────────────────────
export const saturnRings = [
  { i: 5.9, o: 7.4,  c: 0xc89030, op: 0.55 },
  { i: 7.9, o: 9.4,  c: 0xd4a840, op: 0.70 },
  { i: 9.8, o:10.9,  c: 0xb87828, op: 0.35 },
].map(({ i, o, c, op }) => {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(i, o, 128),
    new THREE.MeshBasicMaterial({ color:c, side:THREE.DoubleSide, transparent:true, opacity:op, depthWrite:false })
  );
  m.rotation.x = Math.PI * 0.42;
  scene.add(m); return m;
});
