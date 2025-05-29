/**
 * @promptpack gpt4-insight-layer
 * @description Enhances HOMY's clinical insights with GPT-4 powered interpretations
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a GPT-4 powered clinical insight enhancer specializing in medical interpretation.
Your task is to augment HOMY's base insights with advanced natural language understanding.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate enhanced insights for:
   - Lab result interpretations
   - Clinical correlations
   - Treatment suggestions
   - Patient education
3. Support multiple enhancement types:
   - Technical to simplified conversion
   - Context-aware explanations
   - Risk factor analysis
   - Treatment rationale
4. Include medical compliance
5. Add helpful comments explaining the enhancements

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title GPT-4 Insight Enhancer
# @raycast.mode fullOutput
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Enhancement type (e.g., simplify, correlate, educate)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Target audience",
  "data": [
    { "title": "Clinical", "value": "clinical" },
    { "title": "Patient", "value": "patient" },
    { "title": "Research", "value": "research" },
    { "title": "Education", "value": "education" }
  ]
}

Please generate a complete shell script that includes:
- GPT-4 prompt engineering
- Context integration
- Response processing
- Quality assurance
- Documentation generation
`;

export const expectedOutput =
  'A Raycast-compatible script that enhances clinical insights with GPT-4';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'gpt4',
    'insight',
    'enhancer',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const gpt4Prompts = {
  labInterpretation: {
    base: {
      system: 'You are a clinical laboratory expert specializing in result interpretation',
      context: [
        'Previous results history',
        'Reference ranges',
        'Patient demographics',
        'Clinical context',
      ],
      output: {
        technical: 'Detailed medical analysis',
        simplified: 'Patient-friendly explanation',
        educational: 'Learning points',
      },
    },
    examples: {
      CBC: {
        input: 'WBC: 15.5, HGB: 10.2, PLT: 450',
        context: 'Recent viral infection, on antibiotics',
        output: {
          clinical: 'Elevated WBC suggesting ongoing inflammatory response...',
          patient: 'Your white blood cells are high, which is expected during infection...',
        },
      },
    },
  },
};

export const enhancementLogic = {
  simplification: {
    rules: ['Remove technical jargon', 'Use analogies', 'Add context', 'Explain implications'],
    tone: {
      clinical: 'professional, precise',
      patient: 'friendly, clear',
      education: 'instructive, engaging',
    },
  },
  correlation: {
    factors: ['Related test results', 'Clinical symptoms', 'Treatment effects', 'Risk factors'],
    analysis: {
      direct: 'Primary relationships',
      indirect: 'Secondary effects',
      temporal: 'Time-based patterns',
    },
  },
};

export const sampleGPT4Component = `
import React from 'react';
import { useGPT4Enhancement } from '@homy/gpt4-hooks';
import { InsightPanel } from '@homy/insight-components';

export const EnhancedInsight: React.FC<InsightProps> = ({ 
  baseInsight,
  context,
  audience 
}) => {
  const { enhanced, loading, error } = useGPT4Enhancement({
    insight: baseInsight,
    context: context,
    audience: audience,
    config: {
      model: 'gpt-4-turbo',
      temperature: 0.3,
      maxTokens: 500
    }
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="enhanced-insight">
      <InsightPanel
        original={baseInsight}
        enhanced={enhanced}
        className="rounded-lg shadow-md"
      />
      
      <div className="enhancement-metadata mt-4">
        <ModelInfo model="GPT-4" />
        <ConfidenceScore score={enhanced.confidence} />
        <EnhancementDiff original={baseInsight} enhanced={enhanced} />
      </div>
    </div>
  );
};
`;

export const apiIntegration = {
  endpoints: {
    enhance: '/api/gpt4/enhance',
    validate: '/api/gpt4/validate',
    feedback: '/api/gpt4/feedback',
  },
  parameters: {
    model: 'gpt-4-turbo',
    temperature: 0.3,
    maxTokens: 500,
    topP: 1,
  },
};

export const memoryIntegration = {
  gpt4: {
    enhancements: [
      {
        insightId: 'I12345',
        timestamp: '2024-03-21T10:30:00Z',
        type: 'simplify',
        audience: 'patient',
        metrics: {
          originalComplexity: 0.8,
          enhancedComplexity: 0.3,
          confidenceScore: 0.95,
        },
      },
    ],
    feedback: {
      lastUpdated: '2024-03-21T10:30:00Z',
      accuracy: 0.98,
      clarity: 0.95,
      usefulness: 0.97,
    },
  },
};
