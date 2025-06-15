# Grid Component

The Grid component is a powerful layout primitive that helps you create responsive grid layouts with ease. It provides a flexible way to arrange content in a grid system with support for responsive columns, spacing, and alignment.

## Features

- 12-column grid system
- Responsive columns and spacing
- Auto-fit and auto-fill modes
- Column flow direction control
- Flexible alignment options
- Framer Motion integration
- Theme token integration
- Semantic HTML support
- ARIA-compliant

## Usage

```tsx
import { Grid } from '@/components/ui/layout/Grid';

// Basic 12-column grid
<Grid>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</Grid>

// Specific column count
<Grid columns={3}>
  <div>1/3</div>
  <div>1/3</div>
  <div>1/3</div>
</Grid>

// Responsive columns
<Grid
  columns={{
    sm: 1,    // 1 column on small screens
    md: 2,    // 2 columns on medium screens
    lg: 3     // 3 columns on large screens
  }}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Auto-fit with minimum width
<Grid minChildWidth="200px" autoFit>
  <div>Auto-fit item</div>
  <div>Auto-fit item</div>
  <div>Auto-fit item</div>
</Grid>
```

## Props

| Prop            | Type                                                       | Default     | Description                     |
| --------------- | ---------------------------------------------------------- | ----------- | ------------------------------- |
| `columns`       | `GridColumns \| Record<'sm' \| 'md' \| 'lg', GridColumns>` | `12`        | Number of grid columns          |
| `spacing`       | `GridSpacing \| Record<'sm' \| 'md' \| 'lg', GridSpacing>` | `'md'`      | Space between grid items        |
| `minChildWidth` | `string`                                                   | -           | Minimum width of each column    |
| `align`         | `'start' \| 'center' \| 'end' \| 'stretch'`                | `'stretch'` | Vertical alignment of items     |
| `justify`       | `'start' \| 'center' \| 'end' \| 'between' \| 'around'`    | `'start'`   | Horizontal alignment of items   |
| `flowColumn`    | `boolean`                                                  | `false`     | Whether to flow items by column |
| `autoFit`       | `boolean`                                                  | `false`     | Enable auto-fit columns         |
| `autoFill`      | `boolean`                                                  | `false`     | Enable auto-fill columns        |
| `as`            | `keyof JSX.IntrinsicElements`                              | `'div'`     | HTML element to render          |

## Examples

### Responsive Grid Layout

```tsx
// Different column counts at different breakpoints
<Grid
  columns={{
    sm: 2,
    md: 3,
    lg: 4,
  }}
  spacing={{
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }}
>
  {items.map((item) => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</Grid>
```

### Auto-fit Grid

```tsx
// Automatically fit as many columns as possible
<Grid minChildWidth="250px" autoFit spacing="lg">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>
```

### Grid with Alignment

```tsx
// Center-aligned grid with space between
<Grid columns={3} align="center" justify="between" spacing="lg">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</Grid>
```

### Column Flow

```tsx
// Items flow down columns instead of across rows
<Grid columns={3} flowColumn spacing="md">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</Grid>
```

## Best Practices

1. **Responsive Design**

   ```tsx
   // Adapt to different screen sizes
   <Grid
     columns={{
       sm: 1,
       md: 2,
       lg: 3,
     }}
     spacing={{
       sm: 'sm',
       md: 'md',
       lg: 'lg',
     }}
   >
     {/* Content */}
   </Grid>
   ```

2. **Auto-fit for Dynamic Content**

   ```tsx
   // Let the grid determine the optimal column count
   <Grid minChildWidth="200px" autoFit spacing="md">
     {dynamicItems.map((item) => (
       <div key={item.id}>{item.content}</div>
     ))}
   </Grid>
   ```

3. **Semantic Structure**

   ```tsx
   // Use appropriate HTML elements
   <Grid as="section" role="region" aria-label="Product Grid">
     {products.map((product) => (
       <article key={product.id}>{product.content}</article>
     ))}
   </Grid>
   ```

4. **Consistent Spacing**

   ```tsx
   // Use theme tokens for spacing
   <Grid spacing="lg">{/* This will use the theme's large spacing scale */}</Grid>
   ```

## Accessibility

- Use semantic HTML elements with the `as` prop
- Provide ARIA labels for grid sections when needed
- Ensure sufficient spacing for touch targets
- Maintain a logical tab order

## Related Components

- `Container` - For maximum width and padding control
- `Stack` - For simpler linear layouts
- `Card` - Common grid item component
- `Box` - Basic layout building block

## Design Tokens

The Grid component uses the following theme tokens:

```typescript
theme.tokens.spacing.scale.{size}  // For grid gap
theme.breakpoints.{size}          // For responsive layouts
```

## Common Patterns

### Dashboard Layout

```tsx
<Grid columns={12} spacing="lg">
  {/* Full-width header */}
  <div style={{ gridColumn: 'span 12' }}>
    <Header />
  </div>

  {/* Sidebar */}
  <div style={{ gridColumn: 'span 3' }}>
    <Sidebar />
  </div>

  {/* Main content */}
  <div style={{ gridColumn: 'span 9' }}>
    <MainContent />
  </div>
</Grid>
```

### Card Grid

```tsx
<Grid
  minChildWidth="300px"
  autoFit
  spacing={{
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }}
>
  {cards.map((card) => (
    <Card key={card.id}>
      <CardContent>{card.content}</CardContent>
    </Card>
  ))}
</Grid>
```

### Gallery Layout

```tsx
<Grid
  columns={{
    sm: 2,
    md: 3,
    lg: 4,
  }}
  spacing="sm"
>
  {images.map((image) => (
    <img key={image.id} src={image.src} alt={image.alt} style={{ width: '100%', height: 'auto' }} />
  ))}
</Grid>
```

## GridItem Component

The GridItem component provides fine-grained control over grid cell behavior:

```tsx
import { Grid, GridItem } from '@/components/ui/layout';

// Responsive columns
<Grid columns={12}>
  <GridItem span={{ sm: 12, md: 6, lg: 4 }}>
    Responsive column
  </GridItem>
  <GridItem span={3} offset={1}>
    Fixed width with offset
  </GridItem>
</Grid>

// Specific placement
<Grid columns={12}>
  <GridItem colStart={1} colEnd={4}>
    Spans columns 1-3
  </GridItem>
  <GridItem colStart={4} colEnd={13}>
    Spans columns 4-12
  </GridItem>
</Grid>

// Order control
<Grid columns={3}>
  <GridItem order={2}>Second</GridItem>
  <GridItem order={3}>Third</GridItem>
  <GridItem order={1}>First</GridItem>
</Grid>
```

### GridItem Props

| Prop       | Type                                   | Default | Description                 |
| ---------- | -------------------------------------- | ------- | --------------------------- |
| `span`     | `number \| Record<Breakpoint, number>` | `1`     | Number of columns to span   |
| `offset`   | `number \| Record<Breakpoint, number>` | `0`     | Number of columns to offset |
| `order`    | `number \| Record<Breakpoint, number>` | -       | Order in the grid           |
| `colStart` | `number \| Record<Breakpoint, number>` | -       | Starting column             |
| `colEnd`   | `number \| Record<Breakpoint, number>` | -       | Ending column               |
| `fill`     | `boolean`                              | `false` | Fill grid cell height       |

### Common Patterns with GridItem

#### Dashboard Layout with Sidebar

```tsx
<Grid columns={12} spacing="lg">
  <GridItem span={12}>
    <Header />
  </GridItem>
  <GridItem span={{ sm: 12, md: 3 }}>
    <Sidebar />
  </GridItem>
  <GridItem span={{ sm: 12, md: 9 }}>
    <MainContent />
  </GridItem>
</Grid>
```

#### Card Grid with Featured Item

```tsx
<Grid columns={12} spacing="md">
  <GridItem span={{ sm: 12, md: 8 }}>
    <FeaturedCard />
  </GridItem>
  <GridItem span={{ sm: 12, md: 4 }}>
    <StandardCard />
  </GridItem>
  <GridItem span={{ sm: 12, md: 4 }}>
    <StandardCard />
  </GridItem>
  <GridItem span={{ sm: 12, md: 4 }}>
    <StandardCard />
  </GridItem>
</Grid>
```

#### Responsive Gallery with Order Control

```tsx
<Grid columns={{ sm: 2, md: 3, lg: 4 }} spacing="sm">
  <GridItem order={{ sm: 2, md: 1 }}>
    <GalleryItem />
  </GridItem>
  <GridItem order={{ sm: 1, md: 2 }}>
    <GalleryItem />
  </GridItem>
  <GridItem order={{ sm: 3, md: 3 }}>
    <GalleryItem />
  </GridItem>
</Grid>
```
