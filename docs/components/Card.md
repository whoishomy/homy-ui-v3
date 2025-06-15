# Card Component

The Card component is a versatile container that groups related content and actions. It provides a flexible way to organize information with support for various visual styles and interactive states.

## Features

- Multiple visual variants (elevated, outlined, flat)
- Color preset support
- Interactive states with hover and click animations
- Responsive width control
- Customizable padding
- Semantic HTML roles
- Framer Motion animations
- Dark mode support
- ARIA-compliant

## Installation

The Card component is part of the core UI components and is available out of the box.

```tsx
import { Card } from '@/components/ui/Card';
```

## Props

| Prop          | Type                                 | Default      | Description                     |
| ------------- | ------------------------------------ | ------------ | ------------------------------- |
| `variant`     | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Visual variant of the card      |
| `preset`      | `ColorPreset`                        | `'neutral'`  | Color preset for the card       |
| `interactive` | `boolean`                            | `false`      | Whether the card is interactive |
| `isFullWidth` | `boolean`                            | `false`      | Whether to show full width card |
| `padding`     | `'sm' \| 'md' \| 'lg'`               | `'md'`       | Custom padding size             |
| `role`        | `'group' \| 'region' \| 'article'`   | `'group'`    | ARIA role for the card          |

Plus all native div element props.

## Examples

### Basic Usage

```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content goes here.</p>
</Card>
```

### Visual Variants

```tsx
// Elevated Card (Default)
<Card variant="elevated">
  Elevated Card with shadow
</Card>

// Outlined Card
<Card variant="outlined">
  Outlined Card with border
</Card>

// Flat Card
<Card variant="flat">
  Flat Card without border
</Card>
```

### Interactive Card

```tsx
<Card interactive onClick={() => console.log('Card clicked')}>
  Click me! I have hover and click animations.
</Card>
```

### Color Presets

```tsx
<Card preset="primary">
  Primary colored card
</Card>

<Card preset="success">
  Success colored card
</Card>
```

### Custom Padding

```tsx
<Card padding="sm">
  Compact card with small padding
</Card>

<Card padding="lg">
  Spacious card with large padding
</Card>
```

### Full Width

```tsx
<Card isFullWidth>This card takes up 100% of its container width</Card>
```

### Semantic Roles

```tsx
<Card role="region" aria-label="Important Information">
  Content that represents a distinct region
</Card>

<Card role="article">
  Content that represents a self-contained article
</Card>
```

## Best Practices

1. **Semantic HTML**: Use appropriate ARIA roles based on the card's content and purpose.
2. **Interactive States**: Only use the `interactive` prop when the card itself is clickable.
3. **Color Presets**: Use color presets consistently across your application for visual coherence.
4. **Padding**: Choose padding size based on content density and hierarchy.
5. **Width**: Use `isFullWidth` when the card needs to fill its container, especially in responsive layouts.

## Accessibility

- Cards use semantic HTML roles for better screen reader support
- Interactive cards have proper focus states and keyboard navigation
- Color contrast ratios follow WCAG guidelines
- Motion animations respect user's reduced motion preferences

## Related Components

- `Button` - Often used within cards for actions
- `ThemeSwitcher` - For testing different color presets
- `Typography` - For consistent text styling within cards
