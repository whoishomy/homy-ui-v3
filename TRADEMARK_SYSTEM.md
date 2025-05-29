# HOMY™ Trademark Visual System

## Overview

The HOMY™ Trademark Visual System ensures consistent branding and accessibility across all components of the digital health platform. This system is built with TypeScript and React, providing type-safe utilities and hooks for maintaining brand identity.

## Core Components

### 1. Trademark Visual Kit

```typescript
// promptpacks/trademark-visual-kit.prompt.ts
import { defaultTrademarkKit } from './trademark-visual-kit.prompt';

const colors = defaultTrademarkKit.visualIdentity.colors;
// Primary: #4A90E2
// Success: #4CAF50
// Focus: #9575CD
// Warning: #FFB74D
```

### 2. React Hook

```typescript
// Usage in components
import { useTrademarkStyle } from '../hooks/useTrademarkStyle';

function MyComponent() {
  const containerRef = useTrademarkStyle<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      <h1>HOMY™ Component</h1>
    </div>
  );
}
```

### 3. Global Styles

The system automatically injects global styles and CSS variables:

```css
:root {
  --homy-primary: #4a90e2;
  --homy-success: #4caf50;
  --homy-focus: #9575cd;
  --homy-warning: #ffb74d;
  /* ... other variables ... */
}
```

## Usage Guidelines

### 1. Component Naming

Always use the `getTrademarkName` utility for component labels:

```typescript
import { getTrademarkName } from '../utils/trademark';

<div aria-label={getTrademarkName('Component Name')}>
```

### 2. Styling Components

Use the `useTrademarkStyle` hook for consistent styling:

```typescript
const containerRef = useTrademarkStyle<HTMLDivElement>({
  colors: {
    primary: '#custom-color', // Optional override
  },
});
```

### 3. Asset Management

Validate asset paths using the provided utility:

```typescript
import { validateAssetPath } from '../utils/trademark';

if (validateAssetPath('logos/homy-logo-primary.svg')) {
  // Use the asset
}
```

## Accessibility Features

- WCAG 2.1 AA compliant color contrast
- Proper ARIA attributes
- Screen reader friendly
- Keyboard navigation support
- Focus management

## Legal Protection

- EUIPO trademark application (filing date: 2024-06-06)
- Nice classifications: 44, 9, 42
- Brand name must always include ™ symbol: HOMY™

## Implementation Checklist

- [ ] Use `useTrademarkStyle` hook in components
- [ ] Apply proper ARIA labels with `getTrademarkName`
- [ ] Validate asset paths
- [ ] Follow color and typography guidelines
- [ ] Maintain accessibility standards

## Development Tools

### 1. Validation

```typescript
import { validateTrademarkKit } from '../promptpacks/trademark-visual-kit.prompt';

// Validate custom configurations
const isValid = validateTrademarkKit(customConfig);
```

### 2. Export Settings

```typescript
import { getExportSettings } from '../utils/trademark';

const figmaSettings = getExportSettings('figma');
const screenshotSettings = getExportSettings('screenshots');
```

## Best Practices

1. Always use CSS variables for colors and spacing
2. Maintain proper typography hierarchy
3. Follow accessibility guidelines
4. Use proper trademark symbol (™)
5. Validate asset paths before use

## Support

For questions about the trademark system, contact the development team or refer to the documentation in `promptpacks/trademark-kit-docs.prompt.ts`.

---

© 2024 HOMY™ Health. All rights reserved.
