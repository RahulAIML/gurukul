# GURUKUL Design System - Implementation Guide

This guide helps frontend developers build consistent UI using the GURUKUL design system.

---

## Quick Start

### 1. Install Tailwind (Recommended)

GURUKUL uses **Tailwind CSS** with custom configuration for the design system.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind

Update `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        gold: '#D4AF37',
        'gold-hover': '#e8c547',
        
        // Backgrounds
        'bg-dark': '#0f0f0f',
        'bg-surface': '#1a1a1a',
        
        // Text
        'text-primary': '#ffffff',
        'text-secondary': '#ccc',
        'text-tertiary': '#999',
        
        // Categories
        gym: '#3b82f6',
        english: '#10b981',
        cricket: '#0ea5e9',
      },
      fontFamily: {
        display: ['Poppins', '-apple-system', 'sans-serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '96px',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      transitionDuration: {
        fast: '200ms',
        standard: '300ms',
        slow: '400ms',
      },
    },
  },
  plugins: [],
}
```

### 3. Global Styles

Create `src/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply antialiased;
}

html, body {
  @apply bg-bg-dark text-text-primary;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

a {
  @apply text-gold hover:text-gold-hover transition-colors;
}

/* Focus states */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  @apply outline-2 outline-offset-2 outline-gold;
}

/* Selection */
::selection {
  @apply bg-gold bg-opacity-20 text-gold;
}
```

---

## Component Examples

### Button

```tsx
// components/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-md transition-all duration-300 font-body';
  
  const variantStyles = {
    primary: 'bg-gold text-black hover:brightness-110 active:brightness-95 disabled:opacity-50',
    secondary: 'border-2 border-gold text-gold hover:bg-gold hover:text-black disabled:opacity-50',
    ghost: 'text-gold hover:bg-gold hover:bg-opacity-10 disabled:opacity-50',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? '⏳ Loading...' : children}
    </button>
  );
}
```

### Card

```tsx
// components/Card.tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: 'gym' | 'english' | 'cricket' | null;
}

export function Card({ category = null, className = '', ...props }: CardProps) {
  const categoryGradients = {
    gym: 'from-blue-500/10 to-blue-500/5 border-blue-500/30',
    english: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
    cricket: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30',
    null: 'from-gold/5 to-gold/2 border-gold/20',
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${categoryGradients[category || 'null']}
        border rounded-lg backdrop-blur-sm p-6
        hover:border-gold/40 transition-all duration-300
        ${className}
      `}
      {...props}
    />
  );
}
```

### Badge

```tsx
// components/Badge.tsx
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'gym' | 'english' | 'cricket';
  size?: 'sm' | 'md';
}

export function Badge({ 
  variant = 'gold', 
  size = 'md', 
  className = '', 
  ...props 
}: BadgeProps) {
  const variantStyles = {
    gold: 'bg-gold/20 text-gold',
    gym: 'bg-blue-500/20 text-blue-400',
    english: 'bg-emerald-500/20 text-emerald-400',
    cricket: 'bg-cyan-500/20 text-cyan-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    />
  );
}
```

### Input

```tsx
// components/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`
          bg-gold/5 border border-gold/20 rounded-md
          text-text-primary placeholder:text-text-tertiary
          px-4 py-3 font-body text-sm
          focus:outline-none focus:border-gold focus:bg-gold/10
          transition-colors duration-300
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
```

### Progress Bar

```tsx
// components/ProgressBar.tsx
interface ProgressBarProps {
  value: number; // 0-100
  categoryColor?: 'gold' | 'gym' | 'english' | 'cricket';
}

export function ProgressBar({ 
  value, 
  categoryColor = 'gold' 
}: ProgressBarProps) {
  const colorMap = {
    gold: 'bg-gold',
    gym: 'bg-blue-500',
    english: 'bg-emerald-500',
    cricket: 'bg-cyan-500',
  };

  return (
    <div className="w-full h-1.5 bg-gold/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorMap[categoryColor]} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
```

### Navigation Item

```tsx
// components/NavItem.tsx
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-sm
        transition-all duration-300 font-body
        ${isActive
          ? 'bg-gold/10 border-l-4 border-gold text-gold'
          : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}
```

---

## Layout Patterns

### Hero Section

```tsx
// components/layouts/HeroSection.tsx
interface HeroSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  ctas?: Array<{ label: string; onClick: () => void; variant?: string }>;
}

export function HeroSection({ title, subtitle, ctas }: HeroSectionProps) {
  return (
    <section className="px-12 py-24 md:px-16 md:py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-lg mx-auto">
            {subtitle}
          </p>
        )}
        
        {ctas && ctas.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                variant={cta.variant as any || 'primary'}
                onClick={cta.onClick}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

### Dashboard Grid

```tsx
// components/layouts/DashboardLayout.tsx
interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-dark">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gold/10 bg-bg-surface p-8 overflow-y-auto">
        {sidebar}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 md:p-12">
        {children}
      </main>
    </div>
  );
}
```

### Category Card Grid

```tsx
// components/CategoryGrid.tsx
interface CategoryGridProps {
  categories: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: 'gym' | 'english' | 'cricket';
  }>;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <Card key={cat.id} category={cat.color}>
          <div className="text-4xl mb-4">{cat.icon}</div>
          <h3 className="font-display text-2xl font-bold mb-2">
            {cat.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {cat.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
```

---

## Common Utilities

### Apply Elevation

```tsx
// utils/cn.ts (use with clsx or classnames)
export function applyElevation(level: 'subtle' | 'small' | 'medium' | 'large') {
  const shadows = {
    subtle: 'shadow-sm',
    small: 'shadow-md',
    medium: 'shadow-lg',
    large: 'shadow-xl',
  };
  return shadows[level];
}
```

### Category Color Helper

```tsx
// utils/colors.ts
export function getCategoryColor(category: 'gym' | 'english' | 'cricket') {
  const colors = {
    gym: '#3b82f6',
    english: '#10b981',
    cricket: '#0ea5e9',
  };
  return colors[category];
}

export function getCategoryGradient(category: 'gym' | 'english' | 'cricket') {
  const gradients = {
    gym: 'from-blue-500/10 to-blue-500/5',
    english: 'from-emerald-500/10 to-emerald-500/5',
    cricket: 'from-cyan-500/10 to-cyan-500/5',
  };
  return gradients[category];
}
```

---

## Responsive Design

### Breakpoints in Tailwind

```css
/* Already configured: */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Example: Responsive Card

```tsx
<Card className="
  p-6 md:p-8 lg:p-10
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
">
  {/* Content */}
</Card>
```

### Mobile-First Approach

Always start with mobile styles, then add `md:`, `lg:`, etc.

```tsx
<div className="
  text-sm md:text-base lg:text-lg
  px-4 md:px-6 lg:px-8
  py-2 md:py-3 lg:py-4
">
  Responsive text
</div>
```

---

## Accessibility Checklist

- [ ] All buttons have `type` attribute
- [ ] All inputs have `<label>` with `htmlFor`
- [ ] Links have descriptive text (not "click here")
- [ ] Images have `alt` attributes
- [ ] Color not used as only indicator
- [ ] Focus states visible (default or custom)
- [ ] Form errors announced to screen readers
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Keyboard navigation works
- [ ] ARIA labels where needed

### Example: Accessible Button

```tsx
<button
  type="button"
  aria-label="Close modal"
  onClick={onClose}
  className="..."
>
  ✕
</button>
```

### Example: Accessible Form

```tsx
<form>
  <label htmlFor="email" className="block mb-2 font-semibold">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    placeholder="you@example.com"
    aria-describedby="email-error"
    className="..."
  />
  <span id="email-error" className="text-red-400 text-sm">
    {error}
  </span>
</form>
```

---

## Performance Tips

1. **Optimize Images**: Use WebP with PNG fallback
2. **Lazy Load**: `loading="lazy"` on off-screen images
3. **Minimize CSS**: Tailwind purges unused styles automatically
4. **Font Optimization**: Google Fonts is already optimized; consider `font-display: swap`
5. **Animations**: Use CSS `transition` over JS when possible
6. **Avoid Bloat**: Don't add every Tailwind plugin; stick to essentials

---

## Debugging

### Check Contrast
Use Chrome DevTools → Inspect → Color picker to verify contrast ratios.

### Check Spacing
Measure with `Cmd+Shift+C` → Hover elements to see computed styles.

### Check Responsiveness
Use Device Toolbar (`Cmd+Shift+M`) to test mobile, tablet, desktop.

### Tailwind IntelliSense
Install the VS Code extension for autocompletion and hover previews.

---

## Common Mistakes to Avoid

❌ **Don't**:
- Use arbitrary colors instead of design tokens
- Mix margin/padding (use gap + flex instead)
- Hardcode colors (use Tailwind variables)
- Skip focus states
- Create responsive only for one breakpoint
- Add animations that exceed 0.4s
- Use white text on light backgrounds

✓ **Do**:
- Use Tailwind classes from the config
- Use flexbox/grid with gap
- Reference `theme.colors` in Tailwind config
- Always include `:focus-visible`
- Test on mobile, tablet, desktop
- Keep animations snappy (0.2-0.3s standard)
- Use `text-text-primary` etc. for text

---

## Resources

- [Tailwind Documentation](https://tailwindcss.com/docs)
- [GURUKUL Design System](./DESIGN_SYSTEM.md)
- [Component Storybook](./storybook) (when available)
- [Figma Design File](https://figma.com/gurukul) (when available)

---

**Last Updated**: August 25, 2026  
**Version**: 1.0  
**Status**: Active
