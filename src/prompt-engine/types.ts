import { z } from 'zod';

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
