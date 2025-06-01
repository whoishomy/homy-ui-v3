import { graphql } from '@octokit/graphql';
import dotenv from 'dotenv';

dotenv.config();

const GH_TOKEN = process.env.GH_TOKEN as string;
const GH_PROJECT_ID = process.env.GH_PROJECT_ID!;
const GH_STATUS_FIELD_ID = process.env.GH_STATUS_FIELD_ID!;
const GH_STATUS_TODO_ID = process.env.GH_STATUS_TODO_ID!;
const GH_REPOSITORY_ID = process.env.GH_REPOSITORY_ID!;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GH_TOKEN}`,
  },
});

// Define types for GraphQL responses
interface CreateIssueResponse {
  createIssue: {
    issue: {
      id: string;
    };
  };
}

interface AddProjectItemResponse {
  addProjectV2ItemById: {
    item: {
      id: string;
    };
  };
}

async function run() {
  // 1. ISSUE oluştur
  const issueRes: CreateIssueResponse = await graphqlWithAuth(`
    mutation {
      createIssue(input: {
        repositoryId: "${GH_REPOSITORY_ID}", 
        title: "🚀 Yeni Sprint Otomasyon Görevi", 
        body: "Bu görev script ile otomatik oluşturulmuştur."
      }) {
        issue {
          id
        }
      }
    }
  `);

  const issueId = issueRes.createIssue.issue.id;

  // 2. PROJECT'e ekle
  const projectItemRes: AddProjectItemResponse = await graphqlWithAuth(
    `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId,
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `,
    {
      projectId: GH_PROJECT_ID,
      contentId: issueId,
    }
  );

  const itemId = projectItemRes.addProjectV2ItemById.item.id;

  // 3. STATUS: Todo olarak ayarla
  await graphqlWithAuth(
    `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: {
          singleSelectOptionId: $optionId
        }
      }) {
        projectV2Item {
          id
        }
      }
    }
  `,
    {
      projectId: GH_PROJECT_ID,
      itemId,
      fieldId: GH_STATUS_FIELD_ID,
      optionId: GH_STATUS_TODO_ID,
    }
  );

  console.log('✅ Görev başarıyla oluşturuldu ve statüsü Todo olarak ayarlandı.');
}

run().catch((err) => {
  console.error('❌ Hata:', err);
});
