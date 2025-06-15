# ThemeSwitcher Component

The `ThemeSwitcher` component is a modern, animated interface for switching between different brands and theme modes. It features a beautiful glassmorphic design with smooth transitions and responsive layout.

## Features

- 🎨 Brand Switching (HOMY, Neuro, Lab)
- 🌓 Theme Mode Toggle (Light, Dark, System)
- ✨ Framer Motion Animations
- 🖥 Responsive Design
- 🎭 Glassmorphic UI
- ♿️ Accessibility Support

## Usage

```tsx
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

function Header() {
  return (
    <nav>
      <ThemeSwitcher />
    </nav>
  );
}
```

## Design Features

### Brand Selection

- Grid layout with 3 brand options
- Icon + text combination
- Active indicator with smooth animation
- Hover and tap interactions
- Responsive sizing

### Theme Mode Toggle

- Pill-shaped toggle group
- Icon + text combination
- Active state highlighting
- System preference support
- Smooth transitions

## Animations

The component uses Framer Motion for rich interactions:

1. **Mount Animation**

   - Fade in from bottom
   - Staggered children animation
   - Smooth opacity transitions

2. **Brand Selection**

   - Scale on tap
   - Sliding active indicator
   - Hover lift effect

3. **Theme Toggle**
   - Scale on hover
   - Smooth background transitions
   - Icon fade animations

## Responsive Behavior

The component adapts to different screen sizes:

```css
/* Mobile */
- Stack layout
- Full width brand grid
- Compact spacing

/* Tablet & Desktop */
- Row layout
- Auto width brand grid
- Comfortable spacing
```

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- High contrast active states
- Screen reader friendly
- Motion reduction support

## Theme Integration

The component automatically integrates with your theme:

- Uses theme tokens for colors
- Respects dark/light mode
- Brand-specific styling
- Consistent spacing
- Typography system

## Examples

### Basic Usage

```tsx
<ThemeSwitcher />
```

### Within Navigation

```tsx
<nav
  css={css`
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  `}
>
  <ThemeSwitcher />
</nav>
```

### With Custom Styling

```tsx
<ThemeSwitcher
  css={css`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 100;
  `}
/>
```

## Technical Details

### State Management

- Uses Zustand for theme state
- Persists preferences
- System theme detection
- Smooth transitions

### Performance

- Optimized re-renders
- Lazy animations
- Efficient DOM updates
- Small bundle size

### Browser Support

- Modern browsers
- Fallback styles
- Progressive enhancement
- Mobile compatibility
