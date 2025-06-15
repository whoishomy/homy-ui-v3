#!/bin/bash

# Install dependencies if needed
if [ ! -d "node_modules/puppeteer" ]; then
  echo "Installing puppeteer..."
  yarn add -D puppeteer
fi

if [ ! -d "node_modules/glob" ]; then
  echo "Installing glob..."
  yarn add -D glob
fi

# Create the screenshots directory if it doesn't exist
mkdir -p docs/screenshots

# Run the screenshot script for all stories
node -e "
const { getStoryIds } = require('./utils/get-story-ids');
const { takeScreenshots } = require('./utils/take-screenshots');

async function main() {
  const stories = getStoryIds();
  console.log('Found stories:', stories.map(s => s.id).join('\n'));
  await takeScreenshots(stories);
}

main().catch(console.error);
" 