# GURUKUL Design System

> ⚠️ **SUPERSEDED.** This file was written before the SRS had been fully reviewed and its palette/type/spacing drifted from SRS §13. It is kept for historical reference only. The canonical design system is now [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — see `docs/DESIGN_PHASE_REVIEW.md` Conflict 2 for why this changed. Do not use this file's color palette, type scale, or spacing values going forward.

> **Ancient Wisdom. Modern Guidance. Limitless Potential.**

## Vision

GURUKUL is a premium, AI-powered personal growth platform that merges ancient wisdom with cutting-edge technology. The design system reflects this duality: elegant simplicity paired with sophisticated functionality, dark mode as the foundation, and gold accents as the visual language of premium quality.

---

## Color Palette

### Primary Colors

| Color | Hex | Usage | Notes |
|-------|-----|-------|-------|
| **Gold** | #D4AF37 | Primary accent, CTAs, highlights | Premium feel, trust, wisdom |
| **Gold Hover** | #e8c547 | Interactive states, hover effects | Brighter, energetic |
| **Background Dark** | #0f0f0f | Primary background | Deep black, minimal blue tint |
| **Surface Dark** | #1a1a1a | Cards, panels, elevated surfaces | Slightly lighter than background |

### Semantic Colors (Category Specific)

| Category | Primary | Light Variant | Usage |
|----------|---------|----------------|-------|
| **Gym** | #3b82f6 (Blue) | rgba(59, 130, 246, 0.15) | Strength, energy, athleticism |
| **English** | #10b981 (Teal) | rgba(16, 185, 129, 0.15) | Growth, communication, freshness |
| **Cricket** | #0ea5e9 (Sky) | rgba(14, 165, 233, 0.15) | Dynamic, precision, outdoor |
| **Coming Soon** | #D4AF37 (Gold) | rgba(212, 175, 55, 0.1) | Premium, exclusive |

### Neutral/Gray Scale

| Use | Hex | Usage |
|-----|-----|-------|
| **Text Primary** | #ffffff | Main text, headings |
| **Text Secondary** | #ccc or #ccccccc | Body copy, descriptions |
| **Text Tertiary** | #999 or #999999 | Metadata, captions |
| **Text Disabled** | #666 or #666666 | Disabled states, dividers |
| **Border Light** | rgba(212, 175, 55, 0.1) | Subtle dividers |
| **Border Medium** | rgba(212, 175, 55, 0.2) | Card borders |
| **Border Strong** | rgba(212, 175, 55, 0.3) | Active/selected states |

### Background Patterns

- **Primary Surface**: Solid #1a1a1a
- **Enhanced Surface**: `linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%)`
- **Radial Glow**: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)`
- **Spotlight**: `radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)`

---

## Typography

### Font Families

| Use | Font | Fallback Stack | Weight | Usage |
|-----|------|-----------------|--------|-------|
| **Display** | Poppins | -apple-system, sans-serif | 700-800 | Headlines, hero text, large CTAs |
| **Body** | Inter | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif | 400-600 | Paragraphs, labels, standard text |
| **Mono** | Fira Code | monospace | 400 | Code blocks, technical copy |

**Source**: Google Fonts (`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap')`)

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|-----------------|-------|
| **H1 (Hero)** | 64px | 800 | 1.1 | -2px | Page headlines, hero section |
| **H2** | 40px | 700 | 1.2 | -1px | Section headlines |
| **H3** | 28px | 600 | 1.3 | 0 | Subsection headers, card titles |
| **H4** | 20px | 700 | 1.4 | 0 | Small section headers |
| **Body Large** | 18px | 400 | 1.6 | 0 | Prominent body copy |
| **Body Regular** | 15px | 400 | 1.5 | 0 | Standard paragraph text |
| **Body Small** | 14px | 400 | 1.5 | 0 | Secondary text, labels |
| **Caption** | 12px | 500 | 1.4 | 0.5px | Metadata, hints, captions |
| **Label** | 12px | 600 | 1.4 | 2px | Button text, tags (UPPERCASE) |

---

## Spacing System

**Base Unit: 4px**

| Scale | Size | Usage |
|-------|------|-------|
| xs | 4px | Minimal gaps |
| sm | 8px | Tight spacing |
| md | 12px | Compact spacing |
| lg | 16px | Standard padding |
| xl | 24px | Generous spacing |
| 2xl | 32px | Large sections |
| 3xl | 48px | Major sections |
| 4xl | 64px | Hero sections |
| 5xl | 96px | Page margins |

### Common Patterns

- **Button padding**: 14px vertical × 24px horizontal
- **Card padding**: 24px
- **Section padding**: 48px horizontal, 40-96px vertical
- **Gap between items**: 16px (default), 24px (sections)

---

## Component Patterns

### Buttons

#### Primary Button
```css
background: #D4AF37;
color: #000;
padding: 14px 24px;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
transition: all 0.3s;
```

**States**:
- **Hover**: brightness 1.1, transform scale(1.02)
- **Active**: brightness 0.95
- **Disabled**: opacity 0.5, cursor not-allowed

#### Secondary Button
```css
background: transparent;
color: #D4AF37;
border: 2px solid #D4AF37;
padding: 14px 24px;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
```

#### Ghost Button (Category-Specific)
```css
background: transparent;
color: [category-color];
border: 1px solid [category-color];
padding: 12px 20px;
border-radius: 6px;
```

### Cards

#### Standard Card
```css
background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%);
border: 1px solid rgba(212, 175, 55, 0.2);
border-radius: 12px;
padding: 24px;
backdrop-filter: blur(10px);
```

**Hover State**: 
- `border-color: rgba(212, 175, 55, 0.4)`
- `transform: translateY(-2px)`
- `box-shadow: 0 8px 16px rgba(212, 175, 55, 0.1)`

#### Category Card (Large)
```css
background: linear-gradient(135deg, [category-color-15%] 0%, [category-color-5%] 100%);
border: 2px solid [category-color-30%];
border-radius: 16px;
padding: 40px;
backdrop-filter: blur(10px);
```

### Progress Bar

```css
width: 100%;
height: 6px;
background: rgba(212, 175, 55, 0.1);
border-radius: 3px;
overflow: hidden;

&::after {
  content: '';
  display: block;
  width: 65%; /* % complete */
  height: 100%;
  background: #D4AF37;
  border-radius: 3px;
}
```

### Navigation

#### Sidebar Navigation Item (Active)
```css
background: rgba(212, 175, 55, 0.1);
border-left: 3px solid #D4AF37;
color: #D4AF37;
padding: 12px 16px;
border-radius: 8px;
font-weight: 500;
font-size: 14px;
```

#### Sidebar Navigation Item (Inactive)
```css
background: transparent;
color: #888;
padding: 12px 16px;
border-radius: 8px;
font-weight: 500;
font-size: 14px;
transition: all 0.3s;

&:hover {
  color: #ccc;
  background: rgba(255, 255, 255, 0.05);
}
```

### Forms

#### Input Field
```css
background: rgba(212, 175, 55, 0.05);
border: 1px solid rgba(212, 175, 55, 0.2);
color: #ffffff;
padding: 12px 16px;
border-radius: 8px;
font-size: 14px;
font-family: 'Inter', sans-serif;

&:focus {
  outline: none;
  border-color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
}

&::placeholder {
  color: #666;
}
```

#### Label
```css
font-size: 14px;
font-weight: 600;
color: #ffffff;
margin-bottom: 8px;
display: block;
```

---

## Elevation & Shadows

### Shadow Scale

| Level | CSS | Usage |
|-------|-----|-------|
| **None** | none | Flat elements |
| **Subtle** | 0 2px 4px rgba(0, 0, 0, 0.3) | Raised, hoverable |
| **Small** | 0 4px 8px rgba(0, 0, 0, 0.4) | Cards, panels |
| **Medium** | 0 8px 16px rgba(212, 175, 55, 0.1) | Modals, dropdowns |
| **Large** | 0 16px 32px rgba(212, 175, 55, 0.15) | Hero elements, callouts |

### Glow Effects

**Gold Glow** (on hover, focus):
```css
box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
```

**Category Glow** (e.g., Gym - Blue):
```css
box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
```

---

## Border Radius

| Value | Usage |
|-------|-------|
| 6px | Small elements (buttons, inputs) |
| 8px | Standard elements (cards, sections) |
| 12px | Large cards, containers |
| 16px | Hero sections, category cards |
| 50% | Circles, avatars |

---

## Animations & Transitions

### Standard Transitions

```css
transition: all 0.3s ease-out;
```

### Common Patterns

#### Hover Effects
```css
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.1);
}
```

#### Focus States
```css
&:focus {
  outline: 2px solid #D4AF37;
  outline-offset: 2px;
}
```

#### Button Press
```css
&:active {
  transform: scale(0.98);
}
```

### Animation Names

- **fadeIn**: 0.4s ease-in
- **slideUp**: 0.3s ease-out, -20px → 0px
- **glow**: 2s ease-in-out (infinite pulse on highlights)

---

## Responsive Breakpoints

| Name | Size | Usage |
|------|------|-------|
| **Mobile** | 375px - 767px | Small phones |
| **Tablet** | 768px - 1023px | Tablets, landscape phones |
| **Desktop** | 1024px+ | Desktops |
| **Wide** | 1440px+ | Large monitors |

### Grid System

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns

### Density

- **Mobile**: 16px padding, 12px gaps
- **Tablet**: 24px padding, 16px gaps
- **Desktop**: 48px padding, 24px gaps

---

## Layout Patterns

### Hero Section
```
- Background: Subtle radial gradient
- Padding: 96px vertical, 48px horizontal
- Content alignment: Center
- Max-width: 1280px
- Headline color: Mix of white (#ffffff) + gold (#D4AF37)
```

### Section with Cards (Grid)
```
- Padding: 64px vertical, 48px horizontal
- Grid columns: auto (2-4 depending on breakpoint)
- Gap: 24px (desktop), 16px (mobile)
- Card height: Auto (content-driven)
```

### Sidebar + Main Content
```
- Sidebar: 280px fixed width
- Main: Flex-grow
- Border: rgba(212, 175, 55, 0.1) 1px
- Padding: 32px sidebar, 40px main
```

---

## Accessibility

### Color Contrast

- **Text on Dark Background**: Minimum WCAG AA (4.5:1)
  - #ffffff on #0f0f0f: ✓ 18.5:1
  - #D4AF37 on #0f0f0f: ✓ 13.0:1
  - #ccc on #0f0f0f: ✓ 12.6:1

- **Text on Cards**: Maintained at card elevation
  - #ffffff on #1a1a1a: ✓ 15.9:1

### Focus States

- All interactive elements have clear 2px gold outline (offset 2px)
- Focus visible on keyboard navigation
- Never remove outline without providing alternative

### Semantic HTML

- Use `<button>` for actions (not `<div>`)
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<label>` with `for` attributes on forms
- Alt text on all images
- ARIA labels where needed

---

## Dark Mode Only

GURUKUL is dark-mode-first. No light mode is currently implemented. All colors are optimized for dark backgrounds (#0f0f0f, #1a1a1a).

### Future Light Mode (If Needed)

If a light theme is ever added:
- Invert the logic: light background (#f5f5f5), dark text (#1a1a1a)
- Keep the same hue-based accents (#D4AF37, #3b82f6, etc.)
- Maintain the same spacing and typography scale
- Ensure contrast ratios remain WCAG AA compliant

---

## Usage Guidelines

### When to Use Gold Accents

✓ **Do**:
- Primary CTA buttons
- Active navigation states
- Highlights on hover
- Important metrics
- Links
- Selected states
- Key visual separators

✗ **Don't**:
- Background fills (use rgba with low opacity)
- Large text blocks (reduces readability)
- Every interactive element (creates visual noise)
- Disabled states (use gray instead)

### When to Use Category Colors

- Category cards (Gym = Blue, English = Green, Cricket = Sky)
- Progress bars within categories
- Category-specific badges and labels
- Hover effects within category sections
- Category-specific CTAs

### Hierarchy & Emphasis

1. **Most Important**: Gold primary buttons, large headlines
2. **Important**: Category colors, white text, card elements
3. **Supporting**: Gray text, subtle borders, secondary buttons
4. **Least**: Captions, metadata, disabled states

---

## Component Checklist

Before shipping new UI:

- [ ] Dark background (#0f0f0f or #1a1a1a)
- [ ] Gold accent (#D4AF37) used purposefully
- [ ] Proper spacing (multiples of 4px)
- [ ] Correct typography scale
- [ ] Focus states for all interactive elements
- [ ] Hover effects on buttons/links
- [ ] Proper contrast ratio (4.5:1 minimum)
- [ ] Responsive at 375px, 768px, 1024px
- [ ] Smooth transitions (0.3s)
- [ ] Semantic HTML
- [ ] No layout shift on interactions

---

## Token Reference

Copy these into your CSS variables or design tokens:

```css
:root {
  /* Colors */
  --color-gold: #D4AF37;
  --color-gold-hover: #e8c547;
  --color-bg-dark: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-text: #ffffff;
  --color-text-secondary: #ccc;
  --color-text-tertiary: #999;
  --color-border-light: rgba(212, 175, 55, 0.1);
  --color-border-medium: rgba(212, 175, 55, 0.2);
  
  /* Gym Category */
  --color-gym: #3b82f6;
  --color-gym-light: rgba(59, 130, 246, 0.15);
  
  /* English Category */
  --color-english: #10b981;
  --color-english-light: rgba(16, 185, 129, 0.15);
  
  /* Cricket Category */
  --color-cricket: #0ea5e9;
  --color-cricket-light: rgba(14, 165, 233, 0.15);

  /* Typography */
  --font-display: 'Poppins', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* Transitions */
  --transition-fast: 0.2s ease-out;
  --transition-standard: 0.3s ease-out;
  --transition-slow: 0.4s ease-in-out;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 50%;
}
```

---

## Brand Voice & Messaging

- **Tone**: Premium, wise, encouraging, personal
- **Adjectives**: Ancient, modern, holistic, personalized, AI-powered
- **Avoid**: Cheesy wellness clichés, overpromising, corporate jargon
- **Key Messages**:
  - "Your personal guru, 24/7"
  - "Ancient wisdom meets modern guidance"
  - "Personalized coaching that adapts to you"
  - "Transform your potential"

---

## Questions & Contributions

For questions about this design system, refer to the main [README.md](../../README.md) and [PROJECT_STRUCTURE.md](../../PROJECT_STRUCTURE.md).

---

**Last Updated**: August 25, 2026  
**Version**: 1.0  
**Status**: Active
