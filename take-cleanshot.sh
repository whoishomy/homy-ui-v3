#!/bin/bash

# Create the base directories if they don't exist
mkdir -p docs/screenshots/mobile-dashboard
mkdir -p docs/screenshots/lab-results/high
mkdir -p docs/screenshots/lab-results/states

# Function to validate screenshot name
validate_name() {
    local valid_names=(
        "dashboard-main"
        "tabs-switch-daily"
        "tabs-switch-weekly"
        "health-score-trend"
        "category-distribution-chart"
        "ai-insight-overlay"
        "lab-result-high"
        "lab-result-loading"
        "lab-result-error"
    )
    
    for name in "${valid_names[@]}"; do
        if [ "$1" == "$name" ]; then
            return 0
        fi
    done
    return 1
}

# Function to take screenshot
take_screenshot() {
    local name=$1
    local date=$(date +"%d-%b-%Y")
    local resolution="390x844"
    local output_dir="docs/screenshots/mobile-dashboard"
    
    # Override output directory for lab results
    if [[ "$name" == "lab-result-high" ]]; then
        output_dir="docs/screenshots/lab-results/high"
    elif [[ "$name" == "lab-result-loading" || "$name" == "lab-result-error" ]]; then
        output_dir="docs/screenshots/lab-results/states"
    fi
    
    local filename="${name}.png"
    local full_path="${output_dir}/${filename}"
    
    echo "📸 Taking screenshot for: ${name}"
    echo "📁 Saving to: ${full_path}"
    
    # Ensure directory exists
    mkdir -p "$output_dir"
    
    # Wait for CleanShot to complete
    echo "🎯 Please use ⌘ + ⇧ + 5 to capture the screen"
    echo "💾 Save the file as: ${filename}"
    
    # Wait for user confirmation
    read -p "Press Enter after saving the screenshot..."
    
    # Check if file exists
    if [ -f "$full_path" ]; then
        echo "✅ Screenshot saved successfully!"
    else
        echo "⚠️  Warning: Screenshot file not found at ${full_path}"
    fi
}

# Main script
if [ $# -eq 0 ]; then
    echo "Usage: ./take-cleanshot.sh <screenshot-name>"
    echo "Valid names:"
    echo "  - dashboard-main"
    echo "  - tabs-switch-daily"
    echo "  - tabs-switch-weekly"
    echo "  - health-score-trend"
    echo "  - category-distribution-chart"
    echo "  - ai-insight-overlay"
    echo "  - lab-result-high"
    echo "  - lab-result-loading"
    echo "  - lab-result-error"
    exit 1
fi

screenshot_name=$1

if ! validate_name "$screenshot_name"; then
    echo "❌ Error: Invalid screenshot name"
    echo "Valid names:"
    echo "  - dashboard-main"
    echo "  - tabs-switch-daily"
    echo "  - tabs-switch-weekly"
    echo "  - health-score-trend"
    echo "  - category-distribution-chart"
    echo "  - ai-insight-overlay"
    echo "  - lab-result-high"
    echo "  - lab-result-loading"
    echo "  - lab-result-error"
    exit 1
fi

take_screenshot "$screenshot_name" 