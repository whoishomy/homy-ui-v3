# Homy A11y Foundation Layer

> 🧬 [Homy Manifestosu'nu okuyun](../MANIFESTO.md)

## Overview

The Homy A11y Foundation Layer is an open-source accessibility framework designed to make digital health applications accessible to everyone. This framework is particularly focused on supporting children with attention and learning challenges.

## Our Principles

1. **100% Accessible**: No one is left behind - whether they can't see, hear, read, or focus
2. **100% Personalized**: Every health journey is unique, and our system adapts accordingly
3. **100% Compliant**: Built with CE, GDPR, and FHIR standards in mind from day one

## Core Principles

1. **Universal Access**: Every child deserves equal access to digital learning tools
2. **Emotional Intelligence**: Accessibility includes emotional support through multiple channels
3. **Adaptive Design**: Interfaces that adapt to individual needs and preferences
4. **Progressive Enhancement**: Core functionality works for everyone, enhanced features add value

## Features

### 1. Color Contrast System

```typescript
import { getAccessibleTextColor, emotionalColorPalettes } from './color-contrast';

// Get WCAG 2.1 AA compliant colors for emotional states
const textColor = getAccessibleTextColor(backgroundColor, 'exploring');
```

### 2. Keyboard Navigation

```typescript
import { useKeyboardNavigation, createFocusTrap } from './keyboard-navigation';

function YourComponent() {
  const containerRef = useKeyboardNavigation({
    focusableSelector: 'button, [href], input, select, textarea',
    onEnter: () => handleSelection(),
    onEscape: () => handleEscape(),
  });

  return <div ref={containerRef}>...</div>;
}
```

### 3. Screen Reader Support

```typescript
import { announceToScreenReader } from './keyboard-navigation';

// Announce progress updates
announceToScreenReader('Harika ilerliyorsun! 2. adımı tamamladın.', 'polite');
```

## Getting Started

1. Install the package:

```bash
npm install @homy/a11y-foundation
```

2. Import the components you need:

```typescript
import {
  useKeyboardNavigation,
  getAccessibleTextColor,
  announceToScreenReader,
} from '@homy/a11y-foundation';
```

3. Follow the implementation examples in our [ARIA Structure Guide](./aria-structure.md)

## Testing

We provide comprehensive testing utilities:

```typescript
import { axe, toHaveNoViolations } from '@homy/a11y-foundation/testing';

describe('Your Component', () => {
  it('should be accessible', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Best Practices

1. **Semantic HTML**

   - Use proper heading hierarchy (h1-h6)
   - Employ semantic elements (nav, main, article)
   - Add ARIA labels where necessary

2. **Keyboard Navigation**

   - Ensure all interactive elements are focusable
   - Provide visible focus indicators
   - Implement logical tab order

3. **Color and Contrast**

   - Meet WCAG 2.1 AA standards (4.5:1 for normal text)
   - Don't rely solely on color for information
   - Provide high contrast alternatives

4. **Screen Readers**
   - Add descriptive alt text to images
   - Use ARIA live regions for dynamic content
   - Ensure proper heading structure

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/homy-health/a11y-foundation.git
```

2. Install dependencies:

```bash
npm install
```

3. Run tests:

```bash
npm test
```

## License

MIT License - See [LICENSE](LICENSE) for details.

## Support

- Documentation: [homy.health/a11y](https://homy.health/a11y)
- Issues: [GitHub Issues](https://github.com/homy-health/a11y-foundation/issues)
- Community: [Discord](https://discord.gg/homy-health)

## Why Open Source?

We believe accessibility is a fundamental right, not a feature. By open-sourcing our accessibility foundation:

1. We help other developers create more accessible applications
2. We benefit from community feedback and improvements
3. We establish standards for digital health accessibility
4. We make the internet more inclusive for everyone

Our commitment: "Minimum Viable Responsibility" over "Minimum Viable Product"

## Roadmap

- [ ] Voice navigation support
- [ ] Dyslexia-friendly font options
- [ ] Motion sensitivity controls
- [ ] Cognitive load management
- [ ] Multi-language support

## Partners

- TÜBİTAK - Engelsiz BİLİŞİM
- UNDP Innovation
- WHO Digital Health
- Various Children's Hospitals

Join us in making digital health accessible to every child! 🌟
