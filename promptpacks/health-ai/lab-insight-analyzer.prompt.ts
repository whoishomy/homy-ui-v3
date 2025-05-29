/**
 * @promptpack lab-insight-analyzer
 * @description Generates an AI-powered system for analyzing and visualizing laboratory results
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a clinical laboratory AI specialist focused on result analysis and visualization.
Your task is to create a system that interprets lab results with clinical context and patient-friendly explanations.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate components for:
   - Result interpretation panel
   - Trend visualization
   - Reference range display
   - Clinical context cards
   - Patient-friendly explanations
3. Support multiple result types:
   - Blood tests (CBC, Chemistry, etc.)
   - Urine analysis
   - Imaging reports
   - Pathology results
4. Include FHIR compliance
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Lab Insight Analyzer
# @raycast.mode fullOutput
# @raycast.icon 🔬
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Lab result type (e.g., cbc, chemistry)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "View mode",
  "data": [
    { "title": "Clinical View", "value": "clinical" },
    { "title": "Patient View", "value": "patient" },
    { "title": "Technical View", "value": "technical" },
    { "title": "Research View", "value": "research" }
  ]
}

Please generate a complete shell script that includes:
- Lab result parsing and analysis
- Clinical interpretation generation
- Visualization component creation
- FHIR data mapping
- Documentation generation
`;

export const expectedOutput = 'A Raycast-compatible script that generates lab result analysis and visualization components';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'lab',
    'result',
    'analysis'
  ];

  return requiredElements.every(element => output.includes(element));
};

export const labComponents = {
  "ResultPanel": {
    "views": {
      "clinical": {
        "sections": ["Test Results", "Reference Ranges", "Clinical Context"],
        "components": ["ValueTable", "RangeIndicator", "ClinicalNotes"]
      },
      "patient": {
        "sections": ["Your Results", "What This Means", "Next Steps"],
        "components": ["SimplifiedView", "ExplanationCard", "ActionGuide"]
      }
    },
    "features": ["Trend tracking", "Abnormal highlighting", "Context tooltips"]
  },
  "TrendGraph": {
    "types": ["Line chart", "Range plot", "Heat map"],
    "features": ["Time series", "Multiple markers", "Range overlays"],
    "interactions": ["Zoom", "Pan", "Point details"]
  },
  "AlertBadge": {
    "types": {
      "critical": "Immediate attention required",
      "abnormal": "Outside reference range",
      "trending": "Significant change detected",
      "normal": "Within expected range"
    }
  }
};

export const sampleResultTemplate = \`
import React from 'react';
import { ResultPanel, TrendGraph, AlertBadge } from '@homy/lab-components';
import { useLabResult, useReferenceRanges } from '@homy/lab-hooks';

export const LabResultView: React.FC<LabResultProps> = ({ resultId, viewMode }) => {
  const { result, loading, error } = useLabResult(resultId);
  const { ranges } = useReferenceRanges(result?.testType);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="lab-result-container">
      <ResultPanel
        result={result}
        ranges={ranges}
        viewMode={viewMode}
        className="rounded-lg shadow-md"
      />
      
      <TrendGraph
        data={result.history}
        ranges={ranges}
        className="mt-4 h-64"
      />
      
      {result.alerts.map(alert => (
        <AlertBadge
          key={alert.id}
          type={alert.type}
          message={alert.message}
          className="mt-2"
        />
      ))}
    </div>
  );
};
\`;

export const fhirMapping = {
  "observation": {
    "resourceType": "Observation",
    "category": "laboratory",
    "code": {
      "system": "http://loinc.org",
      "code": "LOINC_CODE",
      "display": "Test Name"
    },
    "valueQuantity": {
      "value": "RESULT_VALUE",
      "unit": "UNIT",
      "system": "http://unitsofmeasure.org"
    }
  }
};

export const memoryIntegration = {
  "results": {
    "analyzed": [
      {
        "resultId": "CBC-123",
        "timestamp": "2024-03-21T10:30:00Z",
        "type": "CBC",
        "insights": {
          "clinical": ["Finding 1", "Finding 2"],
          "trends": ["Trend 1", "Trend 2"]
        }
      }
    ],
    "visualizations": {
      "lastUpdated": "2024-03-21T10:30:00Z",
      "components": {
        "ResultPanel": true,
        "TrendGraph": true,
        "AlertBadge": true
      }
    }
  }
}; 