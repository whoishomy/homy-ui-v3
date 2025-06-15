#!/bin/bash

# Colors for logging
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base directories
SCREENSHOTS_DIR="docs/screenshots/tayfun"
CLEANSHOT_DIR="$HOME/Documents/CleanShot"  # Default CleanShot directory

# Create directories if they don't exist
mkdir -p "$SCREENSHOTS_DIR"/{login,dashboard,lab-results,care-plan}

# Function to log moves
log_move() {
    local source=$1
    local target=$2
    echo -e "${GREEN}✓${NC} Moved: ${BLUE}$source${NC} → ${BLUE}$target${NC}"
}

# Function to move and rename files
move_and_rename() {
    local source=$1
    local category=$2
    local filename=$3
    local destination="$SCREENSHOTS_DIR/$category/$filename"
    
    mv "$source" "$destination"
    log_move "$source" "$destination"
}

# Watch CleanShot directory for new screenshots
echo "🔍 Watching for new screenshots in $CLEANSHOT_DIR..."
echo "📂 Categories: login, dashboard, lab-results, care-plan"
echo "⚡️ Press Ctrl+C to stop"

fswatch -0 "$CLEANSHOT_DIR" | while read -d "" file; do
    if [[ "$file" =~ .*\.png$ ]]; then
        echo "📸 New screenshot detected: $file"
        echo "Select category:"
        echo "1) login (login-filled.png)"
        echo "2) dashboard (dashboard-insight-open.png)"
        echo "3) lab-results (labresults-multi-results.png)"
        echo "4) care-plan (careplan-generated-plan.png)"
        read -p "Enter number (1-4): " choice
        
        case $choice in
            1) move_and_rename "$file" "login" "login-filled.png" ;;
            2) move_and_rename "$file" "dashboard" "dashboard-insight-open.png" ;;
            3) move_and_rename "$file" "lab-results" "labresults-multi-results.png" ;;
            4) move_and_rename "$file" "care-plan" "careplan-generated-plan.png" ;;
            *) echo "❌ Invalid choice. Screenshot not moved." ;;
        esac
    fi
done

# Theme Testing: InsightOverlay Screenshots
echo "🔍 Processing InsightOverlay theme screenshots..."

for file in ~/Desktop/CleanShot*insightoverlay*.png; do
    # Skip if no matches found
    [[ -e "$file" ]] || continue
    
    target=""
    if [[ $file == *"light"* ]]; then
        target="docs/screenshots/theme-testing/insightoverlay/insightoverlay-light-theme.png"
    elif [[ $file == *"dark-final"* || $file == *"dark_final"* ]]; then
        target="docs/screenshots/theme-testing/insightoverlay/insightoverlay-dark-theme-final.png"
    elif [[ $file == *"dark-soft"* || $file == *"dark_soft"* ]]; then
        target="docs/screenshots/theme-testing/insightoverlay/insightoverlay-dark-theme-soft.png"
    elif [[ $file == *"high-contrast"* || $file == *"high_contrast"* ]]; then
        target="docs/screenshots/theme-testing/insightoverlay/insightoverlay-high-contrast-theme.png"
    fi

    if [[ ! -z "$target" ]]; then
        mv "$file" "$target"
        log_move "$file" "$target"
    fi
done

echo -e "\n${GREEN}✨ CleanShot auto-sort completed!${NC}"
echo "📸 Theme screenshots are organized in docs/screenshots/theme-testing/insightoverlay/" 