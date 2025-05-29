import { z } from 'zod';
import { mockPromptEngine } from './mock';

// Types
export interface PromptPack<TInput = any, TOutput = any> {
  name: string;
  description: string;
  version: string;
  input: z.ZodType<TInput>;
  output: z.ZodType<TOutput>;
  prompts: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  examples?: Array<{
    input: TInput;
    output: TOutput;
  }>;
}

export interface PromptResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to replace template variables
const replaceTemplateVars = (content: string, data: Record<string, any>): string => {
  return content.replace(/{{(\w+)}}/g, (_, key) => {
    return data[key] !== undefined ? JSON.stringify(data[key]) : `{{${key}}}`;
  });
};

// Define a promptpack
export function definePromptPack<TInput, TOutput>(
  config: PromptPack<TInput, TOutput>
): PromptPack<TInput, TOutput> {
  return config;
}

// Execute a prompt
export const triggerPrompt = async (promptName: string, context: any): Promise<PromptResult> => {
  try {
    const result = await mockPromptEngine.triggerPrompt(promptName, context);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
