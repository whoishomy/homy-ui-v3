# StatusBadge Component

A versatile, theme-aware badge component for displaying status indicators, labels, and interactive tags.

## Features

- 🎨 Theme-aware styling with color presets
- 🌗 Dark mode support
- 🔄 Multiple style variants
- 🎯 Optional status dot indicator
- 🎭 Interactive mode with animations
- ♿️ Full accessibility support
- 🎨 Custom className support

## Usage

```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

// Basic usage
<StatusBadge>Default</StatusBadge>

// With color preset
<StatusBadge preset="success">Success</StatusBadge>

// With status dot
<StatusBadge preset="warning" withDot>Warning</StatusBadge>

// Ghost style
<StatusBadge preset="info" ghost>Info</StatusBadge>

// Interactive with click handler
<StatusBadge
  preset="primary"
  interactive
  onClick={() => console.log('clicked')}
>
  Click me
</StatusBadge>
```

## Props

| Property    | Type        | Default   | Description                                 |
| ----------- | ----------- | --------- | ------------------------------------------- |
| children    | ReactNode   | required  | The content to display inside the badge     |
| preset      | ColorPreset | 'neutral' | Color preset for the badge                  |
| ghost       | boolean     | false     | Use ghost style (transparent background)    |
| withDot     | boolean     | false     | Show a small status dot indicator           |
| interactive | boolean     | false     | Make the badge clickable with hover effects |
| onClick     | () => void  | -         | Click handler for interactive badges        |
| className   | string      | -         | Additional CSS classes                      |
| aria-label  | string      | -         | Custom accessibility label                  |

## Color Presets

Available color presets from the theme system:

- `primary` - Main brand color
- `secondary` - Supporting brand color
- `success` - Positive status/action
- `warning` - Cautionary status/action
- `error` - Negative status/action
- `info` - Informational status
- `neutral` - Default grayscale

## Variants

### Standard Badge

```tsx
<StatusBadge preset="primary">Standard</StatusBadge>
```

### With Status Dot

```tsx
<StatusBadge preset="success" withDot>
  Online
</StatusBadge>
```

### Ghost Style

```tsx
<StatusBadge preset="info" ghost>
  Info
</StatusBadge>
```

### Interactive Badge

```tsx
<StatusBadge preset="primary" interactive onClick={() => alert('Clicked!')}>
  Click me
</StatusBadge>
```

## Accessibility

- Uses semantic `role="status"` for non-interactive badges
- Uses `role="button"` with proper keyboard navigation for interactive badges
- Supports custom `aria-label` for screen readers
- Maintains color contrast ratios for all presets
- Keyboard focus management for interactive badges

## Best Practices

1. Use consistent color presets for similar status types
2. Add `aria-label` when badge content is not descriptive enough
3. Use `withDot` for true status indicators
4. Use `ghost` style for less prominent badges
5. Make badges interactive only when they trigger an action

## Examples

### Status Indicators

```tsx
<>
  <StatusBadge preset="success" withDot>
    Online
  </StatusBadge>
  <StatusBadge preset="error" withDot>
    Offline
  </StatusBadge>
  <StatusBadge preset="warning" withDot>
    Away
  </StatusBadge>
</>
```

### Tag System

```tsx
<>
  <StatusBadge preset="primary" ghost>
    React
  </StatusBadge>
  <StatusBadge preset="secondary" ghost>
    TypeScript
  </StatusBadge>
  <StatusBadge preset="info" ghost>
    Documentation
  </StatusBadge>
</>
```

### Interactive Labels

```tsx
<>
  <StatusBadge preset="primary" interactive onClick={() => handleFilter('all')}>
    All Items
  </StatusBadge>
  <StatusBadge preset="secondary" interactive onClick={() => handleFilter('active')}>
    Active
  </StatusBadge>
</>
```

## Related Components

- `Badge` - Simple badge without status features
- `Chip` - Interactive tag with remove button
- `Alert` - For more prominent status messages
- `Tag` - For tagging and categorization
