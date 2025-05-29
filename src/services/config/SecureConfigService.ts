import { createHash } from 'crypto';

export class SecureConfigService {
  private static instance: SecureConfigService;
  private configCache: Map<string, string> = new Map();
  private readonly encryptionKey: string;

  private constructor() {
    const envKey = process.env.HOMY_ENCRYPTION_KEY;
    if (!envKey) {
      throw new Error('HOMY_ENCRYPTION_KEY environment variable is required');
    }
    this.encryptionKey = envKey;
  }

  public static getInstance(): SecureConfigService {
    if (!SecureConfigService.instance) {
      SecureConfigService.instance = new SecureConfigService();
    }
    return SecureConfigService.instance;
  }

  public async getApiKey(provider: 'openai' | 'anthropic'): Promise<string> {
    const cacheKey = `${provider}_api_key`;
    const cachedKey = this.configCache.get(cacheKey);
    if (cachedKey) {
      return this.decrypt(cachedKey);
    }

    const envKey = process.env[`${provider.toUpperCase()}_API_KEY`];
    if (!envKey) {
      throw new Error(`${provider.toUpperCase()}_API_KEY environment variable is required`);
    }

    const encryptedKey = this.encrypt(envKey);
    this.configCache.set(cacheKey, encryptedKey);
    return envKey;
  }

  private encrypt(value: string): string {
    const hash = createHash('sha256');
    hash.update(this.encryptionKey + value);
    return hash.digest('hex');
  }

  private decrypt(encryptedValue: string): string {
    // In a real implementation, this would use proper encryption/decryption
    // For now, we're just retrieving from environment again
    return process.env[this.reverseEnvKeyLookup(encryptedValue)] || '';
  }

  private reverseEnvKeyLookup(hash: string): string {
    for (const [key, value] of Object.entries(process.env)) {
      if (key.endsWith('_API_KEY') && this.encrypt(value || '') === hash) {
        return key;
      }
    }
    throw new Error('Invalid or expired API key');
  }

  public clearCache(): void {
    this.configCache.clear();
  }
}
