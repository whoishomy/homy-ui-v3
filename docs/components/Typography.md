# Typography Components

Typography components provide a consistent and accessible way to style text content across your application. The system includes three main components: Heading, Text, and CodeBlock.

## Features

- Token-based typography system
- Multiple size and weight options
- Text alignment control
- Truncation support
- Dark mode support
- Semantic HTML elements
- ARIA-compliant
- Line number support for code blocks
- Syntax highlighting ready

## Components

### Heading

The Heading component is used for section titles and content hierarchy.

```tsx
import { Heading } from '@/components/ui/Typography';

<Heading as="h1" size="2xl">
  Main Title
</Heading>;
```

#### Heading Props

| Prop       | Type                                                     | Default      | Description                       |
| ---------- | -------------------------------------------------------- | ------------ | --------------------------------- |
| `as`       | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'`           | `'h2'`       | HTML heading level                |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'md'`       | Visual size of the heading        |
| `weight`   | `'normal' \| 'medium' \| 'semibold' \| 'bold'`           | `'semibold'` | Font weight                       |
| `align`    | `'left' \| 'center' \| 'right'`                          | `'left'`     | Text alignment                    |
| `noMargin` | `boolean`                                                | `false`      | Whether to trim margin            |
| `truncate` | `boolean`                                                | `false`      | Whether to truncate with ellipsis |

### Text

The Text component is used for paragraphs and general text content.

```tsx
import { Text } from '@/components/ui/Typography';

<Text variant="muted" size="sm">
  Secondary information with smaller text
</Text>;
```

#### Text Props

| Prop       | Type                                             | Default     | Description                       |
| ---------- | ------------------------------------------------ | ----------- | --------------------------------- |
| `as`       | `keyof JSX.IntrinsicElements`                    | `'p'`       | HTML element to render            |
| `variant`  | `'default' \| 'muted' \| 'emphasized' \| 'code'` | `'default'` | Visual variant                    |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg'`                   | `'md'`      | Text size                         |
| `weight`   | `'normal' \| 'medium' \| 'semibold' \| 'bold'`   | `'normal'`  | Font weight                       |
| `align`    | `'left' \| 'center' \| 'right'`                  | `'left'`    | Text alignment                    |
| `noMargin` | `boolean`                                        | `false`     | Whether to trim margin            |
| `truncate` | `boolean`                                        | `false`     | Whether to truncate with ellipsis |

### CodeBlock

The CodeBlock component is used for displaying code snippets and technical content.

```tsx
import { CodeBlock } from '@/components/ui/Typography';

<CodeBlock language="typescript" showLineNumbers>
  const greeting = 'Hello, World!'; console.log(greeting);
</CodeBlock>;
```

#### CodeBlock Props

| Prop              | Type                   | Default   | Description                                  |
| ----------------- | ---------------------- | --------- | -------------------------------------------- |
| `variant`         | `'inline' \| 'block'`  | `'block'` | Visual variant                               |
| `size`            | `'sm' \| 'md' \| 'lg'` | `'md'`    | Text size                                    |
| `showLineNumbers` | `boolean`              | `false`   | Whether to show line numbers                 |
| `wrap`            | `boolean`              | `false`   | Whether to enable word wrap                  |
| `language`        | `string`               | -         | Programming language for syntax highlighting |

## Examples

### Heading Variants

```tsx
<Heading as="h1" size="3xl">Main Title</Heading>
<Heading as="h2" size="2xl">Section Title</Heading>
<Heading as="h3" size="xl">Subsection Title</Heading>
<Heading as="h4" size="lg">Group Title</Heading>
```

### Text Variants

```tsx
<Text>Default text content</Text>
<Text variant="muted">Secondary information</Text>
<Text variant="emphasized">Important information</Text>
<Text variant="code">inline code</Text>
```

### CodeBlock Variants

```tsx
// Inline code
<CodeBlock variant="inline">npm install @homy/ui</CodeBlock>

// Block code with line numbers
<CodeBlock
  variant="block"
  showLineNumbers
  language="typescript"
>
  function greet(name: string) {
    return `Hello, ${name}!`;
  }
</CodeBlock>
```

## Best Practices

1. **Semantic HTML**: Use appropriate heading levels (`h1`-`h6`) to maintain content hierarchy.
2. **Consistent Sizing**: Use the size prop consistently across your application.
3. **Responsive Text**: Consider using smaller sizes on mobile devices.
4. **Color Contrast**: Ensure text colors meet WCAG contrast requirements.
5. **Line Length**: Keep line lengths readable (around 60-80 characters).

## Accessibility

- Proper heading hierarchy with `h1`-`h6` elements
- Semantic HTML elements
- ARIA-compliant markup
- Sufficient color contrast
- Readable font sizes
- Proper line height for readability

## Design System Integration

Typography components are fundamental building blocks that should be used consistently across your application:

- Use `Heading` for all section titles
- Use `Text` for body content and descriptions
- Use `CodeBlock` for technical content and code examples
- Maintain consistent spacing with the `noMargin` prop
- Follow the established size hierarchy

## Related Components

- `Alert` - Uses Typography components for content
- `Card` - Often contains Typography components
- `Dialog` - Uses Typography for headers and content
- `Button` - Uses Typography tokens for text styling
