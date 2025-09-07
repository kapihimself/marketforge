# Digital Commerce Platform - UI/UX Design System & Style Guide

## 🎨 Design System Overview

This design system establishes the visual foundation for our digital commerce platform, ensuring consistency, accessibility, and scalability across all user interfaces.

## 🌈 Color Palette

### Primary Colors
```css
/* Deep Ocean Blue - Primary Brand Color */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e3a8a; /* Main Primary */
--primary-900: #1e40af;
--primary-950: #172554;
```

### Secondary Colors
```css
/* Warm Coral - Energy & Creativity */
--secondary-50: #fff1f2;
--secondary-100: #ffe4e6;
--secondary-200: #fecdd3;
--secondary-300: #fda4af;
--secondary-400: #fb7185;
--secondary-500: #f43f5e;
--secondary-600: #e11d48;
--secondary-700: #be123c;
--secondary-800: #9f1239;
--secondary-900: #881337;
--secondary-950: #4c0519;
```

### Accent Colors
```css
/* Emerald Green - Success & Growth */
--accent-50: #ecfdf5;
--accent-100: #d1fae5;
--accent-200: #a7f3d0;
--accent-300: #6ee7b7;
--accent-400: #34d399;
--accent-500: #10b981; /* Main Accent */
--accent-600: #059669;
--accent-700: #047857;
--accent-800: #065f46;
--accent-900: #064e3b;
--accent-950: #022c22;
```

### Neutral Colors
```css
/* Slate Gray - Balance & Sophistication */
--neutral-50: #f8fafc;
--neutral-100: #f1f5f9;
--neutral-200: #e2e8f0;
--neutral-300: #cbd5e1;
--neutral-400: #94a3b8;
--neutral-500: #64748b; /* Main Neutral */
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1e293b;
--neutral-900: #0f172a; /* Dark Background */
--neutral-950: #020617;
```

### Semantic Colors
```css
/* Success */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

## 📝 Typography System

### Font Families
```css
/* Primary Font - Inter (Modern, Clean, Highly Readable) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Secondary Font - JetBrains Mono (Code, Technical Content) */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

/* Display Font - Poppins (Headings, Brand Elements) */
--font-display: 'Poppins', 'Inter', sans-serif;
```

### Type Scale
```css
/* Display Styles */
--text-display-2xl: 4.5rem; /* 72px */
--text-display-xl: 3.75rem; /* 60px */
--text-display-lg: 3rem; /* 48px */

/* Heading Styles */
--text-heading-xl: 2.25rem; /* 36px */
--text-heading-lg: 1.875rem; /* 30px */
--text-heading-md: 1.5rem; /* 24px */
--text-heading-sm: 1.25rem; /* 20px */
--text-heading-xs: 1.125rem; /* 18px */

/* Body Styles */
--text-body-xl: 1.25rem; /* 20px */
--text-body-lg: 1.125rem; /* 18px */
--text-body-md: 1rem; /* 16px */
--text-body-sm: 0.875rem; /* 14px */
--text-body-xs: 0.75rem; /* 12px */

/* Caption Styles */
--text-caption-lg: 0.875rem; /* 14px */
--text-caption-md: 0.75rem; /* 12px */
--text-caption-sm: 0.625rem; /* 10px */
```

### Font Weights
```css
--font-weight-thin: 100;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Line Heights
```css
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

## 📐 Spacing System

### Spacing Scale (8px base unit)
```css
--space-0: 0;
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
--space-32: 8rem; /* 128px */
--space-40: 10rem; /* 160px */
--space-48: 12rem; /* 192px */
--space-56: 14rem; /* 224px */
--space-64: 16rem; /* 256px */
```

## 🔲 Border Radius System

```css
--radius-none: 0;
--radius-sm: 0.125rem; /* 2px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-3xl: 1.5rem; /* 24px */
--radius-full: 9999px;
```

## 🌊 Shadow System

```css
/* Light Mode Shadows */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark Mode Shadows */
--shadow-dark-xs: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dark-sm: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
--shadow-dark-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
--shadow-dark-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
```

## 🎯 Component Design Patterns

### Button Styles

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-body-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-800));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-200);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
}
```

#### CTA Button (Coral)
```css
.btn-cta {
  background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-8);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-body-lg);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.btn-cta:hover {
  background: linear-gradient(135deg, var(--secondary-600), var(--secondary-700));
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}
```

### Card Components

#### Product Card
```css
.product-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
  border-color: var(--primary-200);
}
```

#### Dashboard Card
```css
.dashboard-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary-500);
}
```

### Form Elements

#### Input Fields
```css
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-body-md);
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}
```

#### Search Bar
```css
.search-bar {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-full);
  font-size: var(--text-body-md);
  background: var(--neutral-50);
  transition: all 0.2s ease;
}

.search-input:focus {
  background: white;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-md);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px; /* Small devices */
--breakpoint-md: 768px; /* Medium devices */
--breakpoint-lg: 1024px; /* Large devices */
--breakpoint-xl: 1280px; /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

## 🌙 Dark Mode Support

### Dark Theme Colors
```css
/* Dark Mode Backgrounds */
--dark-bg-primary: var(--neutral-900);
--dark-bg-secondary: var(--neutral-800);
--dark-bg-tertiary: var(--neutral-700);

/* Dark Mode Text */
--dark-text-primary: var(--neutral-100);
--dark-text-secondary: var(--neutral-300);
--dark-text-tertiary: var(--neutral-400);

/* Dark Mode Borders */
--dark-border-primary: var(--neutral-700);
--dark-border-secondary: var(--neutral-600);
```

## ♿ Accessibility Guidelines

### Color Contrast
- **AA Compliance**: Minimum 4.5:1 contrast ratio for normal text
- **AAA Compliance**: Minimum 7:1 contrast ratio for large text
- **Focus Indicators**: High contrast focus rings for keyboard navigation

### Typography Accessibility
- **Minimum Font Size**: 16px for body text
- **Line Height**: Minimum 1.5 for readability
- **Font Weight**: Minimum 400 for body text

### Interactive Elements
- **Touch Targets**: Minimum 44px × 44px for mobile
- **Focus States**: Clear visual focus indicators
- **Hover States**: Sufficient contrast and visual feedback

## 🎨 Layout Grid System

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }
```

## 🚀 Animation & Transitions

### Timing Functions
```css
--timing-fast: 0.15s ease;
--timing-normal: 0.2s ease;
--timing-slow: 0.3s ease;
--timing-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

*This design system ensures consistency, accessibility, and scalability across all platform interfaces while maintaining the modern, trustworthy aesthetic essential for digital commerce success.*

