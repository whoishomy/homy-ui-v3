/**
 * @promptpack tone-switcher
 * @description Generates a Raycast-compatible script that transforms Claude's output into different communication tones
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a script generator specialized in creating Raycast-compatible scripts.
Your task is to create a script that transforms AI outputs into different communication tones.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Support multiple tone profiles:
   - Medical Professional (formal, precise, clinical)
   - Patient-Friendly (warm, clear, empathetic)
   - Marketing (engaging, persuasive, benefit-focused)
   - Technical (detailed, systematic, developer-oriented)
   - Executive (concise, strategic, business-focused)
3. Handle input from:
   - Direct text
   - Clipboard content
   - File content
4. Include tone customization options
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Tone Switcher
# @raycast.mode fullOutput
# @raycast.icon 🎙️
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Input text or file path" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Select tone", 
  "data": [
    { "title": "Medical Professional", "value": "medical" },
    { "title": "Patient-Friendly", "value": "patient" },
    { "title": "Marketing", "value": "marketing" },
    { "title": "Technical", "value": "technical" },
    { "title": "Executive", "value": "executive" }
  ]
}

Please generate a complete shell script that includes:
- Integration with Claude API for tone transformation
- Tone profile definitions and templates
- Input handling and validation
- Output formatting with proper styling
- Error handling and feedback
`;

export const expectedOutput =
  'A Raycast-compatible script that transforms text into different communication tones';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'tone_profile',
    'claude_api',
    'transform_text',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const toneProfiles = {
  medical: {
    style: 'formal, precise, clinical',
    vocabulary: 'medical terminology, scientific accuracy',
    structure: 'systematic, evidence-based',
    example: {
      input: 'Your heart is working well.',
      output:
        'Cardiac function is within normal parameters. Vital signs indicate optimal cardiovascular performance.',
    },
  },
  patient: {
    style: 'warm, clear, empathetic',
    vocabulary: 'everyday language, relatable terms',
    structure: 'conversational, supportive',
    example: {
      input: 'Your heart is working well.',
      output:
        "Great news! Your heart is healthy and doing its job perfectly. This means you're taking good care of yourself.",
    },
  },
  marketing: {
    style: 'engaging, persuasive, dynamic',
    vocabulary: 'benefit-focused, action-oriented',
    structure: 'compelling, solution-focused',
    example: {
      input: 'This tool automates documentation.',
      output:
        'Transform your workflow with our revolutionary documentation automation! Save hours while creating perfect docs every time.',
    },
  },
};

export const transformationPrompt = `
Convert the following text to a {tone} tone while maintaining the core information:

Text: {input}

Tone Profile:
- Style: {style}
- Vocabulary: {vocabulary}
- Structure: {structure}

Please transform the text accordingly.
`;

export const sampleMemoryUpdate = {
  transformations: [
    {
      timestamp: '2024-03-21T10:30:00Z',
      originalText: 'Input text example',
      tone: 'medical',
      transformedText: 'Transformed output example',
    },
  ],
};
