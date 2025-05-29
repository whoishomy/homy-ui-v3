/**
 * @promptpack promptpack-generator
 * @description Generates a Raycast-compatible script that helps create new PromptPacks automatically
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a meta-generator specialized in creating new PromptPack templates.
Your task is to create a script that helps generate new PromptPacks with proper structure and metadata.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate PromptPack structure with:
   - Metadata section (@promptpack, @description, etc.)
   - Main prompt template
   - Validation rules
   - Sample outputs and examples
   - Memory integration specs
3. Support multiple PromptPack categories:
   - Script Generators (automation scripts)
   - System Tools (infrastructure)
   - AI Helpers (Claude interactions)
4. Include template customization
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title PromptPack Generator
# @raycast.mode fullOutput
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "PromptPack name (e.g. component-creator)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Category",
  "data": [
    { "title": "Script Generators", "value": "script-generators" },
    { "title": "System Tools", "value": "system-tools" },
    { "title": "AI Helpers", "value": "ai-helpers" }
  ]
}

Please generate a complete shell script that includes:
- PromptPack template generation
- Intelligent metadata handling
- Category-specific customization
- Integration with existing PromptPacks
- Error handling and validation
`;

export const expectedOutput = 'A Raycast-compatible script that generates new PromptPack templates';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'promptpack',
    'template',
    'metadata',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const templateStructure = {
  metadata: {
    promptpack: 'string (name)',
    description: 'string (purpose)',
    author: 'string (creator)',
    version: 'string (semver)',
  },
  sections: {
    prompt: 'string (main template)',
    validation: 'function (output checker)',
    examples: 'object (sample inputs/outputs)',
    memory: 'object (state tracking)',
  },
  categories: {
    'script-generators': {
      path: 'promptpacks/script-generators',
      template: 'script-template.ts',
      metadata: ['raycast', 'bash', 'automation'],
    },
    'system-tools': {
      path: 'promptpacks/system-tools',
      template: 'tool-template.ts',
      metadata: ['system', 'infrastructure', 'workflow'],
    },
    'ai-helpers': {
      path: 'promptpacks/ai-helpers',
      template: 'ai-template.ts',
      metadata: ['claude', 'interaction', 'enhancement'],
    },
  },
};

export const samplePromptPack = {
  name: 'component-creator',
  category: 'script-generators',
  description: 'Generates React components with proper structure and testing',
  template: {
    metadata: {
      '@promptpack': 'component-creator',
      '@description': 'Creates standardized React components',
      '@author': 'Furkan',
      '@version': '1.0.0',
    },
    sections: {
      prompt: 'Template for component generation...',
      validation: 'Function to verify component structure...',
      examples: {
        input: 'Button component with variants',
        output: 'Complete component structure',
      },
    },
  },
};

export const memoryIntegration = {
  promptpacks: {
    created: [
      {
        name: 'component-creator',
        timestamp: '2024-03-21T10:30:00Z',
        category: 'script-generators',
        status: 'active',
      },
    ],
    templates: {
      lastUpdated: '2024-03-21T10:30:00Z',
      activeVersions: {
        script: '1.0.0',
        tool: '1.0.0',
        ai: '1.0.0',
      },
    },
  },
};
