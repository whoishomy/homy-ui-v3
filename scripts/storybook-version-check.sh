#!/bin/bash

echo "🔍 Checking Storybook package versions..."
echo

# Get all @storybook packages
packages=$(yarn list --pattern "@storybook/*" --json)

# Extract versions using jq and sort them
versions=$(echo "$packages" | jq -r '.data.trees[].name' | grep "@storybook" | sed 's/.*@//' | sort -u)

# Print versions
echo "📦 Installed Storybook package versions:"
echo "$versions" | while read -r version; do
  echo "   • $version"
done

# Check if all versions are the same
if [ $(echo "$versions" | wc -l) -eq 1 ]; then
  echo -e "\n✅ All Storybook packages are at the same version!"
else
  echo -e "\n⚠️  Warning: Multiple Storybook versions detected!"
  echo "Please ensure all @storybook/* packages are at the same version."
fi 