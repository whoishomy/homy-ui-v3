/**
 * @promptpack system-insight-analyzer
 * @description Generates a script that helps Claude analyze and provide insights about the RunStart system
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are an AI system analyst specialized in understanding and evolving AI-driven architectures.
Your task is to analyze the RunStart system manifesto and provide deep insights about its potential.

Requirements:
1. Read and analyze the RunStart manifesto
2. Generate insights about:
   - System architecture patterns
   - AI integration points
   - Evolution potential
   - Cognitive workflows
   - Meta-learning capabilities
3. Provide recommendations for:
   - New PromptPack opportunities
   - System expansion areas
   - Integration patterns
   - Future capabilities
4. Format output as structured markdown
5. Include actionable next steps

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title System Insight Analyzer
# @raycast.mode fullOutput
# @raycast.icon 🔮
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Path to manifesto or system component" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Analysis type",
  "data": [
    { "title": "Architecture Analysis", "value": "architecture" },
    { "title": "Evolution Potential", "value": "evolution" },
    { "title": "Integration Patterns", "value": "integration" },
    { "title": "Future Roadmap", "value": "roadmap" }
  ]
}

Please generate a complete shell script that includes:
- Manifesto parsing and analysis
- Pattern recognition in system design
- Integration opportunity detection
- Future capability prediction
- Markdown report generation
`;

export const expectedOutput =
  'A Raycast-compatible script that analyzes system architecture and provides AI-driven insights';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'analysis',
    'insight',
    'markdown',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const analysisTemplate = {
  architecture: {
    patterns: ['Thought-to-Code Translation', 'Memory-Aware Development', 'Self-Extending Systems'],
    integrations: ['Claude-Cursor Bridge', 'Raycast UI Layer', 'Memory JSON Store'],
    workflows: ['PromptPack Generation', 'System Evolution', 'Cognitive Architecture'],
  },
  evolution: {
    current: 'AI-Driven Build System',
    potential: 'Self-Aware Development Environment',
    paths: ['Enhanced AI Integration', 'Pattern Learning', 'Workflow Optimization'],
  },
  recommendations: {
    promptpacks: [
      {
        name: 'pattern-learner',
        purpose: 'Learn from developer thought patterns',
        impact: 'System becomes more intuitive',
      },
      {
        name: 'workflow-optimizer',
        purpose: 'Enhance development paths',
        impact: 'Reduced cognitive load',
      },
    ],
    integrations: [
      {
        type: 'AI Models',
        purpose: 'Expand intelligence layer',
        examples: ['GPT-4', 'Claude-3', 'Anthropic'],
      },
      {
        type: 'Development Tools',
        purpose: 'Enhance workflow',
        examples: ['VS Code', 'GitHub', 'Jira'],
      },
    ],
  },
};

export const sampleInsightReport = `
# RunStart System Analysis

## 🧠 Core Patterns
- System thinks in developer intentions
- Translates thoughts to executable code
- Maintains cognitive memory

## 🚀 Evolution Potential
- Self-learning capabilities
- Pattern recognition
- Workflow optimization

## 💡 Recommendations
1. New PromptPacks:
   - Workflow analyzer
   - Pattern learner
   - Integration hub

2. System Expansions:
   - AI model integration
   - Tool connectivity
   - Memory enhancement

## 🎯 Next Steps
1. Implement pattern learning
2. Enhance memory system
3. Expand AI capabilities
`;

export const memoryIntegration = {
  insights: {
    analyses: [
      {
        timestamp: '2024-03-21T10:30:00Z',
        type: 'architecture',
        findings: ['pattern1', 'pattern2'],
        recommendations: ['action1', 'action2'],
      },
    ],
    evolution: {
      patterns: {
        discovered: ['pattern1', 'pattern2'],
        potential: ['future1', 'future2'],
      },
      recommendations: {
        immediate: ['step1', 'step2'],
        longTerm: ['vision1', 'vision2'],
      },
    },
  },
};
