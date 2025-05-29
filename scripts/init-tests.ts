import fs from 'fs';
import path from 'path';

const COMPONENT_DIRS = [
  'src/components/lab',
  'src/components/vitals',
  'src/components/triage',
  'src/components/insights',
];

const TEST_TEMPLATE = `import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { COMPONENT_NAME } from './COMPONENT_FILE';

// Mock data
const mockData = {
  // Add your mock data here
};

// Reusable render function
const renderComponent = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <COMPONENT_NAME {...mockData} {...props} />
    </ThemeProvider>
  );
};

describe('COMPONENT_NAME Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders component correctly', () => {
    renderComponent();
    // Add your assertions here
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    // Add your interaction tests here
  });

  it('maintains accessibility standards', async () => {
    const { container } = renderComponent();
    await expect(container).toHaveNoViolations();
  });

  it('handles responsive layout', () => {
    renderComponent();
    // Add your responsive layout tests here
  });
});
`;

function createTestFile(componentPath: string) {
  const componentName = path.basename(componentPath, '.tsx');
  const testPath = path.join(path.dirname(componentPath), `${componentName}.test.tsx`);

  if (fs.existsSync(testPath)) {
    console.log(`Test file already exists: ${testPath}`);
    return;
  }

  const template = TEST_TEMPLATE.replace(/COMPONENT_NAME/g, componentName).replace(
    /COMPONENT_FILE/g,
    path.basename(componentPath)
  );

  fs.writeFileSync(testPath, template);
  console.log(`Created test file: ${testPath}`);
}

function initializeTests() {
  COMPONENT_DIRS.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    const files = fs.readdirSync(dir);
    files
      .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
      .forEach((file) => {
        const componentPath = path.join(dir, file);
        createTestFile(componentPath);
      });
  });
}

initializeTests();
