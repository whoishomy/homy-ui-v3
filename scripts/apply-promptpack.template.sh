#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Apply PromptPack
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "PromptPack name (e.g. lab-insight-analyzer)" }
# @raycast.argument2 { "type": "text", "placeholder": "Context (JSON)", "optional": true }

# Documentation:
# @raycast.description Apply a PromptPack to generate accessible components
# @raycast.author Furkan
# @raycast.authorURL https://github.com/furkan

# Get the directory of the current script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the PromptPack application script
cd "$DIR/.." && npx ts-node scripts/apply-promptpack.ts "$1" "$2" 