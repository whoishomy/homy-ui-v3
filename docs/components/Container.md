# Container Component

The Container component is a fundamental layout element that helps control content width and horizontal padding across your application.

## Features

- Maximum width control with predefined breakpoints
- Consistent horizontal padding
- Center alignment option
- Semantic HTML element support
- Framer Motion integration
- Theme token integration

## Usage

```tsx
import { Container } from '@/components/ui/layout/Container';

// Basic usage
<Container>
  <YourContent />
</Container>

// Custom max-width and padding
<Container maxWidth="xl" padding="lg">
  <YourContent />
</Container>

// As a semantic element
<Container as="main" maxWidth="2xl">
  <YourContent />
</Container>
```

## Props

| Prop       | Type                                                      | Default | Description                    |
| ---------- | --------------------------------------------------------- | ------- | ------------------------------ |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'`  | Maximum width of the container |
| `padding`  | `'none' \| 'sm' \| 'md' \| 'lg'`                          | `'md'`  | Horizontal padding             |
| `center`   | `boolean`                                                 | `true`  | Whether to center horizontally |
| `as`       | `keyof JSX.IntrinsicElements`                             | `'div'` | HTML element to render         |

## Examples

### Different Max Widths

```tsx
<Container maxWidth="sm">
  Small container
</Container>

<Container maxWidth="lg">
  Large container
</Container>

<Container maxWidth="full">
  Full-width container
</Container>
```

### Padding Variants

```tsx
<Container padding="sm">
  Small padding
</Container>

<Container padding="lg">
  Large padding
</Container>

<Container padding="none">
  No padding
</Container>
```

### Semantic HTML

```tsx
<Container as="main">
  Main content
</Container>

<Container as="section">
  Section content
</Container>

<Container as="article">
  Article content
</Container>
```

## Best Practices

1. Use appropriate semantic elements with the `as` prop
2. Choose the right `maxWidth` for your content type
3. Keep padding consistent across similar sections
4. Consider mobile viewports when selecting padding sizes

## Accessibility

- Uses semantic HTML through the `as` prop
- Maintains proper content width for readability
- Ensures consistent spacing for visual hierarchy

## Design Tokens

The Container component uses the following theme tokens:

```typescript
theme.tokens.container.maxWidth.{size} // For maximum widths
theme.tokens.spacing.scale.{size}      // For padding
```
