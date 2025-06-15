# Stack Component

The Stack component is a layout primitive that makes it easy to stack elements together and apply consistent spacing between them. It provides a flexible way to manage layout in both vertical and horizontal directions, with support for responsive spacing, alignment, and dividers.

## Features

- Vertical and horizontal stacking
- Reverse direction support
- Responsive spacing
- Flexible alignment and justification
- Optional dividers
- Wrap support for overflow
- Framer Motion integration
- Theme token integration
- Semantic HTML support
- ARIA-compliant dividers

## Usage

```tsx
import { Stack } from '@/components/ui/layout/Stack';

// Basic vertical stack
<Stack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Horizontal stack with spacing
<Stack direction="horizontal" spacing="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Responsive spacing
<Stack
  spacing={{
    sm: 'xs',
    md: 'md',
    lg: 'xl'
  }}
>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// With dividers
<Stack divider>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```

## Props

| Prop        | Type                                                         | Default      | Description                 |
| ----------- | ------------------------------------------------------------ | ------------ | --------------------------- |
| `direction` | `'vertical' \| 'horizontal'`                                 | `'vertical'` | Stack direction             |
| `reverse`   | `boolean`                                                    | `false`      | Reverse item order          |
| `spacing`   | `StackSpacing \| Record<'sm' \| 'md' \| 'lg', StackSpacing>` | `'md'`       | Space between items         |
| `wrap`      | `boolean`                                                    | `false`      | Enable wrapping             |
| `divider`   | `boolean \| React.ReactNode`                                 | `false`      | Show dividers between items |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch'`                  | `'stretch'`  | Cross-axis alignment        |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around'`      | `'start'`    | Main-axis alignment         |
| `as`        | `keyof JSX.IntrinsicElements`                                | `'div'`      | HTML element to render      |

## Examples

### Direction and Spacing

```tsx
// Vertical stack (default)
<Stack spacing="lg">
  <div>First item</div>
  <div>Second item</div>
</Stack>

// Horizontal stack
<Stack direction="horizontal" spacing="md">
  <div>Side by side</div>
  <div>Items</div>
</Stack>

// Reverse order
<Stack reverse>
  <div>Appears last</div>
  <div>Appears first</div>
</Stack>
```

### Alignment and Justification

```tsx
// Center items
<Stack align="center" justify="center">
  <div>Centered</div>
  <div>Content</div>
</Stack>

// Space between items
<Stack justify="between">
  <div>Left</div>
  <div>Right</div>
</Stack>

// End alignment
<Stack align="end">
  <div>Aligned</div>
  <div>To End</div>
</Stack>
```

### Custom Dividers

```tsx
// Default dividers
<Stack divider>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Custom divider element
<Stack divider={<hr style={{ margin: 0 }} />}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

### Responsive Design

```tsx
// Responsive spacing
<Stack
  spacing={{
    sm: 'xs',  // Small screens
    md: 'md',  // Medium screens
    lg: 'xl'   // Large screens
  }}
>
  <div>Responsive</div>
  <div>Spacing</div>
</Stack>

// Direction switch with wrap
<Stack
  direction="horizontal"
  wrap
  spacing="md"
>
  <div>Wraps</div>
  <div>When</div>
  <div>Needed</div>
</Stack>
```

## Best Practices

1. **Semantic Structure**: Use the `as` prop to maintain semantic HTML structure

   ```tsx
   <Stack as="section">
     <h2>Section Title</h2>
     <p>Content</p>
   </Stack>
   ```

2. **Responsive Spacing**: Use responsive spacing for better mobile experience

   ```tsx
   <Stack
     spacing={{
       sm: 'xs',
       md: 'md',
       lg: 'lg',
     }}
   >
     {/* Content */}
   </Stack>
   ```

3. **Nesting**: Stack components can be nested for complex layouts

   ```tsx
   <Stack>
     <Stack direction="horizontal">
       <div>Nested</div>
       <div>Layout</div>
     </Stack>
     <div>Content</div>
   </Stack>
   ```

4. **Accessibility**: Use semantic HTML and ARIA attributes when needed

   ```tsx
   <Stack as="nav" role="navigation">
     <a href="/">Home</a>
     <a href="/about">About</a>
   </Stack>
   ```

## Related Components

- `Container` - For maximum width and padding control
- `Grid` - For grid-based layouts
- `Flex` - For more complex flex layouts
