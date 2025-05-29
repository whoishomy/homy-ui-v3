#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Furkan Thought
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "What's on your mind?" }

# Documentation:
# @raycast.description Transform your thoughts into system components
# @raycast.author Furkan
# @raycast.authorURL https://github.com/furkan

# Get the directory of the current script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create context object
CONTEXT="{
  \"intent\": \"$1\",
  \"context\": {
    \"userState\": \"thinking\",
    \"systemState\": \"ready\",
    \"previousActions\": []
  },
  \"desiredOutcome\": \"system enhancement\"
}"

# Run the PromptPack with the conversation-to-system template
cd "$DIR/.." && npx ts-node scripts/apply-promptpack.ts "conversation-to-system" "$CONTEXT" 