import { useId, type ReactNode } from 'react';

export interface AvatarProps {
  /** Rendered size in px (square). */
  size?: number;
  selected?: boolean;
  className?: string;
}

export type AvatarComponent = (props: AvatarProps) => JSX.Element;

/** Gradient ids are generated per instance, so children receive them. */
export interface AvatarPaints {
  /** Body gradient — pass as a fill. */
  body: string;
  /** Steel gradient for equipment. */
  metal: string;
}

/**
 * Shared ground for every avatar: a soft ember glow behind the subject and a
 * contact shadow beneath it. One frame for all twenty-four drawings is what
 * makes them read as a single commissioned set rather than assorted clip-art.
 */
export function AvatarFrame({
  size = 96,
  selected = false,
  className,
  children,
}: AvatarProps & { children: (paints: AvatarPaints) => ReactNode }) {
  const uid = useId().replace(/:/g, '');
  const glow = `glow-${uid}`;
  const body = `body-${uid}`;
  const metal = `metal-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ opacity: selected ? 1 : 0.82, transition: 'opacity 180ms ease-out' }}
    >
      <defs>
        <radialGradient id={glow} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#E4262F" stopOpacity={selected ? 0.4 : 0.22} />
          <stop offset="55%" stopColor="#E4262F" stopOpacity={selected ? 0.11 : 0.05} />
          <stop offset="100%" stopColor="#E4262F" stopOpacity="0" />
        </radialGradient>

        {/* Body: lit from upper-left, falling to deep red in shadow. The
            gradient is what turns a flat silhouette into a form. */}
        <linearGradient id={body} x1="16%" y1="2%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#FF7B80" />
          <stop offset="38%" stopColor="#E4262F" />
          <stop offset="100%" stopColor="#780E14" />
        </linearGradient>

        {/* Equipment: cool steel, so objects never compete with the figures. */}
        <linearGradient id={metal} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#E8E8F0" />
          <stop offset="48%" stopColor="#9A9AA8" />
          <stop offset="100%" stopColor="#4A4A57" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="94" rx="86" ry="82" fill={`url(#${glow})`} />
      <ellipse cx="100" cy="180" rx="42" ry="6" fill="#000000" opacity={selected ? 0.5 : 0.34} />

      {children({ body: `url(#${body})`, metal: `url(#${metal})` })}
    </svg>
  );
}

export interface PhysiqueProps {
  /** Half-width of the shoulders. 26 lean → 40 broad. */
  shoulder: number;
  /** Half-width at the navel. 13 tight → 26 full. */
  waist: number;
  /** Extra roundness at the midsection, 0 flat → 8 full. */
  belly?: number;
  /** Limb thickness. 5 slim → 10 heavy. */
  arm?: number;
  /** Half-width at the hips. Defaults to waist + 4 (a V-taper frame).
   *  Setting it above `shoulder` gives a hip-dominant frame. */
  hips?: number;
  /** Suggest muscle separation with interior shading. */
  definition?: boolean;
  pose?: 'stand' | 'flex' | 'overhead' | 'stride' | 'run' | 'open';
  /** Gradient supplied by AvatarFrame. */
  fill: string;
}

type Joint = [x: number, y: number, width: number];

/**
 * One limb SEGMENT as a tapered quad — thigh thicker than knee, bicep thicker
 * than wrist. Limbs are built from separate segments with a joint circle at
 * each articulation, rather than one polygon threaded through every point: a
 * single polygon self-intersects the moment a limb doubles back on itself
 * (a flexed bicep, a driving arm), which renders as a spike.
 */
function segment([x1, y1, w1]: Joint, [x2, y2, w2]: Joint): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular unit vector — offsetting along it keeps diagonal limbs even
  const px = -dy / len;
  const py = dx / len;
  const a = `${(x1 + px * (w1 / 2)).toFixed(1)},${(y1 + py * (w1 / 2)).toFixed(1)}`;
  const b = `${(x2 + px * (w2 / 2)).toFixed(1)},${(y2 + py * (w2 / 2)).toFixed(1)}`;
  const c = `${(x2 - px * (w2 / 2)).toFixed(1)},${(y2 - py * (w2 / 2)).toFixed(1)}`;
  const d = `${(x1 - px * (w1 / 2)).toFixed(1)},${(y1 - py * (w1 / 2)).toFixed(1)}`;
  return `M ${a} L ${b} L ${c} L ${d} Z`;
}

/** An articulated limb: segments plus a circle at every joint. */
function Limb({ joints }: { joints: Joint[] }) {
  return (
    <>
      {joints.slice(0, -1).map((j, i) => (
        <path key={`s${i}`} d={segment(j, joints[i + 1])} />
      ))}
      {joints.map(([x, y, w], i) => (
        <circle key={`j${i}`} cx={x} cy={y} r={w / 2} />
      ))}
    </>
  );
}

/**
 * ANATOMY CANON.
 *
 * Eight head-heights from crown (18) to sole (178) — standard adult
 * proportion. The head is ~20px on a 160px figure and the hips sit at the
 * halfway mark. Oversizing the head and shortening the legs is precisely what
 * makes a stylised figure read as a child, so both stay honest here.
 */
const CROWN = 18;
const HEAD_H = 20;
const HEAD_CY = CROWN + HEAD_H / 2; //  28
const SHOULDER_Y = CROWN + HEAD_H * 1.5; //  48
const CHEST_Y = CROWN + HEAD_H * 2; //  58
const WAIST_Y = CROWN + HEAD_H * 3.2; //  82
const HIP_Y = CROWN + HEAD_H * 4; //  98
const KNEE_Y = CROWN + HEAD_H * 6; // 138
const SOLE_Y = CROWN + HEAD_H * 8; // 178

export function Physique({
  shoulder,
  waist,
  belly = 0,
  arm = 7,
  hips,
  definition = false,
  pose = 'stand',
  fill,
}: PhysiqueProps) {
  const cx = 100;
  const hip = hips ?? waist + 4;

  // Torso: trapezius slope → deltoid → lat taper → waist → hip.
  const torso = [
    `M ${cx - shoulder} ${SHOULDER_Y}`,
    `C ${cx - shoulder - 1} ${CHEST_Y + 2} ${cx - waist - belly - 5} ${WAIST_Y - 16} ${cx - waist - belly} ${WAIST_Y}`,
    `C ${cx - waist - belly + 1} ${WAIST_Y + 8} ${cx - hip} ${HIP_Y - 9} ${cx - hip} ${HIP_Y + 2}`,
    `L ${cx + hip} ${HIP_Y + 2}`,
    `C ${cx + hip} ${HIP_Y - 9} ${cx + waist + belly - 1} ${WAIST_Y + 8} ${cx + waist + belly} ${WAIST_Y}`,
    `C ${cx + waist + belly + 5} ${WAIST_Y - 16} ${cx + shoulder + 1} ${CHEST_Y + 2} ${cx + shoulder} ${SHOULDER_Y}`,
    `C ${cx + shoulder - 7} ${SHOULDER_Y - 6} ${cx + 9} ${SHOULDER_Y - 9} ${cx + 6} ${SHOULDER_Y - 10}`,
    `L ${cx - 6} ${SHOULDER_Y - 10}`,
    `C ${cx - 9} ${SHOULDER_Y - 9} ${cx - shoulder + 7} ${SHOULDER_Y - 6} ${cx - shoulder} ${SHOULDER_Y}`,
    'Z',
  ].join(' ');

  return (
    <g>
      {/* limbs behind the torso so shoulder and hip joints read cleanly */}
      <g fill={fill}>
        {LEG_POSES[pose](cx, hip, arm)}
        {ARM_POSES[pose](cx, shoulder, arm)}
      </g>

      <path d={torso} fill={fill} />

      {/* neck, then head above the trapezius */}
      <path d={`M ${cx - 5} ${SHOULDER_Y - 8} h 10 v -10 h -10 Z`} fill={fill} />
      <ellipse cx={cx} cy={HEAD_CY} rx="9" ry="10.5" fill={fill} />

      {definition && (
        <g stroke="#000000" strokeOpacity="0.28" strokeWidth="1.9" strokeLinecap="round" fill="none">
          <path d={`M ${cx - shoulder + 9} ${CHEST_Y + 1} Q ${cx} ${CHEST_Y + 9} ${cx + shoulder - 9} ${CHEST_Y + 1}`} />
          <line x1={cx} y1={CHEST_Y + 9} x2={cx} y2={WAIST_Y - 6} />
          <line x1={cx - 8} y1={CHEST_Y + 16} x2={cx + 8} y2={CHEST_Y + 16} />
          <line x1={cx - 7} y1={CHEST_Y + 24} x2={cx + 7} y2={CHEST_Y + 24} />
        </g>
      )}

      {/* rim light down the lit edge */}
      <path
        d={`M ${cx - shoulder + 3} ${SHOULDER_Y + 4} C ${cx - shoulder + 1} ${CHEST_Y + 6} ${cx - waist - belly - 2} ${WAIST_Y - 13} ${cx - waist - belly + 1} ${WAIST_Y - 2}`}
        stroke="#FFFFFF"
        strokeOpacity="0.26"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

type LimbSet = (cx: number, span: number, arm: number) => ReactNode;

/* Arms hang from the actual deltoid (`span` = shoulder half-width), so broader
   bodies get correspondingly wider arm placement. Upper arm and forearm are
   separate segments, which is what lets a limb fold back without artefacts. */
const ARM_POSES: Record<NonNullable<PhysiqueProps['pose']>, LimbSet> = {
  stand: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.15], [cx - s - 3, CHEST_Y + 16, a * 0.9], [cx - s - 5, WAIST_Y + 14, a * 0.68]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.15], [cx + s + 3, CHEST_Y + 16, a * 0.9], [cx + s + 5, WAIST_Y + 14, a * 0.68]]} />
    </>
  ),
  flex: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.2], [cx - s - 12, CHEST_Y + 12, a * 1.15], [cx - s - 7, SHOULDER_Y - 9, a * 0.75]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.2], [cx + s + 12, CHEST_Y + 12, a * 1.15], [cx + s + 7, SHOULDER_Y - 9, a * 0.75]]} />
    </>
  ),
  overhead: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.15], [cx - s - 4, SHOULDER_Y - 18, a * 0.95], [cx - s - 1, CROWN - 6, a * 0.7]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.15], [cx + s + 4, SHOULDER_Y - 18, a * 0.95], [cx + s + 1, CROWN - 6, a * 0.7]]} />
    </>
  ),
  stride: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.15], [cx - s - 7, CHEST_Y + 16, a * 0.9], [cx - s - 3, WAIST_Y + 16, a * 0.68]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.15], [cx + s + 9, CHEST_Y + 6, a * 0.9], [cx + s + 15, SHOULDER_Y - 2, a * 0.68]]} />
    </>
  ),
  run: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.15], [cx - s - 13, CHEST_Y, a * 0.9], [cx - s - 8, SHOULDER_Y - 13, a * 0.68]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.15], [cx + s + 10, CHEST_Y + 15, a * 0.9], [cx + s + 4, WAIST_Y + 13, a * 0.68]]} />
    </>
  ),
  open: (cx, s, a) => (
    <>
      <Limb joints={[[cx - s + 1, SHOULDER_Y + 2, a * 1.15], [cx - s - 14, SHOULDER_Y - 5, a * 0.9], [cx - s - 29, SHOULDER_Y - 15, a * 0.68]]} />
      <Limb joints={[[cx + s - 1, SHOULDER_Y + 2, a * 1.15], [cx + s + 14, SHOULDER_Y - 5, a * 0.9], [cx + s + 29, SHOULDER_Y - 15, a * 0.68]]} />
    </>
  ),
};

/* Thigh is the thickest segment on the body; the calf narrows to a slim ankle.
   Hips sit at the halfway point, so these are long. */
const LEG_POSES: Record<NonNullable<PhysiqueProps['pose']>, LimbSet> = {
  stand: (cx, h, a) => (
    <>
      <Limb joints={[[cx - h * 0.54, HIP_Y - 2, a * 1.75], [cx - h * 0.52, KNEE_Y, a * 1.2], [cx - h * 0.52, SOLE_Y - 5, a * 0.82]]} />
      <Limb joints={[[cx + h * 0.54, HIP_Y - 2, a * 1.75], [cx + h * 0.52, KNEE_Y, a * 1.2], [cx + h * 0.52, SOLE_Y - 5, a * 0.82]]} />
      <ellipse cx={cx - h * 0.52} cy={SOLE_Y - 2} rx={a * 0.8} ry={a * 0.4} />
      <ellipse cx={cx + h * 0.52} cy={SOLE_Y - 2} rx={a * 0.8} ry={a * 0.4} />
    </>
  ),
  flex: (cx, h, a) => LEG_POSES.stand(cx, h, a),
  overhead: (cx, h, a) => LEG_POSES.stand(cx, h, a),
  open: (cx, h, a) => LEG_POSES.stand(cx, h, a),
  stride: (cx, h, a) => (
    <>
      <Limb joints={[[cx - h * 0.5, HIP_Y - 2, a * 1.75], [cx - h - 7, KNEE_Y, a * 1.2], [cx - h - 14, SOLE_Y - 5, a * 0.82]]} />
      <Limb joints={[[cx + h * 0.5, HIP_Y - 2, a * 1.75], [cx + h + 7, KNEE_Y, a * 1.2], [cx + h + 13, SOLE_Y - 5, a * 0.82]]} />
      <ellipse cx={cx - h - 15} cy={SOLE_Y - 2} rx={a * 0.8} ry={a * 0.4} />
      <ellipse cx={cx + h + 14} cy={SOLE_Y - 2} rx={a * 0.8} ry={a * 0.4} />
    </>
  ),
  run: (cx, h, a) => (
    <>
      <Limb joints={[[cx - h * 0.5, HIP_Y - 2, a * 1.75], [cx - h - 15, KNEE_Y - 10, a * 1.2], [cx - h - 8, SOLE_Y - 14, a * 0.82]]} />
      <Limb joints={[[cx + h * 0.5, HIP_Y - 2, a * 1.75], [cx + h + 14, KNEE_Y + 3, a * 1.2], [cx + h + 23, SOLE_Y - 10, a * 0.82]]} />
    </>
  ),
};

/** Duration gauge shared by the five "time" avatars — one arc, five fills. */
export function DurationArc({ fraction, dashed = false }: { fraction: number; dashed?: boolean }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <g transform="translate(100 100)">
      <circle cx="0" cy="0" r={r} stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="10" fill="none" />
      <circle
        cx="0"
        cy="0"
        r={r}
        stroke="#E4262F"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={dashed ? '10 16' : `${c * fraction} ${c}`}
        transform="rotate(-90)"
      />
      <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
      <line x1="0" y1="0" x2="0" y2="-24" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      <line x1="0" y1="0" x2="18" y2="10" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

/** Experience pips shared by the four "level" avatars. */
export function LevelPips({ filled }: { filled: number }) {
  return (
    <g transform="translate(100 192)">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={(i - 2) * 15 + 3}
          y="-3"
          width="12"
          height="5"
          rx="2.5"
          fill={i < filled ? '#E4262F' : '#FFFFFF'}
          fillOpacity={i < filled ? 1 : 0.16}
        />
      ))}
    </g>
  );
}
