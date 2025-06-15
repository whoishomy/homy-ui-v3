# TrademarkText Component

The `TrademarkText` component is a theme-aware, responsive text component that supports brand-specific styling, dark mode, and animations.

## Features

- 🎨 Theme Integration
- 📱 Responsive Design
- 🌓 Dark Mode Support
- ✨ Framer Motion Animations
- ♿️ Accessibility Support
- 🎯 Type-safe Props

## Usage

```tsx
import { TrademarkText } from '@/components/ui/TrademarkText';

function BrandedHeading() {
  return (
    <TrademarkText variant="title" showSymbol animate>
      HOMY
    </TrademarkText>
  );
}
```

## Props

| Prop         | Type                              | Default     | Description                          |
| ------------ | --------------------------------- | ----------- | ------------------------------------ |
| `children`   | `React.ReactNode`                 | Required    | The text content to display          |
| `variant`    | `'title' \| 'subtitle' \| 'body'` | `'body'`    | Text style variant                   |
| `showSymbol` | `boolean`                         | `true`      | Whether to show the trademark symbol |
| `animate`    | `boolean`                         | `true`      | Enable/disable animations            |
| `options`    | `Partial<TrademarkVisualKit>`     | `undefined` | Custom visual styling                |
| `className`  | `string`                          | `undefined` | Additional CSS classes               |

## Variants

### Title

- Font Size: 40px (lg) / 32px (md) / 24px (sm)
- Font Weight: 700
- Letter Spacing: -0.03em
- Line Height: 1.2

### Subtitle

- Font Size: 28px (lg) / 24px (md) / 18px (sm)
- Font Weight: 500
- Letter Spacing: -0.02em
- Line Height: 1.3

### Body

- Font Size: 18px (lg) / 16px (md) / 14px (sm)
- Font Weight: 400
- Letter Spacing: -0.01em
- Line Height: 1.5

## Theme Integration

The component automatically integrates with your brand's theme:

```tsx
// Custom theme options
<TrademarkText
  options={{
    visualIdentity: {
      colors: { primary: '#FF0000' },
      typography: {
        fontSize: '16px',
        fontWeight: 400,
      },
      spacing: {
        padding: '0',
        margin: '0',
      },
    },
  }}
>
  Custom Styled Text
</TrademarkText>
```

## Animations

The component uses Framer Motion for smooth transitions:

- Text fade-in and slide-up on mount
- Trademark symbol scale animation
- Smooth color transitions for dark mode
- Hover state animations

## Accessibility

- Proper font scaling for readability
- Color contrast compliance
- Smooth animations (respects reduced motion preferences)
- Screen reader friendly

## Examples

### Basic Usage

```tsx
<TrademarkText>Hello World</TrademarkText>
```

### Title with Animation

```tsx
<TrademarkText variant="title" animate>
  Welcome to HOMY
</TrademarkText>
```

### Custom Styled Subtitle

```tsx
<TrademarkText
  variant="subtitle"
  options={{
    visualIdentity: {
      colors: { primary: '#4A90E2' },
    },
  }}
>
  Innovation Hub
</TrademarkText>
```

### Static Body Text

```tsx
<TrademarkText variant="body" animate={false} showSymbol={false}>
  Regular content without animations or trademark symbol
</TrademarkText>
```
