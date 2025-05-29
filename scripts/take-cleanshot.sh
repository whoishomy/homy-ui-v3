#!/bin/bash

# Default values
DEFAULT_WIDTH=390
SCREENSHOTS_BASE_DIR="docs/screenshots"

# Help function
show_help() {
    echo "Usage: ./scripts/take-cleanshot.sh <category> <screenshot-name> [width]"
    echo ""
    echo "Arguments:"
    echo "  category        Screenshot category (e.g., mobile-dashboard, lab-result)"
    echo "  screenshot-name Name of the screenshot (e.g., dashboard-main)"
    echo "  width          Optional: viewport width (default: ${DEFAULT_WIDTH}px)"
    echo ""
    echo "Example:"
    echo "  ./scripts/take-cleanshot.sh mobile-dashboard dashboard-main 390"
    echo ""
    echo "Available categories:"
    echo "  - mobile-dashboard"
    echo "  - lab-result"
    echo "  - insight-overlay"
    echo "  - focus-coach"
    echo "  - health-score-trend"
    echo "  - category-distribution-chart"
    exit 1
}

# Validate category
validate_category() {
    local valid_categories=(
        "mobile-dashboard"
        "lab-result"
        "insight-overlay"
        "focus-coach"
        "health-score-trend"
        "category-distribution-chart"
    )
    
    for category in "${valid_categories[@]}"; do
        if [ "$1" == "$category" ]; then
            return 0
        fi
    done
    return 1
}

# Function to take screenshot
take_screenshot() {
    local category=$1
    local name=$2
    local width=${3:-$DEFAULT_WIDTH}
    local date=$(date +"%d-%b-%Y")
    local output_dir="${SCREENSHOTS_BASE_DIR}/${category}"
    local filename="${name}.png"
    local full_path="${output_dir}/${filename}"
    
    # Calculate height based on width (using 16:9 aspect ratio)
    local height=$((width * 844 / 390))
    
    echo "📸 Screenshot Configuration:"
    echo "   Category: ${category}"
    echo "   Name: ${name}"
    echo "   Resolution: ${width}x${height}"
    echo "   Output: ${full_path}"
    echo ""
    
    # Ensure directory exists
    mkdir -p "$output_dir"
    
    # Instructions for capturing
    echo "🎯 Capture Instructions:"
    echo "1. Open DevTools (Cmd + Option + I)"
    echo "2. Toggle device toolbar (Cmd + Shift + M)"
    echo "3. Set custom size: ${width}x${height}"
    echo "4. Use CleanShot (Shift + Cmd + 4)"
    echo "5. Save as: ${filename}"
    echo ""
    
    # Wait for user confirmation
    read -p "Press Enter after saving the screenshot..."
    
    # Check if file exists
    if [ -f "$full_path" ]; then
        echo "✅ Screenshot saved successfully!"
        echo "📁 Location: ${full_path}"
    else
        echo "⚠️  Warning: Screenshot file not found at ${full_path}"
        echo "Please make sure to save with the exact filename: ${filename}"
    fi
}

# Main script
if [ $# -lt 2 ]; then
    show_help
fi

category=$1
name=$2
width=${3:-$DEFAULT_WIDTH}

# Validate category
if ! validate_category "$category"; then
    echo "❌ Error: Invalid category '${category}'"
    echo ""
    show_help
fi

# Take screenshot
take_screenshot "$category" "$name" "$width" 