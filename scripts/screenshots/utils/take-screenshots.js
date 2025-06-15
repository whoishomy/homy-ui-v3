const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { getComponentStoryIds } = require('./get-story-ids');

const STORYBOOK_PORT = process.env.STORYBOOK_PORT || 6009;
const STORYBOOK_URL = `http://localhost:${STORYBOOK_PORT}`;
const SCREENSHOT_DIR = path.join(process.cwd(), 'docs', 'screenshots');
const DEFAULT_TIMEOUT = 120000; // 120 seconds
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForStorybookPreview(page) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔍 Waiting for Storybook preview (attempt ${attempt}/${MAX_RETRIES})...`);

      // Wait for the Storybook main body
      await page.waitForSelector('body.sb-show-main', { timeout: DEFAULT_TIMEOUT });
      console.log('✅ Found Storybook main body');

      // Wait for the story content to be ready
      await page.waitForFunction(
        () => {
          const root = document.body;
          return root && root.children.length > 0 && !root.innerHTML.includes('sb-preparing');
        },
        { timeout: DEFAULT_TIMEOUT }
      );
      console.log('✅ Story content is ready');

      // Log the current state for debugging
      const state = await page.evaluate(() => {
        return {
          hasToastProvider: !!document.querySelector('[data-radix-toast-provider]'),
          hasToastRoot: !!document.querySelector('[data-radix-toast-root]'),
          hasToastViewport: !!document.querySelector('[data-radix-toast-viewport]'),
          hasToastTitle: !!document.querySelector('[data-radix-toast-title]'),
          hasToastDescription: !!document.querySelector('[data-radix-toast-description]'),
        };
      });
      console.log('📊 Current state:', JSON.stringify(state, null, 2));

      // Wait for any of the toast elements to be present
      await page.waitForFunction(
        () => {
          return !!(
            document.querySelector('[data-radix-toast-provider]') &&
            document.querySelector('[data-radix-toast-root]') &&
            document.querySelector('[data-radix-toast-viewport]')
          );
        },
        { timeout: 30000 }
      );
      console.log('✅ Toast component is rendered');

      // Additional wait to ensure animations are complete
      await sleep(2000);
      console.log('✅ Waited for animations');

      return page;
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed:`, error.message);
      lastError = error;

      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Waiting ${RETRY_DELAY}ms before retry...`);
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw new Error(
    `Failed to load Storybook preview after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`
  );
}

async function takeScreenshot(storyId) {
  console.log(`📸 Taking screenshot for story: ${storyId}`);

  const [componentName] = storyId.split('--');
  const outputDir = path.join(SCREENSHOT_DIR, componentName);
  const outputPath = path.join(outputDir, `${storyId}.png`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultTimeout(DEFAULT_TIMEOUT);
    await page.setViewport({ width: 1024, height: 768 });

    // Navigate to the story
    const storyUrl = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
    console.log(`🌐 Navigating to: ${storyUrl}`);
    await page.goto(storyUrl, { waitUntil: 'networkidle0', timeout: DEFAULT_TIMEOUT });

    // Wait for the story to be fully rendered
    await waitForStorybookPreview(page);

    // Take the screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    console.log(`✅ Screenshot saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error taking screenshot for ${storyId}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const componentName = args.find((arg) => !arg.startsWith('--'));

  if (!componentName) {
    console.error('❌ Please provide a component name');
    process.exit(1);
  }

  try {
    const stories = await getComponentStoryIds(componentName);

    if (stories.length === 0) {
      console.error(`❌ No stories found for component: ${componentName}`);
      process.exit(1);
    }

    console.log(`📷 Found ${stories.length} stories for ${componentName}`);

    for (const story of stories) {
      await takeScreenshot(story.storyId);
    }

    console.log('✨ All screenshots completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  takeScreenshot,
};
