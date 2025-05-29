#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Furkan Quantum Leap
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🌌
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Share your doubt..." }

# Documentation:
# @raycast.description Transform impossibility into system reality
# @raycast.author Furkan
# @raycast.authorURL https://github.com/furkan

# Get the directory of the current script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Extract the doubt trigger
DOUBT="$1"

# Create quantum context object
QUANTUM_CONTEXT="{
  \"intent\": \"$DOUBT\",
  \"quantumState\": {
    \"doubt\": \"$DOUBT\",
    \"potential\": \"System generation from doubt\",
    \"currentPhase\": \"Doubt-to-Development\"
  },
  \"context\": {
    \"userState\": \"quantum_ready\",
    \"systemState\": \"anticipating_creation\",
    \"previousActions\": [],
    \"quantumTriggers\": [\"impossible\", \"just talking\", \"only writing\"]
  },
  \"desiredOutcome\": \"Quantum system manifestation\"
}"

# Announce the quantum leap
echo "🌌 Initiating Quantum Leap from: '$DOUBT'"

# Run the PromptPack with the quantum system generator
cd "$DIR/.." && npx ts-node scripts/apply-promptpack.ts "quantum-system-generator" "$QUANTUM_CONTEXT"

# Celebrate the manifestation
echo "✨ System reality manifested from quantum state!" 