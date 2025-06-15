#!/bin/bash

# Colors for logging
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory for theme screenshots
THEME_SCREENSHOTS_DIR="docs/screenshots/theme-testing/insightoverlay"

# Create directory if it doesn't exist
mkdir -p "$THEME_SCREENSHOTS_DIR"

# Function to log messages
log_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_wait() {
    echo -e "${YELLOW}⏳ $1${NC}"
}

# Function to move and rename screenshots
move_screenshot() {
    local source=$1
    local theme=$2
    local target="$THEME_SCREENSHOTS_DIR/insightoverlay-${theme}-theme.png"
    
    if [ -f "$source" ]; then
        mv "$source" "$target"
        log_success "Moved $theme theme screenshot to $target"
    else
        log_info "No screenshot found for $theme theme"
    fi
}

# Main process
log_info "Starting theme screenshot automation..."
log_info "Make sure Storybook is running on http://localhost:6012"

# Process each theme
themes=("light" "dark" "high-contrast")
for theme in "${themes[@]}"; do
    log_wait "Please switch to ${theme} theme in Storybook and take a screenshot..."
    log_wait "Save it as 'CleanShot-${theme}-theme.png' on your Desktop"
    read -p "Press Enter when you've taken the screenshot for ${theme} theme..."
    
    move_screenshot ~/Desktop/CleanShot-${theme}-theme.png "$theme"
done

# Final message
log_success "Theme screenshots completed! 🎉"
echo -e "\nScreenshots are organized in: $THEME_SCREENSHOTS_DIR"
echo -e "Files created:"
ls -l "$THEME_SCREENSHOTS_DIR" 