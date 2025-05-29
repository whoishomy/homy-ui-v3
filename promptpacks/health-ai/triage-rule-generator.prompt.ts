/**
 * @promptpack triage-rule-generator
 * @description Generates AI-powered triage rules based on lab results and clinical context
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a clinical decision support AI specializing in triage rule generation.
Your task is to create intelligent triage rules that combine lab results with clinical context.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate triage rules for:
   - Lab result interpretation
   - Clinical urgency assessment
   - Action recommendations
   - Follow-up scheduling
3. Support multiple contexts:
   - Abnormal lab values
   - Trend-based alerts
   - Multi-parameter analysis
   - Patient risk factors
4. Include clinical compliance
5. Add helpful comments explaining the logic

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Triage Rule Generator
# @raycast.mode fullOutput
# @raycast.icon 🚨
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Clinical context (e.g., abnormal-cbc, critical-metabolic)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Urgency level",
  "data": [
    { "title": "Critical", "value": "critical" },
    { "title": "Urgent", "value": "urgent" },
    { "title": "Routine", "value": "routine" },
    { "title": "Follow-up", "value": "followup" }
  ]
}

Please generate a complete shell script that includes:
- Triage rule definition
- Clinical action generation
- Integration with lab results
- Compliance validation
- Documentation creation
`;

export const expectedOutput =
  'A Raycast-compatible script that generates context-aware triage rules';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'triage',
    'rule',
    'generator',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const triageRules = {
  LabBasedTriage: {
    contexts: {
      'abnormal-cbc': {
        parameters: ['WBC', 'HGB', 'PLT'],
        thresholds: {
          critical: { WBC: ['>30', '<1'], HGB: ['<7', '>20'], PLT: ['<20', '>1000'] },
          urgent: { WBC: ['>20', '<2'], HGB: ['<8', '>18'], PLT: ['<50', '>800'] },
          routine: { WBC: ['>15', '<3'], HGB: ['<10', '>16'], PLT: ['<100', '>600'] },
        },
      },
      'critical-metabolic': {
        parameters: ['Na', 'K', 'Glucose'],
        thresholds: {
          critical: { Na: ['<120', '>160'], K: ['<2.5', '>6.5'], Glucose: ['<40', '>500'] },
          urgent: { Na: ['<125', '>155'], K: ['<3.0', '>6.0'], Glucose: ['<60', '>400'] },
          routine: { Na: ['<130', '>150'], K: ['<3.3', '>5.5'], Glucose: ['<70', '>300'] },
        },
      },
    },
  },
};

export const actionTemplates = {
  critical: {
    immediate: ['Notify physician STAT', 'Consider emergency intervention'],
    monitoring: ['Continuous vital signs', 'Repeat labs in 1-2 hours'],
    documentation: ['Document all interventions', 'Update care team'],
  },
  urgent: {
    assessment: ['Evaluate within 2-4 hours', 'Review medication list'],
    monitoring: ['Q4h vital signs', 'Repeat labs in 4-6 hours'],
    planning: ['Develop treatment plan', 'Schedule follow-up'],
  },
  routine: {
    review: ['Review within 24 hours', 'Assess trend changes'],
    planning: ['Adjust care plan as needed', 'Schedule routine follow-up'],
    education: ['Patient education', 'Preventive measures'],
  },
};

export const sampleTriageComponent = `
import React from 'react';
import { TriagePanel, ActionList, AlertLevel } from '@homy/triage-components';
import { useLabResult, useTriageRules } from '@homy/triage-hooks';

export const TriageView: React.FC<TriageProps> = ({ resultId, context }) => {
  const { result } = useLabResult(resultId);
  const { rules, actions } = useTriageRules(context);

  const triageLevel = rules.assessUrgency(result);
  const recommendedActions = actions.getActionList(triageLevel);

  return (
    <div className="triage-container">
      <TriagePanel
        level={triageLevel}
        result={result}
        className="rounded-lg shadow-md"
      />
      
      <ActionList
        actions={recommendedActions}
        className="mt-4"
      />
      
      <AlertLevel
        level={triageLevel}
        context={context}
        className="mt-2"
      />
    </div>
  );
};
`;

export const labIntegration = {
  endpoints: {
    getLabResults: '/api/labs/results',
    getTriageRules: '/api/triage/rules',
    postTriageAction: '/api/triage/actions',
  },
  dataFlow: {
    input: ['Lab Results', 'Clinical Context', 'Patient Data'],
    processing: ['Rule Application', 'Urgency Assessment', 'Action Generation'],
    output: ['Triage Level', 'Required Actions', 'Documentation'],
  },
};

export const memoryIntegration = {
  triage: {
    rules: [
      {
        context: 'abnormal-cbc',
        timestamp: '2024-03-21T10:30:00Z',
        urgency: 'critical',
        actions: ['Notify physician', 'Repeat CBC'],
        outcome: 'Intervention successful',
      },
    ],
    components: {
      lastUpdated: '2024-03-21T10:30:00Z',
      active: {
        TriagePanel: true,
        ActionList: true,
        AlertLevel: true,
      },
    },
  },
};
