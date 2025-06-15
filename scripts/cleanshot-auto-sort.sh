#!/bin/bash

# CleanShot Auto-Sort Script v1.0
# Automatically organizes CleanShot screenshots into sprint directories

# Configuration
SCREENSHOTS_DIR="$HOME/Desktop/CleanShot"
DOCS_DIR="docs"
CURRENT_SPRINT="sprint-24.8"

# Create sprint screenshots directory if it doesn't exist
mkdir -p "${DOCS_DIR}/${CURRENT_SPRINT}/screenshots"

# Function to generate a clean filename
clean_filename() {
    local filename=$1
    # Convert to lowercase and replace spaces with hyphens
    echo "$filename" | tr '[:upper:]' '[:lower:]' | tr ' ' '-'
}

# Function to determine screenshot type
get_screenshot_type() {
    local filename=$1
    if [[ $filename == *"typescript"* || $filename == *"ts"* ]]; then
        echo "ts"
    elif [[ $filename == *"lint"* || $filename == *"markdown"* ]]; then
        echo "lint"
    elif [[ $filename == *"ui"* || $filename == *"component"* ]]; then
        echo "ui"
    else
        echo "other"
    fi
}

# Process screenshots
for file in "${SCREENSHOTS_DIR}"/*.{png,jpg,jpeg}; do
    if [ -f "$file" ]; then
        # Get filename without path and extension
        filename=$(basename "$file")
        extension="${filename##*.}"
        filename="${filename%.*}"
        
        # Clean up filename
        clean_name=$(clean_filename "$filename")
        
        # Get screenshot type
        type=$(get_screenshot_type "$filename")
        
        # Generate new filename with type prefix if not already present
        if [[ $clean_name != *"-$type-"* ]]; then
            new_name="${type}-${clean_name}"
        else
            new_name="${clean_name}"
        fi
        
        # Move and rename file
        mv "$file" "${DOCS_DIR}/${CURRENT_SPRINT}/screenshots/${new_name}.${extension}"
        
        echo "✓ Moved: ${filename}.${extension} → ${new_name}.${extension}"
    fi
done

echo "🎉 Screenshots organized successfully!"
echo "📁 Location: ${DOCS_DIR}/${CURRENT_SPRINT}/screenshots/" 