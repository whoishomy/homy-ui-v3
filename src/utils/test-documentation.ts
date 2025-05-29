import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

interface Screenshot {
  path: string;
  viewport: string;
  scale: string;
  createdAt: string;
  component: string;
  darkMode: boolean;
  status?: string;
}

interface ComponentScreenshots {
  variants: {
    [key: string]: Screenshot;
  };
}

interface ScreenshotData {
  components: {
    [key: string]: ComponentScreenshots;
  };
}

/**
 * Generates markdown documentation for a component's screenshots
 */
function generateScreenshotMarkdown(
  componentId: string,
  screenshots: ComponentScreenshots
): string {
  const variants = Object.entries(screenshots.variants)
    .map(([variant, screenshot]) => {
      const relativePath = screenshot.path.startsWith('/')
        ? screenshot.path.slice(1)
        : screenshot.path;

      return `
### ${variant} (${screenshot.viewport}, ${screenshot.scale})

![${componentId} - ${variant}](/${relativePath})

- Mode: ${screenshot.darkMode ? 'Dark' : 'Light'}
- Created: ${new Date(screenshot.createdAt).toLocaleDateString()}
- Status: ${screenshot.status || 'complete'}
`;
    })
    .join('\n');

  return `
## Visual Documentation

${variants}
`;
}

/**
 * Updates test file documentation with screenshots
 */
async function updateTestFile(
  testFilePath: string,
  componentId: string,
  screenshots: ComponentScreenshots
): Promise<void> {
  const content = await fs.readFile(testFilePath, 'utf-8');
  const lines = content.split('\n');

  // Find the documentation section
  const docStart = lines.findIndex((line) => line.includes('## Visual Documentation'));
  const docEnd =
    docStart !== -1
      ? lines.slice(docStart + 1).findIndex((line) => line.startsWith('##')) + docStart + 1
      : -1;

  const newDoc = generateScreenshotMarkdown(componentId, screenshots);

  if (docStart === -1) {
    // No existing documentation section, append at the end
    lines.push(newDoc);
  } else if (docEnd === -1) {
    // Documentation section exists but no following section
    lines.splice(docStart, lines.length - docStart, newDoc);
  } else {
    // Replace existing documentation section
    lines.splice(docStart, docEnd - docStart, newDoc);
  }

  await fs.writeFile(testFilePath, lines.join('\n'));
}

/**
 * Updates README documentation with screenshots
 */
async function updateReadme(
  componentPath: string,
  componentId: string,
  screenshots: ComponentScreenshots
): Promise<void> {
  const readmePath = path.join(componentPath, 'README.md');

  try {
    const content = await fs.readFile(readmePath, 'utf-8');
    const lines = content.split('\n');

    const docStart = lines.findIndex((line) => line.includes('## Screenshots'));
    const docEnd =
      docStart !== -1
        ? lines.slice(docStart + 1).findIndex((line) => line.startsWith('##')) + docStart + 1
        : -1;

    const newDoc = generateScreenshotMarkdown(componentId, screenshots);

    if (docStart === -1) {
      lines.push('\n' + newDoc);
    } else if (docEnd === -1) {
      lines.splice(docStart, lines.length - docStart, '## Screenshots\n' + newDoc);
    } else {
      lines.splice(docStart, docEnd - docStart, '## Screenshots\n' + newDoc);
    }

    await fs.writeFile(readmePath, lines.join('\n'));
  } catch (error) {
    // If README doesn't exist, create it
    const basicReadme = `# ${componentId}

## Screenshots
${generateScreenshotMarkdown(componentId, screenshots)}
`;
    await fs.writeFile(readmePath, basicReadme);
  }
}

/**
 * Main function to update all test documentation with screenshots
 */
export async function updateTestDocumentation(screenshotData: ScreenshotData): Promise<void> {
  const components = Object.entries(screenshotData.components);

  for (const [componentId, screenshots] of components) {
    // Convert component ID to path format (e.g., "ResultFilterBar" -> "result-filter-bar")
    const componentPath = componentId.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // Look for test files
    const testFiles = await glob(`src/**/${componentPath}/*.test.{ts,tsx}`);

    for (const testFile of testFiles) {
      await updateTestFile(testFile, componentId, screenshots);
    }

    // Look for component directory
    const componentDirs = await glob(`src/**/${componentPath}`);

    for (const dir of componentDirs) {
      await updateReadme(dir, componentId, screenshots);
    }
  }
}
