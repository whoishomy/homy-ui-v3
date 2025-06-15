# useColorPresetClass Hook

The `useColorPresetClass` hook generates WCAG-compliant CSS class names for color presets with various modifiers and variants. It's designed to work seamlessly with the theme system and provides a consistent color language across UI components.

## Features

- 🎨 WCAG-compliant color presets
- 🌗 Dark mode support
- 🔄 Multiple variants (solid, subtle, muted)
- 🎯 Intensity levels (light, medium, bold, contrast)
- 🎭 Style modifiers (outlined, ghost, interactive)
- ⚡️ Memoized output for performance
- 🌈 Theme-aware class generation

## Usage

```tsx
import { useColorPresetClass } from '@/hooks/useColorPresetClass';

function MyComponent() {
  const buttonClass = useColorPresetClass({
    preset: 'primary',
    variant: 'solid',
    intensity: 'medium',
    isInteractive: true,
  });

  return <button className={buttonClass}>Click Me</button>;
}
```

## API

### Config Options

| Property      | Type           | Default  | Description                                                 |
| ------------- | -------------- | -------- | ----------------------------------------------------------- |
| preset        | ColorPreset    | required | The color preset to use ('primary', 'secondary', etc.)      |
| variant       | ColorVariant   | 'solid'  | The style variant ('solid', 'subtle', 'muted')              |
| intensity     | ColorIntensity | 'medium' | The color intensity ('light', 'medium', 'bold', 'contrast') |
| isOutlined    | boolean        | false    | Adds an outline style                                       |
| isGhost       | boolean        | false    | Makes the background transparent                            |
| isInteractive | boolean        | false    | Adds hover, active, and focus states                        |

### Color Presets

- `primary` - Main brand color
- `secondary` - Supporting brand color
- `success` - Positive actions/states
- `warning` - Cautionary actions/states
- `error` - Negative actions/states
- `info` - Informational actions/states
- `neutral` - Grayscale variations

### Variants

- `solid` - Full background color
- `subtle` - Light background with colored text
- `muted` - Transparent background with colored text

### Intensities

- `light` (100) - Subtle emphasis
- `medium` (500) - Default emphasis
- `bold` (700) - Strong emphasis
- `contrast` (900) - Maximum emphasis

## Generated CSS Classes

The hook generates a space-separated string of CSS classes following this pattern:

```css
color-{preset}
color-{preset}--{variant}
color-{preset}--{variant}-{intensity}
color-{preset}--outlined (optional)
color-{preset}--ghost (optional)
color-{preset}--interactive (optional)
color-{preset}--dark (in dark mode)
```

## Examples

```tsx
// Basic usage
const basicClass = useColorPresetClass({ preset: 'primary' });
// -> "color-primary color-primary--solid color-primary--solid-500"

// With variant and intensity
const variantClass = useColorPresetClass({
  preset: 'success',
  variant: 'subtle',
  intensity: 'bold',
});
// -> "color-success color-success--subtle color-success--subtle-700"

// Interactive button
const buttonClass = useColorPresetClass({
  preset: 'primary',
  isInteractive: true,
});
// -> "color-primary color-primary--solid color-primary--solid-500 color-primary--interactive"

// Ghost badge
const badgeClass = useColorPresetClass({
  preset: 'warning',
  isGhost: true,
});
// -> "color-warning color-warning--solid color-warning--solid-500 color-warning--ghost"
```

## Best Practices

1. Use consistent presets across similar UI elements
2. Match intensity with visual hierarchy
3. Use interactive modifier for clickable elements
4. Consider color contrast for accessibility
5. Test in both light and dark modes

## Related

- `useTheme` - Theme management hook
- `ThemeProvider` - Theme context provider
- `ColorPreset` - Color preset type definitions
