const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots(componentName) {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  });

  const page = await browser.newPage();
  
  // Navigate to Storybook
  await page.goto('http://localhost:6006');
  
  // Wait for Storybook to load
  await page.waitForSelector('#storybook-preview-iframe');
  
  // Get the iframe
  const frame = await page.frames().find(f => f.name() === 'storybook-preview-iframe');
  
  // Get all stories for the component
  const stories = await page.evaluate((componentName) => {
    return Object.keys(window.__STORYBOOK_PREVIEW__.storyStore._stories)
      .filter(key => key.includes(componentName))
      .map(key => ({
        id: key,
        name: window.__STORYBOOK_PREVIEW__.storyStore._stories[key].name,
      }));
  }, componentName);

  // Create screenshots directory if it doesn't exist
  const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots', componentName);
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Take screenshots for each story
  for (const story of stories) {
    // Navigate to the story
    await page.goto(`http://localhost:6006/iframe.html?id=${story.id}`);
    
    // Wait for the story to render
    await page.waitForTimeout(2000);
    
    // Take the screenshot
    await page.screenshot({
      path: path.join(screenshotDir, `${story.name}.png`),
      fullPage: true,
    });
  }

  await browser.close();
}

// Get component name from command line args
const componentName = process.argv[2];
if (!componentName) {
  console.error('Please provide a component name');
  process.exit(1);
}

takeScreenshots(componentName).catch(console.error); 