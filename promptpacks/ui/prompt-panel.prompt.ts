/**
 * @promptpack prompt-panel
 * @description Generates a Raycast UI panel for managing and launching PromptPacks
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a script generator specialized in creating Raycast UI commands.
Your task is to create a beautiful and intuitive UI panel for managing PromptPacks.

Requirements:
1. Create a Raycast command with a modern UI
2. List and organize all PromptPacks with their metadata
3. Show detailed information for each PromptPack:
   - Name and description
   - Preview of the prompt template
   - Expected output format
   - Sample usage and examples
4. Provide quick actions:
   - Apply: Send to Claude/Cursor
   - Preview: Show the full prompt
   - Edit: Open in VS Code
   - Copy: Get prompt text
5. Include search and filtering capabilities

The command should follow this template:
#!/usr/bin/env node

// Raycast metadata
// @raycast.schemaVersion 1
// @raycast.title RunStart PromptPack Launcher
// @raycast.mode view
// @raycast.icon 🧠
// @raycast.packageName Homy Dev Tools

Please generate a complete Raycast command that includes:
- Modern UI components from @raycast/api
- Grid or list view of PromptPacks
- Detailed view with syntax highlighting
- Quick action buttons with icons
- Search and filter functionality
- Integration with VS Code and Cursor
- Error handling and loading states
`;

export const expectedOutput =
  'A Raycast UI command that provides a beautiful interface for managing PromptPacks';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '@raycast/api',
    'export default function Command()',
    'List',
    'Detail',
    'ActionPanel',
    'Grid',
    'searchText',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const sampleUiStructure = {
  views: {
    list: {
      sections: [
        {
          title: 'Script Generators',
          items: [
            'run-last-component',
            'clean-experimentals',
            'memory-log-writer',
            'screenshot-linker',
          ],
        },
        {
          title: 'System Tools',
          items: ['tone-switcher', 'promptpack-generator'],
        },
      ],
    },
    detail: {
      metadata: {
        title: 'PromptPack Details',
        sections: ['Description', 'Prompt Template', 'Expected Output', 'Sample Usage'],
      },
      actions: [
        {
          title: 'Apply',
          icon: '▶️',
          shortcut: '⌘ + ⏎',
        },
        {
          title: 'Preview',
          icon: '👁',
          shortcut: '⌘ + P',
        },
        {
          title: 'Edit',
          icon: '✏️',
          shortcut: '⌘ + E',
        },
      ],
    },
  },
  theme: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      warning: '#FF9500',
    },
    typography: {
      title: 'SF Pro Display',
      body: 'SF Pro Text',
    },
  },
};

export const samplePromptMetadata = {
  id: 'run-last-component',
  title: 'Run Last Component',
  description: 'Generates a script to run the most recently modified component',
  category: 'Script Generators',
  icon: '🏃',
  tags: ['component', 'development', 'automation'],
  author: 'Furkan',
  version: '1.0.0',
  lastUsed: '2024-03-21T10:30:00Z',
  usageCount: 42,
};
