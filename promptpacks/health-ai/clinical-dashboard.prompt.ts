/**
 * @promptpack clinical-dashboard
 * @description Generates an integrated clinical dashboard combining lab results, triage rules, and AI insights
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a clinical dashboard architect specializing in healthcare data visualization.
Your task is to create an integrated dashboard that combines lab results, triage rules, and AI insights.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate dashboard components for:
   - Lab result visualization
   - Triage status display
   - AI insight presentation
   - Clinical timeline view
3. Support multiple views:
   - Overview dashboard
   - Detailed analysis
   - Trend visualization
   - Action center
4. Include healthcare compliance
5. Add helpful comments explaining the functionality

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Clinical Dashboard Generator
# @raycast.mode fullOutput
# @raycast.icon 📊
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Dashboard type (e.g., overview, detailed, trends)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Clinical focus",
  "data": [
    { "title": "General Practice", "value": "gp" },
    { "title": "Emergency", "value": "er" },
    { "title": "Specialist", "value": "specialist" },
    { "title": "Research", "value": "research" }
  ]
}

Please generate a complete shell script that includes:
- Dashboard layout generation
- Component integration
- Data visualization setup
- Interaction handling
- Documentation creation
`;

export const expectedOutput =
  'A Raycast-compatible script that generates an integrated clinical dashboard';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'dashboard',
    'clinical',
    'generator',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const dashboardLayout = {
  overview: {
    header: {
      components: ['PatientInfo', 'QuickStats', 'AlertBanner'],
      layout: 'flex-row justify-between items-center',
    },
    mainContent: {
      left: {
        components: ['LabResultsGrid', 'VitalsTimeline'],
        width: '60%',
      },
      right: {
        components: ['TriageStatus', 'ActionCenter'],
        width: '40%',
      },
    },
    footer: {
      components: ['TimelineNav', 'FilterControls'],
      layout: 'flex-row justify-between',
    },
  },
};

export const componentTemplates = {
  LabResultsGrid: {
    layout: 'grid-cols-2 gap-4',
    items: [
      {
        title: 'Recent Labs',
        component: 'LabInsightPanel',
        props: {
          showTrends: true,
          enableAI: true,
        },
      },
      {
        title: 'Critical Values',
        component: 'AlertPanel',
        props: {
          priority: 'high',
          autoRefresh: true,
        },
      },
    ],
  },
  ActionCenter: {
    layout: 'flex-col gap-4',
    sections: [
      {
        title: 'Required Actions',
        priority: 'high',
        autoSort: true,
      },
      {
        title: 'Recommendations',
        priority: 'medium',
        aiEnhanced: true,
      },
    ],
  },
};

export const sampleDashboardComponent = `
import React from 'react';
import {
  DashboardLayout,
  LabResultsGrid,
  TriageStatus,
  ActionCenter,
  TimelineNav
} from '@homy/dashboard-components';
import {
  usePatientData,
  useLabResults,
  useTriageStatus,
  useAIInsights
} from '@homy/dashboard-hooks';

export const ClinicalDashboard: React.FC<DashboardProps> = ({ patientId, view }) => {
  const { patient } = usePatientData(patientId);
  const { results } = useLabResults(patientId);
  const { status } = useTriageStatus(patientId);
  const { insights } = useAIInsights(patientId);

  return (
    <DashboardLayout className="clinical-dashboard">
      <header className="dashboard-header">
        <PatientInfo patient={patient} />
        <QuickStats stats={results.summary} />
        <AlertBanner alerts={status.alerts} />
      </header>

      <main className="dashboard-content">
        <div className="content-left">
          <LabResultsGrid
            results={results}
            insights={insights}
            className="rounded-lg shadow-md"
          />
          <VitalsTimeline
            data={results.vitals}
            className="mt-4"
          />
        </div>

        <div className="content-right">
          <TriageStatus
            status={status}
            className="rounded-lg shadow-md"
          />
          <ActionCenter
            actions={status.actions}
            insights={insights.recommendations}
            className="mt-4"
          />
        </div>
      </main>

      <footer className="dashboard-footer">
        <TimelineNav data={results.timeline} />
        <FilterControls />
      </footer>
    </DashboardLayout>
  );
};
`;

export const dataIntegration = {
  endpoints: {
    patient: '/api/patient/summary',
    labs: '/api/labs/dashboard',
    triage: '/api/triage/status',
    insights: '/api/insights/dashboard',
  },
  realtime: {
    subscriptions: ['lab-results', 'triage-alerts', 'ai-insights'],
    refresh: {
      interval: '30s',
      priority: 'high',
    },
  },
};

export const memoryIntegration = {
  dashboard: {
    sessions: [
      {
        userId: 'U12345',
        timestamp: '2024-03-21T10:30:00Z',
        view: 'overview',
        interactions: ['Viewed lab trends', 'Acknowledged alerts', 'Applied AI insights'],
      },
    ],
    preferences: {
      lastUpdated: '2024-03-21T10:30:00Z',
      layout: 'overview',
      components: {
        LabResultsGrid: true,
        TriageStatus: true,
        ActionCenter: true,
      },
    },
  },
};
