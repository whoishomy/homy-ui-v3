#!/bin/bash

# Get all story files
STORY_FILES=$(find src -name "*.stories.tsx" -o -name "*.stories.ts")

# Extract component names from story files
for file in $STORY_FILES; do
  COMPONENT_NAME=$(basename $(dirname $(dirname $file)))
  echo "Taking screenshots for $COMPONENT_NAME..."
  ./scripts/screenshots/screenshot.sh "$COMPONENT_NAME"
done 