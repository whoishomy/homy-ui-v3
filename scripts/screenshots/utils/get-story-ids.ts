import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

interface StoryInfo {
  componentName: string;
  storyId: string;
  storyTitle: string;
}

async function getStoryFiles(): Promise<string[]> {
  return glob('src/**/*.stories.{tsx,ts}');
}

function extractStoryInfo(filePath: string): StoryInfo[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = path.basename(path.dirname(filePath));
  
  // Extract story title from meta
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const storyTitle = titleMatch ? titleMatch[1] : componentName;
  
  // Extract story exports
  const storyPattern = /export\s+const\s+(\w+)\s*:/g;
  const matches = [...content.matchAll(storyPattern)];
  
  return matches.map(match => ({
    componentName,
    storyId: `${storyTitle.toLowerCase().replace(/\s+/g, '-')}--${match[1].toLowerCase()}`,
    storyTitle
  }));
}

export async function getAllStoryIds(): Promise<StoryInfo[]> {
  const storyFiles = await getStoryFiles();
  return storyFiles.flatMap(file => extractStoryInfo(file));
}

export async function getComponentStoryIds(componentName: string): Promise<StoryInfo[]> {
  const allStories = await getAllStoryIds();
  return allStories.filter(story => 
    story.componentName.toLowerCase() === componentName.toLowerCase() ||
    story.storyTitle.toLowerCase().includes(componentName.toLowerCase())
  );
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  const componentName = args[0];

  if (componentName) {
    getComponentStoryIds(componentName)
      .then(stories => console.log(JSON.stringify(stories, null, 2)))
      .catch(console.error);
  } else {
    getAllStoryIds()
      .then(stories => console.log(JSON.stringify(stories, null, 2)))
      .catch(console.error);
  }
} 