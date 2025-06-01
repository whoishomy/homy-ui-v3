import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import type { Screenshot } from '../components/ScreenshotCard';

const SCREENSHOTS_DIR = process.env.SCREENSHOTS_DIR || 'docs/screenshots';

interface ScreenshotMetadata {
  component: string;
  date: string;
  viewport: string;
  resolution: string;
}

function parseScreenshotName(filename: string): ScreenshotMetadata | null {
  // Expected format: DD-Month-YYYY-[component]-[viewport]@resolution.png
  const pattern = /^(\d{2}-[A-Za-z]+-\d{4})-\[([^\]]+)\]-\[([^\]]+)\]@?([\dx]*)\.png$/;
  const match = filename.match(pattern);

  if (!match) return null;

  return {
    date: match[1],
    component: match[2].toLowerCase(),
    viewport: match[3],
    resolution: match[4] || '1x',
  };
}

async function loadComponentTags(
  componentDir: string
): Promise<{ tags: string[]; description?: string }> {
  try {
    const readmePath = path.join(componentDir, 'README.md');
    if (!fs.existsSync(readmePath)) return { tags: [] };

    const content = await fs.promises.readFile(readmePath, 'utf-8');
    const tagsMatch = content.match(/Tags:\s*\[(.*?)\]/);
    const descriptionMatch = content.match(/Description:\s*(.*?)(?:\n|$)/);

    return {
      tags: tagsMatch ? tagsMatch[1].split(',').map((tag) => tag.trim()) : [],
      description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
    };
  } catch (error) {
    console.error(`Error loading tags for ${componentDir}:`, error);
    return { tags: [] };
  }
}

export async function loadScreenshots(): Promise<{
  screenshots: Screenshot[];
  hasIncompleteTagging: boolean;
}> {
  const screenshots: Screenshot[] = [];
  let hasIncompleteTagging = false;
  const allScreenshots = await glob('**/*.png', { cwd: SCREENSHOTS_DIR });

  for (const screenshotPath of allScreenshots) {
    const metadata = parseScreenshotName(path.basename(screenshotPath));
    if (!metadata) continue;

    const componentDir = path.join(SCREENSHOTS_DIR, path.dirname(screenshotPath));
    const { tags, description } = await loadComponentTags(componentDir);

    // Check if AI tagging is incomplete
    if (!description || tags.length === 0) {
      hasIncompleteTagging = true;
    }

    screenshots.push({
      path: screenshotPath,
      component: metadata.component,
      date: metadata.date,
      viewport: metadata.viewport,
      tags,
      description,
    });
  }

  // Sort screenshots by date (newest first)
  screenshots.sort((a, b) => {
    const dateA = new Date(a.date.replace(/-/g, ' '));
    const dateB = new Date(b.date.replace(/-/g, ' '));
    return dateB.getTime() - dateA.getTime();
  });

  return { screenshots, hasIncompleteTagging };
}
