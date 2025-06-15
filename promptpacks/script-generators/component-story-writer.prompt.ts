/**
 * @promptpack component-story-writer
 * @description Generates comprehensive Storybook stories with documentation, variants, and interactive controls
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a Storybook documentation specialist focused on creating comprehensive component stories.
Your task is to create a script that generates rich Storybook documentation with variants and controls.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate Storybook files with:
   - Component documentation
   - Props table with types
   - Interactive controls
   - Variant examples
   - Accessibility notes
   - Code snippets
3. Support story categories:
   - Basic usage
   - Variants & States
   - Responsive behavior
   - Error handling
   - Loading states
4. Include memory.json integration
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Component Story Writer
# @raycast.mode fullOutput
# @raycast.icon 📚
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Component name or path" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Story type",
  "data": [
    { "title": "Full Documentation", "value": "full" },
    { "title": "Basic Story", "value": "basic" },
    { "title": "Variants Only", "value": "variants" },
    { "title": "Interactive Demo", "value": "interactive" }
  ]
}

Please generate a complete shell script that includes:
- Component analysis for props and variants
- Story template generation
- Documentation structure creation
- Screenshot integration with CleanShot
- Memory.json state tracking
`;

export const expectedOutput =
  'A Raycast-compatible script that generates comprehensive Storybook documentation';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'story',
    'component',
    'storybook',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const storyTemplate = `
import type { Meta, StoryObj } from '@storybook/react-vite';
import { {ComponentName} } from './{ComponentName}';

const meta: Meta<typeof {ComponentName}> = {
  title: 'Components/{ComponentName}',
  component: {ComponentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof {ComponentName}>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};

export const WithCustomProps: Story = {
  args: {
    // Add custom props here
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: new Error('Something went wrong'),
  },
};
`;

export const documentationTemplate = `
# {ComponentName} Component

## Overview
{ComponentDescription}

## Props
{PropsList}

## Examples
\`\`\`jsx
import { {ComponentName} } from './{ComponentName}';

// Basic usage
<{ComponentName} />

// With custom props
<{ComponentName} {...customProps} />
\`\`\`

## Notes
- {Note1}
- {Note2}
`;

export const memoryIntegration = {
  stories: {
    created: [
      {
        component: 'ExampleComponent',
        timestamp: '2024-03-21T10:30:00Z',
        type: 'full',
        variants: ['primary', 'secondary', 'ghost'],
        screenshots: ['default.png', 'variants.png'],
      },
    ],
    documentation: {
      lastUpdated: '2024-03-21T10:30:00Z',
      coverage: {
        props: true,
        examples: true,
        accessibility: true,
      },
    },
  },
};
