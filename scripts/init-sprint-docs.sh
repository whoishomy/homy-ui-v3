#!/bin/bash

# Sprint Documentation Initializer v1.0
# Creates a new sprint documentation structure with screenshots directory

# Default values
SPRINT_NUMBER="24.8"
START_DATE=$(date +"%Y-%m-%d")
END_DATE=$(date -v+2w +"%Y-%m-%d")
FOCUS_AREAS="TypeScript, Linting, UI Components"
SCREENSHOT_COUNT="0"

# Parse command line arguments
while getopts "s:d:e:f:c:" opt; do
  case $opt in
    s) SPRINT_NUMBER="$OPTARG";;
    d) START_DATE="$OPTARG";;
    e) END_DATE="$OPTARG";;
    f) FOCUS_AREAS="$OPTARG";;
    c) SCREENSHOT_COUNT="$OPTARG";;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1;;
  esac
done

# Create sprint directory structure
SPRINT_DIR="docs/sprint-${SPRINT_NUMBER}"
SCREENSHOTS_DIR="${SPRINT_DIR}/screenshots"

mkdir -p "$SCREENSHOTS_DIR"

# Copy and customize template
TEMPLATE_PATH="docs/templates/cleanshot-template.md"
README_PATH="${SCREENSHOTS_DIR}/README.md"

if [ -f "$TEMPLATE_PATH" ]; then
    cp "$TEMPLATE_PATH" "$README_PATH"
    
    # Replace placeholders
    sed -i '' "s/{SPRINT_NUMBER}/${SPRINT_NUMBER}/g" "$README_PATH"
    sed -i '' "s/{START_DATE}/${START_DATE}/g" "$README_PATH"
    sed -i '' "s/{END_DATE}/${END_DATE}/g" "$README_PATH"
    sed -i '' "s/{FOCUS_AREAS}/${FOCUS_AREAS}/g" "$README_PATH"
    sed -i '' "s/{SCREENSHOT_COUNT}/${SCREENSHOT_COUNT}/g" "$README_PATH"
    
    echo "✨ Sprint documentation initialized!"
    echo "📁 Location: $SPRINT_DIR"
    echo "📝 README created at: $README_PATH"
    echo ""
    echo "Usage:"
    echo "1. Take screenshots with CleanShot"
    echo "2. Run ./scripts/cleanshot-auto-sort.sh"
    echo "3. Update screenshot count in README.md"
else
    echo "❌ Template not found at $TEMPLATE_PATH"
    exit 1
fi 