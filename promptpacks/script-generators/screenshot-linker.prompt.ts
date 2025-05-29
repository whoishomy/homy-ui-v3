/**
 * @promptpack screenshot-linker
 * @description Generates a Raycast-compatible script that automatically links CleanShot screenshots to component README files
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a shell script generator specialized in creating Raycast-compatible scripts.
Your task is to create a script that automatically links CleanShot screenshots to component README files.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Monitor the CleanShot Cloud directory for new screenshots
3. When a new screenshot is detected:
   - Parse the screenshot filename for component context
   - Find the corresponding component's README.md
   - Insert the screenshot with proper markdown syntax
   - Update the memory.json with screenshot metadata
   - Support both light and dark mode screenshots
4. Include error handling and user feedback
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Screenshot Linker
# @raycast.mode silent
# @raycast.icon 🖼️
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Screenshot path or component name" }

Please generate a complete shell script that meets these requirements and includes:
- fswatch for CleanShot directory monitoring
- Intelligent screenshot-to-component matching
- README.md section management (create/update)
- Integration with memory.json logging
- Support for various screenshot naming patterns:
  - ComponentName-feature.png
  - ComponentName-dark-mode.png
  - ComponentName-light-mode.png
  - ComponentName-error-state.png
`;

export const expectedOutput =
  'A Raycast-compatible script that automatically links screenshots to component documentation';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'README.md',
    'CleanShot',
    'fswatch',
    'memory.json',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const sampleReadmeSection = `
## Screenshots

### Light Mode
![ComponentName Light Mode](cleanshot-url-light.png)

### Dark Mode
![ComponentName Dark Mode](cleanshot-url-dark.png)

### Features
![Feature Name](cleanshot-url-feature.png)

### Error States
![Error State](cleanshot-url-error.png)
`;

export const sampleMemoryUpdate = {
  screenshots: [
    {
      filename: 'ComponentName-light-mode.png',
      timestamp: '2024-03-21T10:30:00Z',
      type: 'light-mode',
      url: 'cleanshot-url-light.png',
    },
  ],
};
