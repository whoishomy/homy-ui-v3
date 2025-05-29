/**
 * @promptpack test-scenario-builder
 * @description Generates comprehensive test scenarios for React components with accessibility and edge cases
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a test scenario generator specialized in creating comprehensive test suites.
Your task is to create a script that generates test scenarios for React components.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate test scenarios for:
   - Basic functionality
   - Edge cases
   - Accessibility (a11y)
   - Error states
   - Loading states
   - Mobile/responsive behavior
3. Create test files with:
   - Jest/React Testing Library setup
   - Comprehensive test cases
   - Clear descriptions and comments
4. Include memory.json integration
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Test Scenario Builder
# @raycast.mode fullOutput
# @raycast.icon 🧪
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Component name or path" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Test type",
  "data": [
    { "title": "Full Suite", "value": "full" },
    { "title": "Basic Tests", "value": "basic" },
    { "title": "A11y Tests", "value": "a11y" },
    { "title": "Edge Cases", "value": "edge" }
  ]
}

Please generate a complete shell script that includes:
- Component analysis and test planning
- Test file generation with proper structure
- Integration with memory.json for test history
- Error handling and validation
`;

export const expectedOutput = 'A Raycast-compatible script that generates comprehensive test scenarios';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'test',
    'component',
    'describe',
    'it'
  ];

  return requiredElements.every(element => output.includes(element));
};

export const testScenarios = {
  "basic": {
    "render": "Component renders without crashing",
    "props": "Component accepts and displays all required props",
    "interactions": "User can interact with clickable elements"
  },
  "a11y": {
    "landmarks": "Proper ARIA landmarks are present",
    "keyboard": "All interactions are keyboard accessible",
    "screenReader": "Content is announced properly to screen readers"
  },
  "edge": {
    "loading": "Component handles loading state gracefully",
    "error": "Error states are handled and displayed properly",
    "empty": "Empty or null states are handled correctly"
  }
};

export const sampleTestFile = \`
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Component from './Component';

describe('Component Tests', () => {
  describe('Basic Functionality', () => {
    it('renders without crashing', () => {
      render(<Component />);
      expect(screen).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Component />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
\`;

export const memoryIntegration = {
  "tests": {
    "created": [
      {
        "component": "ExampleComponent",
        "timestamp": "2024-03-21T10:30:00Z",
        "type": "full",
        "coverage": "95%"
      }
    ],
    "history": {
      "lastRun": "2024-03-21T10:30:00Z",
      "results": {
        "passed": 42,
        "failed": 0,
        "skipped": 2
      }
    }
  }
}; 