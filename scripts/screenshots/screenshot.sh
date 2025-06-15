#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
  echo "❌ Please provide a component name"
  echo "Usage: yarn screenshot <component-name> [story-name]"
  exit 1
fi

COMPONENT_NAME=$1
STORY_NAME=$2
STORYBOOK_PORT=${STORYBOOK_PORT:-6009}

# Function to check if Storybook is running
check_storybook() {
  for i in {1..30}; do
    if curl -s "http://localhost:${STORYBOOK_PORT}" > /dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# Check if Storybook is running
if ! check_storybook; then
  echo "🚀 Starting Storybook on port ${STORYBOOK_PORT}..."
  STORYBOOK_PORT=$STORYBOOK_PORT yarn storybook &
  
  # Wait for Storybook to start
  echo "⏳ Waiting for Storybook to start..."
  if ! check_storybook; then
    echo "❌ Storybook failed to start within 30 seconds"
    exit 1
  fi
  echo "✅ Storybook is running!"
fi

# Take screenshots
if [ -z "$STORY_NAME" ]; then
  echo "📸 Taking screenshots for all stories in $COMPONENT_NAME..."
  STORYBOOK_PORT=$STORYBOOK_PORT node scripts/screenshots/utils/take-screenshots.js "$COMPONENT_NAME"
else
  echo "📸 Taking screenshot for $COMPONENT_NAME/$STORY_NAME..."
  STORYBOOK_PORT=$STORYBOOK_PORT node scripts/screenshots/utils/take-screenshots.js "$COMPONENT_NAME" --story "$STORY_NAME"
fi 