const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');

const STORYBOOK_PORT = 6009;

async function waitForStorybookServer(port, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Server responded with status code ${res.statusCode}`));
          }
        });

        req.on('error', () => {
          reject(new Error('Connection failed'));
        });

        req.end();
      });

      console.log('✅ Storybook server is ready');
      return;
    } catch (error) {
      console.log(`⏳ Waiting for Storybook server (attempt ${attempt}/${maxAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error('❌ Storybook server failed to start');
}

async function waitForFrame(page, timeout = 60000) {
  try {
    // Wait for the iframe to be present in DOM
    await page.waitForSelector('#storybook-preview-iframe', { timeout });
    
    // Get the frame handle
    const frameHandle = await page.$('#storybook-preview-iframe');
    if (!frameHandle) {
      throw new Error('❌ Storybook iframe not found');
    }

    // Get the frame content
    const frame = await frameHandle.contentFrame();
    if (!frame) {
      throw new Error('❌ Could not get iframe content');
    }

    return frame;
  } catch (error) {
    console.error('❌ Error waiting for iframe:', error.message);
    throw error;
  }
}

async function waitForStorybookPreview(page, maxAttempts = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const isInitialized = await page.evaluate(() => {
        return !!(window.__STORYBOOK_ADDONS_PREVIEW && window.__STORYBOOK_API__);
      });

      if (isInitialized) {
        console.log('✅ Storybook preview is initialized');
        return true;
      }

      console.log(`⏳ Waiting for Storybook preview to initialize (attempt ${attempt}/${maxAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('Debug error:', error);
      if (attempt === maxAttempts) {
        throw new Error('❌ Storybook preview failed to initialize');
      }
    }
  }

  throw new Error('❌ Storybook preview initialization timeout');
}

async function takeScreenshots(componentName) {
  console.log(`📸 Taking screenshots for ${componentName}...`);
  
  // Wait for Storybook server to be ready
  await waitForStorybookServer(STORYBOOK_PORT);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  });

  const page = await browser.newPage();
  
  try {
    // Navigate to Storybook with network idle wait
    await page.goto(`http://localhost:${STORYBOOK_PORT}`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    
    // Wait for and get the iframe
    const frame = await waitForFrame(page);
    
    // Wait for Storybook preview to initialize
    await waitForStorybookPreview(page);
    
    // Get all stories for the component
    const stories = await page.evaluate((componentName) => {
      const api = window.__STORYBOOK_API__;
      if (!api) {
        console.log('No Storybook API found');
        return [];
      }
      
      console.log('API:', Object.keys(api));
      console.log('StoryStore:', Object.keys(api.storyStore || {}));
      
      const extract = api.storyStore?.extract();
      console.log('Extract:', extract ? Object.keys(extract) : null);
      
      if (!extract) {
        console.log('No stories extracted');
        return [];
      }
      
      const entries = Object.entries(extract);
      console.log('All story IDs:', entries.map(([id]) => id));
      
      const filteredStories = entries
        .filter(([id]) => id.toLowerCase().includes(componentName.toLowerCase()));
      
      console.log('Filtered story IDs:', filteredStories.map(([id]) => id));
      
      return filteredStories.map(([id, story]) => ({
        id,
        name: story.name || id.split('--').pop(),
      }));
    }, componentName);

    console.log('Found stories:', stories);

    if (!stories.length) {
      console.log('Trying alternative API...');
      const altStories = await page.evaluate((componentName) => {
        const preview = window.__STORYBOOK_ADDONS_PREVIEW;
        if (!preview) {
          console.log('No preview API found');
          return [];
        }
        
        console.log('Preview:', Object.keys(preview));
        console.log('StoryStore:', Object.keys(preview.storyStore || {}));
        
        const stories = preview.storyStore?.stories || {};
        console.log('All story IDs:', Object.keys(stories));
        
        const filteredStories = Object.entries(stories)
          .filter(([id]) => id.toLowerCase().includes(componentName.toLowerCase()));
        
        console.log('Filtered story IDs:', filteredStories.map(([id]) => id));
        
        return filteredStories.map(([id, story]) => ({
          id,
          name: story.name || id.split('--').pop(),
        }));
      }, componentName);
      
      console.log('Found alternative stories:', altStories);
      
      if (altStories.length) {
        console.log('Found stories using alternative API');
        return altStories;
      }
    }

    if (!stories.length) {
      throw new Error(`❌ No stories found for component: ${componentName}`);
    }

    console.log(`📋 Found ${stories.length} stories for ${componentName}`);

    // Create screenshots directory if it doesn't exist
    const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots', componentName);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Take screenshots for each story
    for (const story of stories) {
      console.log(`📸 Taking screenshot for story: ${story.name}`);
      
      // Navigate to the story with network idle wait
      await page.goto(`http://localhost:${STORYBOOK_PORT}/iframe.html?id=${story.id}`, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      });
      
      // Additional wait for dynamic content
      await page.waitForTimeout(2000);
      
      // Take the screenshot
      await page.screenshot({
        path: path.join(screenshotDir, `${story.name}.png`),
        fullPage: true,
      });
      
      console.log(`✅ Screenshot saved for story: ${story.name}`);
    }

    console.log('✨ All screenshots taken successfully!');
  } catch (error) {
    console.error('❌ Error taking screenshots:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Get component name from command line args
const componentName = process.argv[2];
if (!componentName) {
  console.error('❌ Please provide a component name');
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

takeScreenshots(componentName).catch((error) => {
  console.error('❌ Screenshot process failed:', error);
  process.exit(1);
}); 