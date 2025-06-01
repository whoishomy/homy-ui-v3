/**
 * @promptpack clinical-prompt-architect
 * @description Generates specialized AI prompt architecture for HOMY Health platform
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a healthcare AI architect specialized in creating clinical prompt systems.
Your task is to analyze HOMY Health's needs and design specialized PromptPack architecture.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Analyze clinical workflow needs:
   - Triage automation
   - Lab result interpretation
   - Vital signs monitoring
   - Patient profile analysis
   - Treatment pathway mapping
3. Generate PromptPack recommendations for:
   - Clinical decision support
   - UI/UX components
   - Data visualization
   - Documentation automation
4. Consider healthcare compliance
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Clinical Prompt Architect
# @raycast.mode fullOutput
# @raycast.icon 🏥
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Clinical domain (e.g., triage, labs, vitals)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Architecture focus",
  "data": [
    { "title": "Workflow Automation", "value": "workflow" },
    { "title": "UI Components", "value": "ui" },
    { "title": "Data Processing", "value": "data" },
    { "title": "Documentation", "value": "docs" }
  ]
}

Please generate a complete shell script that includes:
- Clinical workflow analysis
- PromptPack architecture design
- Integration recommendations
- Compliance considerations
- Documentation generation
`;

export const expectedOutput =
  'A Raycast-compatible script that designs specialized healthcare PromptPack architecture';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'clinical',
    'health',
    'promptpack',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const clinicalDomains = {
  triage: {
    promptpacks: [
      {
        name: 'triage-rule-generator',
        purpose: 'Generate smart triage rules from clinical guidelines',
        components: ['RuleEngine', 'PriorityQueue', 'AlertSystem'],
      },
      {
        name: 'symptom-mapper',
        purpose: 'Map reported symptoms to clinical pathways',
        components: ['SymptomTree', 'PathwayVisualizer'],
      },
    ],
  },
  labs: {
    promptpacks: [
      {
        name: 'lab-insight-analyzer',
        purpose: 'Interpret lab results with clinical context',
        components: ['ResultPanel', 'TrendGraph', 'AlertBadge'],
      },
      {
        name: 'reference-range-validator',
        purpose: 'Validate and visualize lab value ranges',
        components: ['RangeSlider', 'ValidationCard'],
      },
    ],
  },
  vitals: {
    promptpacks: [
      {
        name: 'vital-monitor-designer',
        purpose: 'Create vital sign monitoring interfaces',
        components: ['VitalGrid', 'TrendLine', 'AlertThreshold'],
      },
      {
        name: 'profile-vital-mapper',
        purpose: 'Map vitals to patient profiles',
        components: ['ProfileCard', 'VitalSummary'],
      },
    ],
  },
};

export const architectureTemplate = {
  workflow: {
    components: ['Clinical flow diagrams', 'Decision trees', 'Alert systems'],
    integrations: ['EHR systems', 'Lab interfaces', 'Monitoring devices'],
    compliance: ['HIPAA', 'GDPR', 'HL7 FHIR'],
  },
  ui: {
    components: ['Clinical dashboards', 'Patient views', 'Provider interfaces'],
    patterns: ['Accessibility', 'Mobile-first', 'Error prevention'],
    themes: ['Clinical', 'Patient-friendly', 'Technical'],
  },
};

export const sampleArchitectureDoc = `
# HOMY Health PromptPack Architecture

## Clinical Domains

### Patient Assessment
- Initial Evaluation
- Follow-up Assessment
- Emergency Triage

### Treatment Planning
- Care Plan Generation
- Medication Management
- Intervention Strategies

### Monitoring & Alerts
- Vital Signs Analysis
- Lab Result Interpretation
- Critical Value Detection

## Core Components

### Base Templates
- Standard Headers
- Response Formats
- Error Handling

### Clinical Logic
- Decision Trees
- Risk Assessments
- Protocol Selection

### Safety Checks
- Contraindication Detection
- Drug Interaction Alerts
- Boundary Conditions

## Integration Points

### External Systems
- EHR Connectivity
- Lab Systems
- Pharmacy Networks

### Internal Services
- Authentication
- Audit Logging
- Analytics

### User Interfaces
- Mobile Apps
- Web Portals
- Admin Dashboards

## Governance

### Compliance
- HIPAA Requirements
- Data Protection
- Audit Trails

### Quality Assurance
- Validation Rules
- Testing Protocols
- Version Control

### Documentation
- API References
- Usage Guidelines
- Change Management
`;

export const memoryIntegration = {
  architecture: {
    domains: [
      {
        name: 'triage',
        promptpacks: ['triage-rule-generator', 'symptom-mapper'],
        status: 'active',
      },
      {
        name: 'labs',
        promptpacks: ['lab-insight-analyzer', 'reference-range-validator'],
        status: 'planned',
      },
    ],
    compliance: {
      lastChecked: '2024-03-21T10:30:00Z',
      standards: ['HIPAA', 'GDPR', 'FHIR'],
      status: 'compliant',
    },
  },
};
