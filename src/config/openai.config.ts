import { ClientOptions } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openaiConfig: Partial<ClientOptions> = {
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000,
};

export const modelConfig = {
  model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  maxTokens: parseInt(process.env.MAX_TOKENS || '150', 10),
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
};

export const systemPrompt = `You are an expert UI/UX designer and developer. 
Your task is to analyze screenshots of UI components and provide detailed, technical descriptions.
Focus on:
1. Component functionality and purpose
2. Visual design elements and styling
3. Interaction patterns and states
4. Accessibility considerations
5. Responsive design features`;

export const generatePrompt = (screenshotPath: string) => `
Please analyze this UI component screenshot at ${screenshotPath}.
Provide a technical description including:
1. Main purpose and functionality
2. Key visual elements and design patterns
3. Interactive features and states
4. Accessibility considerations
5. Responsive design approach

Format the response as:
Description: [concise component description]
Tags: [comma-separated list of relevant tags]
Technical Notes: [detailed technical observations]
`;
