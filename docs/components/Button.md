# Button Component

The Button component is a versatile and customizable button element that follows our design system's token-based approach. It supports various visual styles, sizes, states, and interactive features.

## Features

- Multiple color presets (primary, success, warning, error, info)
- Different visual variants (solid, outline, ghost, link)
- Size options (small, medium, large)
- Loading state with spinner
- Icon support (left and right)
- Full width option
- Interactive animations
- Disabled state
- WCAG compliant contrast ratios
- Dark mode support

## Usage

```tsx
import { Button } from '@/components/ui/button/Button';

// Basic usage
<Button>Click me</Button>

// With color preset
<Button preset="primary">Primary</Button>
<Button preset="success">Success</Button>
<Button preset="warning">Warning</Button>

// With variants
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Loading</Button>

// With icons
<Button leftIcon={<Icon />} rightIcon={<Icon />}>
  With Icons
</Button>

// Full width
<Button isFullWidth>Full Width</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Without animations
<Button interactive={false}>No Animations</Button>
```

## Props

| Prop          | Type                                        | Default     | Description                            |
| ------------- | ------------------------------------------- | ----------- | -------------------------------------- |
| `preset`      | `ColorPreset`                               | `'primary'` | Color preset for the button            |
| `variant`     | `'solid' \| 'outline' \| 'ghost' \| 'link'` | `'solid'`   | Visual variant of the button           |
| `size`        | `'sm' \| 'md' \| 'lg'`                      | `'md'`      | Size of the button                     |
| `isLoading`   | `boolean`                                   | `false`     | Whether the button is in loading state |
| `leftIcon`    | `ReactNode`                                 | -           | Icon to show before the button text    |
| `rightIcon`   | `ReactNode`                                 | -           | Icon to show after the button text     |
| `isFullWidth` | `boolean`                                   | `false`     | Whether to show full width button      |
| `interactive` | `boolean`                                   | `true`      | Whether to show interactive animations |

Plus all native button element props.

## Design Tokens

The Button component uses the following design tokens:

### Typography

- `typography.scale.sm`: Font size for small buttons
- `typography.scale.md`: Font size for medium buttons
- `typography.scale.lg`: Font size for large buttons
- `typography.weight.semibold`: Font weight for button text
- `typography.weight.medium`: Font weight for link variant

### Spacing

- `spacing.scale.sm`: Gap between button content elements
- `spacing.scale.md`: Padding for medium buttons
- `spacing.scale.lg`: Padding for large buttons

### Colors

- Uses color presets from the theme system
- Automatically handles dark/light mode variations
- Ensures WCAG compliant contrast ratios

### Border Radius

- `borderRadius.md`: Border radius for all button variants

## Examples

### Color Presets

```tsx
<>
  <Button preset="primary">Primary</Button>
  <Button preset="success">Success</Button>
  <Button preset="warning">Warning</Button>
  <Button preset="error">Error</Button>
  <Button preset="info">Info</Button>
</>
```

### Variants

```tsx
<>
  <Button variant="solid">Solid</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</>
```

### Sizes

```tsx
<>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</>
```

### States

```tsx
<>
  <Button isLoading>Loading</Button>
  <Button disabled>Disabled</Button>
  <Button isFullWidth>Full Width</Button>
</>
```

## Accessibility

- Uses native `button` element
- Maintains WCAG AA compliant contrast ratios
- Provides visual feedback for interactions
- Properly handles disabled states
- Includes loading state indicator
- Supports keyboard navigation

## Best Practices

1. Use appropriate color presets for different actions:

   - `primary`: Main actions
   - `success`: Positive actions
   - `error`: Destructive actions
   - `warning`: Cautionary actions
   - `info`: Informational actions

2. Choose variants based on hierarchy:

   - `solid`: Primary actions
   - `outline`: Secondary actions
   - `ghost`: Tertiary actions
   - `link`: Navigation or subtle actions

3. Select sizes based on context:

   - `sm`: Compact UIs, inline actions
   - `md`: Standard actions
   - `lg`: Call to action, important buttons

4. Use loading state for async actions:

   ```tsx
   const [isLoading, setIsLoading] = useState(false);

   const handleClick = async () => {
     setIsLoading(true);
     await someAsyncAction();
     setIsLoading(false);
   };

   return (
     <Button isLoading={isLoading} onClick={handleClick}>
       Submit
     </Button>
   );
   ```

5. Provide clear and concise labels:

   ```tsx
   // Good
   <Button>Save Changes</Button>

   // Bad
   <Button>Click Here</Button>
   ```

## Related Components

- `IconButton`: For icon-only buttons
- `ButtonGroup`: For grouped button actions
- `ToggleButton`: For toggle actions
- `MenuButton`: For dropdown menus
