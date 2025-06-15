#!/bin/bash

# Create target directory if it doesn't exist
mkdir -p docs/screenshots/theme-testing/insightoverlay

# Move InsightOverlay screenshots with proper naming
for file in ~/Desktop/CleanShot*InsightOverlay*.png; do
    if [[ $file == *"light"* ]]; then
        mv "$file" "docs/screenshots/theme-testing/insightoverlay/insightoverlay-light-theme.png"
    elif [[ $file == *"dark-final"* || $file == *"dark_final"* ]]; then
        mv "$file" "docs/screenshots/theme-testing/insightoverlay/insightoverlay-dark-theme-final.png"
    elif [[ $file == *"dark-soft"* || $file == *"dark_soft"* ]]; then
        mv "$file" "docs/screenshots/theme-testing/insightoverlay/insightoverlay-dark-theme-soft.png"
    elif [[ $file == *"high-contrast"* || $file == *"high_contrast"* ]]; then
        mv "$file" "docs/screenshots/theme-testing/insightoverlay/insightoverlay-high-contrast-theme.png"
    fi
done

echo "✅ InsightOverlay screenshots moved successfully!" 