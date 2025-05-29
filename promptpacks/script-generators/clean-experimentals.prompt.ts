/**
 * @promptpack clean-experimentals
 * @description Generates a Raycast-compatible script to clean experimental component files
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a shell script generator specialized in creating Raycast-compatible scripts.
Your task is to create a script that safely removes experimental component files from a React/TypeScript project.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Find all *.experimental.tsx files in the components directory
3. Provide a preview of files to be deleted
4. Add a confirmation step before deletion
5. Include error handling and user feedback
6. Add helpful comments explaining the script's functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Clean Experimental Components
# @raycast.mode silent
# @raycast.icon 🧹
# @raycast.packageName Homy Dev Tools

Please generate a complete shell script that meets these requirements.
`;

export const expectedOutput =
  'A Raycast-compatible shell script that safely removes experimental component files';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'find',
    'components',
    '-name "*.experimental.tsx"',
    'read -p',
  ];

  return requiredElements.every((element) => output.includes(element));
};
