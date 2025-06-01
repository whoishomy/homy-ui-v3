import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { z } from 'zod';
import { graphql } from '@octokit/graphql';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.cursor' });

// Validate environment variables
const envSchema = z.object({
  GH_TOKEN: z.string().min(1, 'GitHub token is required'),
  GH_OWNER: z.string().default('whoishomy'),
  GH_REPO: z.string().default('homy-ui-v3'),
  GH_OWNER_ID: z.string().min(1, 'GitHub owner ID is required'),
});

const env = envSchema.parse(process.env);

// Initialize Octokit
const octokit = new Octokit({
  auth: env.GH_TOKEN,
});

// Initialize GraphQL client
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${env.GH_TOKEN}`,
  },
});

interface SprintConfig {
  name: string;
  description: string;
  components: string[];
  tasks: {
    title: string;
    body: string;
    labels: string[];
  }[];
}

// Define types for GraphQL responses
interface CreateProjectResponse {
  createProjectV2: {
    projectV2: {
      id: string;
      url: string;
    };
  };
}

interface CreateColumnResponse {
  addProjectV2Item: {
    item: {
      id: string;
    };
  };
}

async function initializeSprint(config: SprintConfig) {
  try {
    // Create project using REST API
    const project = await octokit.rest.projects.createForRepo({
      owner: env.GH_OWNER,
      repo: env.GH_REPO,
      name: config.name,
      body: config.description,
    });

    // Create columns using REST API
    const columns = await Promise.all([
      octokit.rest.projects.createColumn({
        project_id: project.data.id,
        name: 'To Do',
      }),
      octokit.rest.projects.createColumn({
        project_id: project.data.id,
        name: 'In Progress',
      }),
      octokit.rest.projects.createColumn({
        project_id: project.data.id,
        name: 'Review',
      }),
      octokit.rest.projects.createColumn({
        project_id: project.data.id,
        name: 'Done',
      }),
    ]);

    // Create issues and add to project
    const todoColumn = columns[0];
    for (const task of config.tasks) {
      const issue = await octokit.rest.issues.create({
        owner: env.GH_OWNER,
        repo: env.GH_REPO,
        title: task.title,
        body: task.body,
        labels: task.labels,
      });

      await octokit.rest.projects.createCard({
        column_id: todoColumn.data.id,
        content_id: issue.data.id,
        content_type: 'Issue',
      });
    }

    console.log(`✅ Sprint "${config.name}" initialized successfully!`);
    console.log(`🔗 Project URL: ${project.data.html_url}`);
  } catch (error) {
    console.error('❌ Failed to initialize sprint:', error);
    throw error;
  }
}

// Example usage
const sprintConfig: SprintConfig = {
  name: 'Sprint 24.15 - AI Insight Integration',
  description:
    'Implement AI-powered insights across the application with NotificationFeed and InsightOverlay components.',
  components: ['NotificationFeed', 'InsightOverlay'],
  tasks: [
    {
      title: 'feat(notification): Add AI insight support to NotificationFeed',
      body: `Extend NotificationFeed component to support AI-generated insights.

Tasks:
- [ ] Add AIInsight interface
- [ ] Add insight type to notifications
- [ ] Add insight metadata display
- [ ] Update tests
- [ ] Add visual regression tests

Related Components:
- NotificationFeed.tsx
- NotificationFeed.test.tsx`,
      labels: ['feature', 'ai', 'notification'],
    },
    {
      title: 'feat(insight): Create InsightOverlay component',
      body: `Create a new InsightOverlay component for displaying AI insights.

Tasks:
- [ ] Create component structure
- [ ] Add insight display logic
- [ ] Add animations
- [ ] Add tests
- [ ] Add visual regression tests

Related Components:
- InsightOverlay.tsx
- InsightOverlay.test.tsx`,
      labels: ['feature', 'ai', 'insight'],
    },
  ],
};

// Run the initialization
initializeSprint(sprintConfig)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
