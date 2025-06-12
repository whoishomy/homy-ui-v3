#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
  echo "Please provide a component name"
  exit 1
fi

COMPONENT_NAME=$1
SCREENSHOT_DIR="docs/screenshots/$COMPONENT_NAME"

# Create screenshot directory if it doesn't exist
mkdir -p "$SCREENSHOT_DIR"

# Start Storybook in dev mode and wait for it to be ready
echo "Starting Storybook..."
yarn storybook --ci &
STORYBOOK_PID=$!

# Wait for Storybook to be ready
until $(curl --output /dev/null --silent --head --fail http://localhost:6006); do
  printf '.'
  sleep 5
done

echo "Storybook is ready!"

# Run Puppeteer script to take screenshots
echo "Taking screenshots for $COMPONENT_NAME..."
node scripts/utils/take-screenshots.js "$COMPONENT_NAME"

# Kill Storybook
kill $STORYBOOK_PID

echo "Screenshots saved in $SCREENSHOT_DIR" 