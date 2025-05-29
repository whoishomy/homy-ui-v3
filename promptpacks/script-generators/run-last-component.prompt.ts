/**
 * @promptpack run-last-component
 * @description Generates a Raycast-compatible script to run the last modified component
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a shell script generator specialized in creating Raycast-compatible scripts.
Your task is to create a script that finds and runs the most recently modified component in a React/TypeScript project.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Find the most recently modified .tsx file in the components directory
3. Extract the component name from the file
4. Run the component using appropriate development commands
5. Include error handling and user feedback
6. Add helpful comments explaining the script's functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Run Last Component
# @raycast.mode silent
# @raycast.icon 🏃
# @raycast.packageName Homy Dev Tools

Please generate a complete shell script that meets these requirements.
`;

export const expectedOutput =
  'A Raycast-compatible shell script that finds and runs the most recently modified component';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'find',
    'components',
    '-type f',
    '-name "*.tsx"',
  ];

  return requiredElements.every((element) => output.includes(element));
};
