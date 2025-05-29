#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Transfer PromptPack to HOMY
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 📊
# @raycast.packageName Homy Dev Tools
# @raycast.author Furkan
# @raycast.description Transfer visualization PromptPack to HOMY project

# Configuration
WORKSPACE_DIR="$HOME/homy-ui-v3"
FROM_DIR="$WORKSPACE_DIR/promptpacks/health-ai"
TO_DIR="$WORKSPACE_DIR/src/ai/promptpacks"
PROMPT_FILE="advanced-visualizations.prompt.ts"

echo "🚀 Transferring visualization PromptPack..."

# Create destination directory if it doesn't exist
mkdir -p "$TO_DIR"

# Copy the PromptPack file
if [ -f "$FROM_DIR/$PROMPT_FILE" ]; then
  cp "$FROM_DIR/$PROMPT_FILE" "$TO_DIR/"
  echo "✅ PromptPack transferred successfully to: $TO_DIR/$PROMPT_FILE"
else
  # If source file doesn't exist, create it first
  mkdir -p "$FROM_DIR"
  cp "$WORKSPACE_DIR/promptpacks/health-ai/advanced-visualizations.prompt.ts" "$FROM_DIR/$PROMPT_FILE"
  
  if [ $? -eq 0 ]; then
    cp "$FROM_DIR/$PROMPT_FILE" "$TO_DIR/"
    echo "✅ PromptPack created and transferred successfully"
  else
    echo "❌ Failed to create PromptPack file"
    exit 1
  fi
fi

# Update memory.json with visualization preferences
MEMORY_FILE="$WORKSPACE_DIR/src/ai/memory.json"
if [ -f "$MEMORY_FILE" ]; then
  # Add visualization config using jq
  jq '.visualizations = {
    "preferences": {
      "theme": "clinical",
      "animations": true,
      "performance": "balanced"
    }
  }' "$MEMORY_FILE" > "$MEMORY_FILE.tmp" && mv "$MEMORY_FILE.tmp" "$MEMORY_FILE"
  
  echo "💾 Memory configuration updated"
fi

echo "🎨 Visualization system ready!" 