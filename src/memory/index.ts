import fs from 'fs/promises';
import path from 'path';

export interface MemoryData {
  key: string;
  value: any;
  metadata: {
    timestamp: string;
    agent: string;
    [key: string]: any;
  };
}

export interface MemoryQuery {
  key: string;
  limit?: number;
  startTime?: string;
  endTime?: string;
  filter?: (data: MemoryData) => boolean;
}

const MEMORY_DIR = path.join(process.cwd(), 'data', 'memory');

// Ensure memory directory exists
async function ensureMemoryDir() {
  await fs.mkdir(MEMORY_DIR, { recursive: true });
}

// Get memory file path
function getMemoryFilePath(key: string): string {
  return path.join(MEMORY_DIR, `${key}.json`);
}

// Read memory file
async function readMemoryFile(filePath: string): Promise<MemoryData[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write memory file
async function writeMemoryFile(filePath: string, data: MemoryData[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// In-memory storage for development
const memoryStore = new Map<string, MemoryData[]>();

export const updateMemory = async (data: MemoryData): Promise<void> => {
  const entries = memoryStore.get(data.key) || [];
  entries.push({
    ...data,
    metadata: {
      ...data.metadata,
      timestamp: data.metadata.timestamp || new Date().toISOString(),
    },
  });
  memoryStore.set(data.key, entries);
};

export const fetchMemoryData = async (keys: string[]): Promise<Record<string, MemoryData[]>> => {
  const result: Record<string, MemoryData[]> = {};
  for (const key of keys) {
    result[key] = memoryStore.get(key) || [];
  }
  return result;
};

// Query memory
export async function queryMemory(query: MemoryQuery): Promise<MemoryData[]> {
  await ensureMemoryDir();

  const filePath = getMemoryFilePath(query.key);
  let data = await readMemoryFile(filePath);

  // Apply time filters
  if (query.startTime) {
    data = data.filter((item) => item.metadata.timestamp >= query.startTime!);
  }
  if (query.endTime) {
    data = data.filter((item) => item.metadata.timestamp <= query.endTime!);
  }

  // Apply custom filter
  if (query.filter) {
    data = data.filter(query.filter);
  }

  // Apply limit
  if (query.limit && query.limit > 0) {
    data = data.slice(-query.limit);
  }

  return data;
}

// Clear memory
export async function clearMemory(key: string): Promise<void> {
  await ensureMemoryDir();
  const filePath = getMemoryFilePath(key);
  await writeMemoryFile(filePath, []);
}

// List all memory keys
export async function listMemoryKeys(): Promise<string[]> {
  await ensureMemoryDir();
  const files = await fs.readdir(MEMORY_DIR);
  return files.filter((file) => file.endsWith('.json')).map((file) => path.basename(file, '.json'));
}
