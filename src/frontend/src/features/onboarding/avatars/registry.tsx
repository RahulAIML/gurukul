import type { AvatarKey } from '../types/onboarding.types';
import {
  AvatarFrame,
  DurationArc,
  LevelPips,
  Physique,
  type AvatarComponent,
  type AvatarProps,
} from './primitives';

/**
 * THE AVATAR SWAP POINT.
 *
 * Every avatar is drawn here and nowhere else. Question data references an
 * `AvatarKey`; components ask this registry for a renderer. To move to
 * commissioned or rendered artwork later, replace each component body with an
 * `<img src=... />` — no question data, component or test changes.
 *
 * Figures are built from the shared `Physique` routine, so all ten share one
 * construction and read as one illustrator's hand. Their *proportions* carry
 * the meaning: broad shoulders and a tight waist read as developed, a fuller
 * midsection reads as a starting point, a lean frame reads as endurance.
 * Equipment uses the steel gradient so objects never compete with figures.
 */

/* ─────────────────────────  GENDER  ─────────────────────────
   Frames differ where they actually differ: shoulder-to-hip ratio. Male reads
   V-tapered, female hip-dominant, unspecified deliberately between the two so
   it is a real third option rather than a visually lesser one. */

const GenderMale: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => <Physique shoulder={37} waist={17} arm={9} definition pose="stand" fill={body} />}
  </AvatarFrame>
);

const GenderFemale: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => <Physique shoulder={27} waist={15} hips={29} arm={7} pose="stand" fill={body} />}
  </AvatarFrame>
);

const GenderUnspecified: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => <Physique shoulder={32} waist={18} hips={24} arm={8} pose="stand" fill={body} />}
  </AvatarFrame>
);

/* ─────────────────────────  GOAL  ───────────────────────── */

const GoalBuildMuscle: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <Physique shoulder={40} waist={16} arm={11} definition pose="flex" fill={body} />
    )}
  </AvatarFrame>
);

const GoalLoseFat: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <Physique shoulder={32} waist={24} belly={6} arm={8} pose="stride" fill={body} />
    )}
  </AvatarFrame>
);

const GoalGetStronger: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body, metal }) => (
      <>
        <Physique shoulder={39} waist={19} arm={11} definition pose="overhead" fill={body} />
        {/* loaded bar held overhead */}
        <g>
          <rect x="34" y="24" width="132" height="8" rx="4" fill={metal} />
          <rect x="40" y="12" width="9" height="32" rx="3" fill={metal} />
          <rect x="151" y="12" width="9" height="32" rx="3" fill={metal} />
        </g>
      </>
    )}
  </AvatarFrame>
);

const GoalImproveFitness: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={34} waist={17} arm={8} definition pose="stand" fill={body} />
        {/* vitality pulse, clear of the figure */}
        <path
          d="M18 58 h14 l7 -16 l9 30 l7 -14 h10"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    )}
  </AvatarFrame>
);

const GoalBuildStamina: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={30} waist={15} arm={6} pose="run" fill={body} />
        <g stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="4" strokeLinecap="round">
          <line x1="16" y1="62" x2="38" y2="62" />
          <line x1="10" y1="80" x2="28" y2="80" />
        </g>
      </>
    )}
  </AvatarFrame>
);

const GoalStartJourney: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body, metal }) => (
      <>
        {/* steps rising ahead of an average build */}
        <g fill={metal} opacity="0.55">
          <rect x="140" y="150" width="26" height="10" rx="3" />
          <rect x="152" y="132" width="26" height="10" rx="3" />
          <rect x="164" y="114" width="26" height="10" rx="3" />
        </g>
        <g transform="translate(-22 0)">
          <Physique shoulder={32} waist={20} belly={3} arm={8} pose="stride" fill={body} />
        </g>
      </>
    )}
  </AvatarFrame>
);

/* ─────────────────────────  LEVEL  ─────────────────────────
   One progression, four bodies: shoulders widen, waist tightens, definition
   appears. This is the clearest thing the avatar set does — the user can see
   which one they are without reading the label. */

const LevelBeginner: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={30} waist={23} belly={5} arm={7} pose="stand" fill={body} />
        <LevelPips filled={1} />
      </>
    )}
  </AvatarFrame>
);

const LevelSome: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={33} waist={20} belly={2} arm={8} pose="stand" fill={body} />
        <LevelPips filled={2} />
      </>
    )}
  </AvatarFrame>
);

const LevelExperienced: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={37} waist={17} arm={9} definition pose="stand" fill={body} />
        <LevelPips filled={3} />
      </>
    )}
  </AvatarFrame>
);

const LevelAdvanced: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <>
        <Physique shoulder={41} waist={15} arm={11} definition pose="flex" fill={body} />
        <LevelPips filled={4} />
      </>
    )}
  </AvatarFrame>
);

/* ─────────────────────────  LOCATION  ───────────────────────── */

const LocationGym: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        {/* squat rack, loaded */}
        <rect x="44" y="52" width="11" height="118" rx="4" fill={metal} />
        <rect x="145" y="52" width="11" height="118" rx="4" fill={metal} />
        <rect x="30" y="80" width="140" height="9" rx="4.5" fill={metal} />
        <rect x="34" y="64" width="10" height="42" rx="3" fill={metal} />
        <rect x="156" y="64" width="10" height="42" rx="3" fill={metal} />
        <rect x="55" y="124" width="90" height="7" rx="3.5" fill={metal} opacity="0.6" />
      </g>
    )}
  </AvatarFrame>
);

const LocationHome: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        <path d="M40 168 V96 L100 52 L160 96 V168 Z" fill="#FFFFFF" fillOpacity="0.07" />
        <path
          d="M40 168 V96 L100 52 L160 96 V168"
          stroke={metal}
          strokeWidth="9"
          strokeLinejoin="round"
          fill="none"
        />
        {/* rolled mat inside */}
        <rect x="78" y="132" width="44" height="20" rx="10" fill="#E4262F" />
        <line x1="100" y1="132" x2="100" y2="152" stroke="#7E0F15" strokeWidth="3" />
      </g>
    )}
  </AvatarFrame>
);

const LocationOutdoors: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        <circle cx="66" cy="60" r="20" fill="#E4262F" />
        <g stroke="#E4262F" strokeWidth="5" strokeLinecap="round" opacity="0.7">
          <line x1="66" y1="26" x2="66" y2="16" />
          <line x1="32" y1="60" x2="22" y2="60" />
          <line x1="42" y1="36" x2="35" y2="29" />
          <line x1="90" y1="36" x2="97" y2="29" />
        </g>
        {/* tree */}
        <rect x="132" y="112" width="11" height="58" rx="4" fill={metal} />
        <circle cx="137" cy="100" r="30" fill="#FFFFFF" fillOpacity="0.1" />
        <circle cx="137" cy="100" r="30" stroke={metal} strokeWidth="7" fill="none" />
        <line x1="120" y1="164" x2="180" y2="164" stroke={metal} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      </g>
    )}
  </AvatarFrame>
);

const LocationMix: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g stroke={metal} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M28 166 V112 h34 v54" />
        <path d="M78 166 V120 L100 100 L122 120 v46" />
        <path d="M164 166 v-30" />
        <circle cx="164" cy="120" r="20" />
      </g>
    )}
  </AvatarFrame>
);

/* ─────────────────────────  EQUIPMENT  ───────────────────────── */

const EquipmentFullGym: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        <rect x="40" y="46" width="11" height="124" rx="4" fill={metal} />
        <rect x="149" y="46" width="11" height="124" rx="4" fill={metal} />
        <rect x="26" y="74" width="148" height="10" rx="5" fill={metal} />
        <rect x="30" y="56" width="11" height="46" rx="3.5" fill={metal} />
        <rect x="159" y="56" width="11" height="46" rx="3.5" fill={metal} />
        <rect x="51" y="118" width="98" height="8" rx="4" fill={metal} opacity="0.75" />
        <rect x="51" y="142" width="98" height="8" rx="4" fill={metal} opacity="0.5" />
      </g>
    )}
  </AvatarFrame>
);

const EquipmentBasic: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        {/* resistance band */}
        <path
          d="M52 92 C52 50 148 50 148 92"
          stroke="#E4262F"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="38" y="84" width="26" height="14" rx="7" fill={metal} />
        <rect x="136" y="84" width="26" height="14" rx="7" fill={metal} />
        {/* rolled mat */}
        <rect x="46" y="130" width="108" height="32" rx="16" fill="#E4262F" />
        <ellipse cx="100" cy="146" rx="9" ry="15" fill="#7E0F15" />
      </g>
    )}
  </AvatarFrame>
);

const EquipmentDumbbells: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        <rect x="62" y="66" width="76" height="9" rx="4.5" fill={metal} />
        <rect x="52" y="52" width="13" height="38" rx="4" fill={metal} />
        <rect x="135" y="52" width="13" height="38" rx="4" fill={metal} />
        <g opacity="0.62">
          <rect x="72" y="124" width="56" height="8" rx="4" fill={metal} />
          <rect x="63" y="112" width="12" height="32" rx="4" fill={metal} />
          <rect x="125" y="112" width="12" height="32" rx="4" fill={metal} />
        </g>
      </g>
    )}
  </AvatarFrame>
);

const EquipmentNone: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ body }) => (
      <Physique shoulder={34} waist={17} arm={8} definition pose="open" fill={body} />
    )}
  </AvatarFrame>
);

const EquipmentMix: AvatarComponent = (p) => (
  <AvatarFrame {...p}>
    {({ metal }) => (
      <g>
        <rect x="46" y="60" width="62" height="9" rx="4.5" fill={metal} />
        <rect x="36" y="46" width="13" height="38" rx="4" fill={metal} />
        <rect x="105" y="46" width="13" height="38" rx="4" fill={metal} />
        <path
          d="M116 148 C116 116 168 116 168 148"
          stroke="#E4262F"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="34" y="132" width="72" height="26" rx="13" fill="#E4262F" opacity="0.9" />
      </g>
    )}
  </AvatarFrame>
);

/* ─────────────────────────  TIME  ───────────────────────── */

const TimeShort: AvatarComponent = (p) => (
  <AvatarFrame {...p}>{() => <DurationArc fraction={0.2} />}</AvatarFrame>
);
const TimeMedium: AvatarComponent = (p) => (
  <AvatarFrame {...p}>{() => <DurationArc fraction={0.4} />}</AvatarFrame>
);
const TimeLong: AvatarComponent = (p) => (
  <AvatarFrame {...p}>{() => <DurationArc fraction={0.65} />}</AvatarFrame>
);
const TimeExtended: AvatarComponent = (p) => (
  <AvatarFrame {...p}>{() => <DurationArc fraction={0.92} />}</AvatarFrame>
);
const TimeVaries: AvatarComponent = (p) => (
  <AvatarFrame {...p}>{() => <DurationArc fraction={1} dashed />}</AvatarFrame>
);

/* ─────────────────────────  REGISTRY  ───────────────────────── */

export const AVATARS: Record<AvatarKey, AvatarComponent> = {
  'gender-male': GenderMale,
  'gender-female': GenderFemale,
  'gender-unspecified': GenderUnspecified,

  'goal-build-muscle': GoalBuildMuscle,
  'goal-lose-fat': GoalLoseFat,
  'goal-get-stronger': GoalGetStronger,
  'goal-improve-fitness': GoalImproveFitness,
  'goal-build-stamina': GoalBuildStamina,
  'goal-start-journey': GoalStartJourney,

  'level-beginner': LevelBeginner,
  'level-some': LevelSome,
  'level-experienced': LevelExperienced,
  'level-advanced': LevelAdvanced,

  'location-gym': LocationGym,
  'location-home': LocationHome,
  'location-outdoors': LocationOutdoors,
  'location-mix': LocationMix,

  'equipment-full-gym': EquipmentFullGym,
  'equipment-basic': EquipmentBasic,
  'equipment-dumbbells': EquipmentDumbbells,
  'equipment-none': EquipmentNone,
  'equipment-mix': EquipmentMix,

  'time-short': TimeShort,
  'time-medium': TimeMedium,
  'time-long': TimeLong,
  'time-extended': TimeExtended,
  'time-varies': TimeVaries,
};

/** Renders an avatar by key. Unknown keys render nothing rather than crash. */
export function Avatar({ avatarKey, ...props }: AvatarProps & { avatarKey: AvatarKey }) {
  const Component = AVATARS[avatarKey];
  return Component ? <Component {...props} /> : null;
}
