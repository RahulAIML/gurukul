/**
 * Generates the figure-based and duration illustrations from the canon in
 * docs/ILLUSTRATION_SYSTEM.md.
 *
 * Figures are generated rather than hand-drawn because consistency IS the
 * system: every body in the set must come off the same armature, and the only
 * things allowed to vary are shoulder/waist/hip width, limb thickness and
 * pose. Hand-authoring thirteen figures guarantees drift.
 *
 * Environments and equipment are hand-authored (they share no armature) and
 * live directly in the asset folders.
 *
 *   node scripts/generate-illustrations.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'src', 'assets', 'illustrations', 'onboarding');

/* ── canon (160 canvas) ───────────────────────────────────────────── */
const CX = 80;
const CROWN = 14;
const HEAD_CY = 22;
const HEAD_RX = 7;
const HEAD_RY = 8.4;
const SHOULDER = 38;
const CHEST = 46;
const WAIST = 65;
const HIP = 78;
const KNEE = 110;
const SOLE = 142;
const FLOOR = 142;

const n = (v) => Number(v.toFixed(1));

const floor = (x1 = 34, x2 = 126) =>
  `  <line x1="${x1}" y1="${FLOOR}" x2="${x2}" y2="${FLOOR}" stroke="var(--ill-neutral)" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`;

/* ── torso ────────────────────────────────────────────────────────── */
function torso({ shoulder: sh, waist: w, belly: b = 0, hips }) {
  const hp = hips ?? w + 4;
  return `  <path d="M${n(CX - sh)} ${SHOULDER} C${n(CX - sh - 1)} ${CHEST + 1} ${n(CX - w - b - 4)} ${WAIST - 14} ${n(CX - w - b)} ${WAIST} C${n(CX - w - b + 1)} ${WAIST + 6} ${n(CX - hp)} ${HIP - 8} ${n(CX - hp)} ${HIP + 1} L${n(CX + hp)} ${HIP + 1} C${n(CX + hp)} ${HIP - 8} ${n(CX + w + b - 1)} ${WAIST + 6} ${n(CX + w + b)} ${WAIST} C${n(CX + w + b + 4)} ${WAIST - 14} ${n(CX + sh + 1)} ${CHEST + 1} ${n(CX + sh)} ${SHOULDER} C${n(CX + sh - 5)} ${SHOULDER - 5} ${CX + 7} ${SHOULDER - 7} ${CX + 5} ${SHOULDER - 8} L${CX - 5} ${SHOULDER - 8} C${CX - 7} ${SHOULDER - 7} ${n(CX - sh + 5)} ${SHOULDER - 5} ${n(CX - sh)} ${SHOULDER} Z" fill="currentColor"/>`;
}

const headNeck = () =>
  `  <rect x="${CX - 4}" y="${HEAD_CY + 7}" width="8" height="10" fill="currentColor"/>\n` +
  `  <ellipse cx="${CX}" cy="${HEAD_CY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="currentColor"/>`;

const rim = ({ shoulder: sh, waist: w, belly: b = 0 }) =>
  `  <path d="M${n(CX - sh + 2)} ${SHOULDER + 2} C${n(CX - sh + 1)} ${CHEST + 4} ${n(CX - w - b - 2)} ${WAIST - 12} ${n(CX - w - b + 1)} ${WAIST - 2}" stroke="#FFFFFF" stroke-opacity="0.26" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

const definition = ({ shoulder: sh }) =>
  `  <path d="M${n(CX - sh + 8)} ${CHEST} Q${CX} ${CHEST + 8} ${n(CX + sh - 8)} ${CHEST}" stroke="#000000" stroke-opacity="0.26" stroke-width="2.5" stroke-linecap="round" fill="none"/>\n` +
  `  <line x1="${CX}" y1="${CHEST + 8}" x2="${CX}" y2="${WAIST - 5}" stroke="#000000" stroke-opacity="0.26" stroke-width="2.5" stroke-linecap="round"/>`;

/* ── limbs: polyline + width, so joints stay round and never spike ── */
const limb = (pts, width) =>
  `  <path d="M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L')}" stroke="currentColor" stroke-width="${n(width)}" stroke-linecap="round" fill="none"/>`;

function arms(pose, sh, a) {
  const L = CX - sh + 2;
  const R = CX + sh - 2;
  switch (pose) {
    case 'flex':
      return [
        limb([[L, SHOULDER + 2], [L - 12, CHEST + 12]], a * 1.35),
        limb([[L - 12, CHEST + 12], [L - 5, SHOULDER - 4]], a * 1.2),
        limb([[R, SHOULDER + 2], [R + 12, CHEST + 12]], a * 1.35),
        limb([[R + 12, CHEST + 12], [R + 5, SHOULDER - 4]], a * 1.2),
      ];
    case 'overhead':
      return [
        limb([[L, SHOULDER + 2], [L - 4, SHOULDER - 14], [L - 1, CROWN - 2]], a * 1.25),
        limb([[R, SHOULDER + 2], [R + 4, SHOULDER - 14], [R + 1, CROWN - 2]], a * 1.25),
      ];
    case 'stride':
      return [
        limb([[L, SHOULDER + 2], [L - 6, CHEST + 14], [L - 3, WAIST + 12]], a * 1.2),
        limb([[R, SHOULDER + 2], [R + 8, CHEST + 4], [R + 13, SHOULDER - 1]], a * 1.2),
      ];
    case 'run':
      return [
        limb([[L, SHOULDER + 2], [L - 11, CHEST - 1], [L - 7, SHOULDER - 10]], a * 1.2),
        limb([[R, SHOULDER + 2], [R + 9, CHEST + 13], [R + 4, WAIST + 10]], a * 1.2),
      ];
    case 'open':
      return [
        limb([[L, SHOULDER + 2], [L - 12, SHOULDER - 4], [L - 25, SHOULDER - 12]], a * 1.2),
        limb([[R, SHOULDER + 2], [R + 12, SHOULDER - 4], [R + 25, SHOULDER - 12]], a * 1.2),
      ];
    default: // stand
      return [
        limb([[L, SHOULDER + 2], [L - 4, CHEST + 16], [L - 6, WAIST + 12]], a * 1.2),
        limb([[R, SHOULDER + 2], [R + 4, CHEST + 16], [R + 6, WAIST + 12]], a * 1.2),
      ];
  }
}

function legs(pose, hp, a) {
  const L = CX - hp * 0.5;
  const R = CX + hp * 0.5;
  const w = a * 1.7;
  switch (pose) {
    case 'stride':
      return [
        limb([[L, HIP], [L - 7, KNEE], [L - 13, SOLE - 3]], w),
        limb([[R, HIP], [R + 7, KNEE], [R + 12, SOLE - 3]], w),
      ];
    case 'run':
      return [
        limb([[L, HIP], [L - 13, KNEE - 8], [L - 7, SOLE - 10]], w),
        limb([[R, HIP], [R + 12, KNEE + 3], [R + 20, SOLE - 8]], w),
      ];
    default:
      return [
        limb([[L, HIP], [L - 1, KNEE], [L, SOLE - 3]], w),
        limb([[R, HIP], [R + 1, KNEE], [R, SOLE - 3]], w),
      ];
  }
}

function figure(spec, extras = { behind: [], front: [] }) {
  const { shoulder: sh, waist: w, belly = 0, hips, arm: a = 7, pose = 'stand', definition: def } = spec;
  const hp = hips ?? w + 4;
  const body = [
    ...legs(pose, hp, a),
    ...arms(pose, sh, a),
    torso(spec),
    headNeck(),
    ...(def ? [definition(spec)] : []),
    rim(spec),
  ];
  return [floor(), ...(extras.behind ?? []), ...body, ...(extras.front ?? [])].join('\n');
}

function svg(name, note, inner) {
  return `<svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <!-- GURUKUL ILLUSTRATION SYSTEM — ${name}\n       ${note}\n       GENERATED by scripts/generate-illustrations.mjs — edit the spec there,\n       not this file. Accent = currentColor, structure = var(--ill-neutral). -->\n\n${inner}\n</svg>\n`;
}

function write(rel, name, note, inner) {
  const path = join(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg(name, note, inner), 'utf8');
  return rel;
}

/* ── abstract cues, drawn behind the figure ───────────────────────── */
const chevrons = (x, y, count, gap = 14) =>
  Array.from({ length: count }, (_, i) =>
    `  <path d="M${x} ${y + i * gap} L${x + 10} ${y - 10 + i * gap} L${x + 20} ${y + i * gap}" stroke="var(--ill-neutral)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="${(0.55 - i * 0.16).toFixed(2)}"/>`,
  );

const speedMarks = (x, y) => [
  `  <line x1="${x}" y1="${y}" x2="${x + 20}" y2="${y}" stroke="var(--ill-neutral)" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`,
  `  <line x1="${x - 6}" y1="${y + 15}" x2="${x + 11}" y2="${y + 15}" stroke="var(--ill-neutral)" stroke-width="4" stroke-linecap="round" opacity="0.3"/>`,
];

const steps = () => [
  `  <path d="M112 138 h20 v-14 h20 v-14 h16" stroke="var(--ill-neutral)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.55" fill="none"/>`,
];

const pulse = () => [
  `  <path d="M18 52 h12 l6 -14 l8 26 l6 -12 h9" stroke="var(--ill-neutral)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.55" fill="none"/>`,
];

const bar = (y) => [
  `  <rect x="20" y="${y}" width="120" height="8" rx="4" fill="currentColor"/>`,
  `  <rect x="22" y="${y - 12}" width="9" height="32" rx="3.5" fill="currentColor"/>`,
  `  <rect x="129" y="${y - 12}" width="9" height="32" rx="3.5" fill="currentColor"/>`,
];

/* ── the set ──────────────────────────────────────────────────────── */
const written = [];

// people — frames differ only where they actually differ: shoulder-to-hip ratio
written.push(write('people/people-male.svg', 'people/people-male',
  'V-tapered frame. No facial features anywhere in the people set.',
  figure({ shoulder: 27, waist: 15, arm: 7, definition: true })));

written.push(write('people/people-female.svg', 'people/people-female',
  'Hip-dominant frame: hips wider than shoulders.',
  figure({ shoulder: 21, waist: 13.5, hips: 24, arm: 6 })));

written.push(write('people/people-neutral.svg', 'people/people-neutral',
  'Deliberately between the other two, so it is a real third option.',
  figure({ shoulder: 24, waist: 15, hips: 19, arm: 6.5 })));

// goals — pose plus at most one abstract cue; never an icon bolted on
written.push(write('goals/goal-build-muscle.svg', 'goals/goal-build-muscle',
  'Broad shoulders, tight waist, arms flexed. Rising chevrons for growth.',
  figure({ shoulder: 29, waist: 14, arm: 8, pose: 'flex', definition: true },
    { behind: chevrons(112, 56, 2) })));

written.push(write('goals/goal-lose-fat.svg', 'goals/goal-lose-fat',
  'Fuller midsection in motion. Movement is the message, not a smaller body.',
  figure({ shoulder: 24, waist: 21, belly: 5, arm: 7, pose: 'stride' },
    { behind: speedMarks(18, 58) })));

written.push(write('goals/goal-get-stronger.svg', 'goals/goal-get-stronger',
  'Overhead press: a loaded bar is the clearest read for raw strength.',
  figure({ shoulder: 29, waist: 16, arm: 8, pose: 'overhead', definition: true },
    { front: bar(20) })));

written.push(write('goals/goal-improve-fitness.svg', 'goals/goal-improve-fitness',
  'Balanced athletic frame with a vitality pulse.',
  figure({ shoulder: 25, waist: 15, arm: 7, definition: true },
    { behind: pulse() })));

written.push(write('goals/goal-build-stamina.svg', 'goals/goal-build-stamina',
  'Lean runner mid-drive with trailing speed marks.',
  figure({ shoulder: 22, waist: 13, arm: 5.5, pose: 'run' },
    { behind: speedMarks(16, 54) })));

written.push(write('goals/goal-start-journey.svg', 'goals/goal-start-journey',
  'Average build stepping toward rising steps. A beginning, not a deficit.',
  figure({ shoulder: 24, waist: 17, belly: 2, arm: 7, pose: 'stride' },
    { behind: steps() })));

// fitness level — one progression; the beginner is a healthy average frame
written.push(write('fitness-level/level-beginner.svg', 'fitness-level/level-beginner',
  'Healthy average frame. Never drawn weak, unhealthy or smaller.',
  figure({ shoulder: 21.5, waist: 19.5, belly: 4.5, arm: 6 })));

written.push(write('fitness-level/level-some.svg', 'fitness-level/level-some',
  'Step two: shoulders a touch broader, midsection flatter.',
  figure({ shoulder: 25, waist: 16.5, belly: 1.5, arm: 7 })));

written.push(write('fitness-level/level-experienced.svg', 'fitness-level/level-experienced',
  'Step three: definition appears.',
  figure({ shoulder: 28, waist: 14, arm: 8, definition: true })));

written.push(write('fitness-level/level-advanced.svg', 'fitness-level/level-advanced',
  'Step four: the most developed frame, arms flexed.',
  figure({ shoulder: 31.5, waist: 12.5, arm: 9.5, pose: 'flex', definition: true })));

// equipment-none is a figure, not an object — bodyweight training
written.push(write('equipment/equipment-none.svg', 'equipment/equipment-none',
  'Bodyweight: open arms, nothing held. A figure because there is no object.',
  figure({ shoulder: 25, waist: 15, arm: 7, pose: 'open', definition: true })));

// time — duration as a proportion. One number generates the family.
const CIRC = 2 * Math.PI * 40;
function duration(fraction, dashed = false) {
  const arc = dashed
    ? `stroke-dasharray="10 16"`
    : `stroke-dasharray="${n(CIRC * fraction)} ${n(CIRC)}"`;
  return [
    floor(),
    `  <circle cx="80" cy="66" r="40" stroke="var(--ill-neutral)" stroke-width="11" opacity="0.35"/>`,
    `  <circle cx="80" cy="66" r="40" stroke="currentColor" stroke-width="11" stroke-linecap="round" ${arc} transform="rotate(-90 80 66)"/>`,
    `  <circle cx="80" cy="66" r="6" fill="#FFFFFF" fill-opacity="0.9"/>`,
    `  <path d="M80 66 V44" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="6" stroke-linecap="round"/>`,
    `  <path d="M80 66 L97 76" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="6" stroke-linecap="round"/>`,
    `  <rect x="40" y="122" width="80" height="8" rx="4" fill="var(--ill-neutral)" opacity="0.35"/>`,
    dashed
      ? `  <rect x="40" y="122" width="80" height="8" rx="4" fill="currentColor" opacity="0.45"/>`
      : `  <rect x="40" y="122" width="${n(80 * fraction)}" height="8" rx="4" fill="currentColor"/>`,
  ].join('\n');
}

written.push(write('time/time-20-min.svg', 'time/time-20-min', 'One third of an hour.', duration(1 / 3)));
written.push(write('time/time-30-min.svg', 'time/time-30-min', 'Half an hour.', duration(0.5)));
written.push(write('time/time-45-min.svg', 'time/time-45-min', 'Three quarters.', duration(0.75)));
written.push(write('time/time-60-min.svg', 'time/time-60-min', 'A full hour or more.', duration(0.97)));
written.push(write('time/time-varies.svg', 'time/time-varies', 'Dashed: no fixed duration.', duration(1, true)));

console.log(`generated ${written.length} illustrations`);
written.forEach((w) => console.log('  ' + w));
