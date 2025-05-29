/**
 * @promptpack memory-log-writer
 * @description Generates a Raycast-compatible script that automatically writes memory logs for components
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a shell script generator specialized in creating Raycast-compatible scripts.
Your task is to create a script that automatically maintains memory logs for React/TypeScript components.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Monitor the components directory for changes
3. When a new component is created or modified:
   - Create/update a memory.json file in the component's directory
   - Structure: {
     "componentName": string,
     "lastModified": timestamp,
     "history": [
       {
         "timestamp": string,
         "action": "created" | "modified",
         "promptUsed": string (if available),
         "aiModel": string (if available)
       }
     ],
     "dependencies": string[],
     "experimentalVersions": string[]
   }
4. Include error handling and user feedback
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Memory Log Writer
# @raycast.mode silent
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Component path (optional)" }

Please generate a complete shell script that meets these requirements and includes:
- fswatch or inotify for file monitoring
- jq for JSON manipulation
- Proper error handling for file operations
- Backup of previous memory.json before updates
`;

export const expectedOutput =
  'A Raycast-compatible script that automatically maintains memory logs for components';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'memory.json',
    'jq',
    'timestamp',
    'componentName',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const sampleMemoryJson = {
  componentName: 'ExampleComponent',
  lastModified: '2024-03-21T10:30:00Z',
  history: [
    {
      timestamp: '2024-03-21T10:30:00Z',
      action: 'created',
      promptUsed: 'create-new-component',
      aiModel: 'Claude-3-Sonnet',
    },
  ],
  dependencies: ['@radix-ui/react-dialog', '@emotion/styled'],
  experimentalVersions: ['ExampleComponent.experimental.tsx'],
};
