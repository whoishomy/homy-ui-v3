/**
 * @promptpack insight-engine
 * @description Central AI engine for generating clinical insights and interpretations
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a clinical AI insight engine specializing in medical interpretation.
Your task is to analyze clinical data and generate comprehensive insights.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate insights for:
   - Lab result patterns
   - Clinical correlations
   - Treatment suggestions
   - Risk assessments
3. Support multiple analysis types:
   - Single result analysis
   - Trend analysis
   - Multi-parameter correlation
   - Clinical context integration
4. Include medical compliance
5. Add helpful comments explaining the logic

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Clinical Insight Engine
# @raycast.mode fullOutput
# @raycast.icon 🧠
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Analysis type (e.g., single-result, trend, correlation)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Clinical domain",
  "data": [
    { "title": "Laboratory", "value": "lab" },
    { "title": "Vitals", "value": "vitals" },
    { "title": "Imaging", "value": "imaging" },
    { "title": "Combined", "value": "combined" }
  ]
}

Please generate a complete shell script that includes:
- Insight generation logic
- Clinical correlation rules
- Integration points
- Compliance checks
- Documentation generation
`;

export const expectedOutput = 'A Raycast-compatible script that generates clinical AI insights';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'insight',
    'engine',
    'clinical',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const insightPatterns = {
  laboratory: {
    'single-result': {
      components: ['Value analysis', 'Reference comparison', 'Clinical significance'],
      outputs: {
        technical: 'Detailed medical interpretation',
        clinical: 'Action-oriented summary',
        patient: 'Simplified explanation',
      },
    },
    trend: {
      components: ['Pattern recognition', 'Delta analysis', 'Prediction'],
      timeframes: {
        short: '24-48 hours',
        medium: '7-14 days',
        long: '30+ days',
      },
    },
    correlation: {
      parameters: ['Related tests', 'Clinical symptoms', 'Treatment effects'],
      analysis: ['Direct correlations', 'Inverse relationships', 'Complex patterns'],
    },
  },
};

export const clinicalLogic = {
  interpretationRules: {
    CBC: {
      WBC: {
        high: 'Consider infection, inflammation, or hematologic disorder',
        low: 'Evaluate for bone marrow suppression or viral infection',
      },
      HGB: {
        high: 'Consider polycythemia or dehydration',
        low: 'Evaluate for anemia, bleeding, or nutritional deficiency',
      },
      PLT: {
        high: 'Consider reactive thrombocytosis or myeloproliferative disorder',
        low: 'Evaluate for consumption, destruction, or decreased production',
      },
    },
    Metabolic: {
      Na: {
        high: 'Evaluate fluid status and water intake',
        low: 'Consider fluid/electrolyte losses or SIADH',
      },
      K: {
        high: 'Urgent evaluation for cardiac risk',
        low: 'Assess for losses and supplement needs',
      },
    },
  },
};

export const sampleInsightComponent = `
import React from 'react';
import { InsightPanel, CorrelationGraph, TrendAnalysis } from '@homy/insight-components';
import { useLabData, useInsightEngine } from '@homy/insight-hooks';

export const InsightView: React.FC<InsightProps> = ({ patientId, domain }) => {
  const { data, history } = useLabData(patientId);
  const { insights, correlations } = useInsightEngine(domain);

  const analysisResults = insights.analyze(data);
  const patterns = correlations.findPatterns(history);

  return (
    <div className="insight-container">
      <InsightPanel
        results={analysisResults}
        className="rounded-lg shadow-md"
      />
      
      <CorrelationGraph
        patterns={patterns}
        className="mt-4 h-64"
      />
      
      <TrendAnalysis
        history={history}
        predictions={insights.predict(history)}
        className="mt-4"
      />
    </div>
  );
};
`;

export const integrationPoints = {
  'lab-insight': {
    input: 'Lab result analysis',
    output: 'Clinical interpretation',
    endpoint: '/api/labs/insights',
  },
  'triage-rules': {
    input: 'Urgency assessment',
    output: 'Action recommendations',
    endpoint: '/api/triage/insights',
  },
  'clinical-context': {
    input: 'Patient history',
    output: 'Contextual analysis',
    endpoint: '/api/clinical/context',
  },
};

export const memoryIntegration = {
  insights: {
    generated: [
      {
        patientId: 'P12345',
        timestamp: '2024-03-21T10:30:00Z',
        domain: 'laboratory',
        type: 'trend',
        findings: [
          'Improving WBC trend over 7 days',
          'Stable electrolyte pattern',
          'Normalized renal function',
        ],
      },
    ],
    components: {
      lastUpdated: '2024-03-21T10:30:00Z',
      active: {
        InsightPanel: true,
        CorrelationGraph: true,
        TrendAnalysis: true,
      },
    },
  },
};
