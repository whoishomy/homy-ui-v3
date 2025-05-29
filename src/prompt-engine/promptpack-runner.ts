import { EventEmitter } from 'events';
import { z } from 'zod';
import type { PromptPack } from './types';
import { updateMemory } from '../memory';

interface ComponentGenerationConfig {
  name: string;
  type: 'component' | 'test' | 'memory' | 'style';
  template: string;
  path: string;
}

class PromptPackRunner extends EventEmitter {
  private activePromptPacks: Map<string, PromptPack> = new Map();

  constructor() {
    super();
  }

  public async apply(packName: string, context: Record<string, any> = {}) {
    try {
      // Load PromptPack
      const pack = await this.loadPromptPack(packName);
      if (!pack) throw new Error(`PromptPack ${packName} not found`);

      // Validate input
      const validatedInput = pack.input.parse(context);

      // Generate components
      const components = await this.generateComponents(pack, validatedInput);

      // Store in memory
      await this.storeInMemory(pack, components);

      // Emit completion event
      this.emit('promptpack:applied', {
        name: packName,
        components,
        timestamp: new Date().toISOString(),
      });

      return components;
    } catch (error) {
      this.emit('promptpack:error', {
        name: packName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async loadPromptPack(name: string): Promise<PromptPack | null> {
    try {
      const pack = await import(`../prompts/${name}.prompt.ts`);
      return pack.default;
    } catch (error) {
      return null;
    }
  }

  private async generateComponents(pack: PromptPack, input: any) {
    const components: ComponentGenerationConfig[] = [];

    // Generate React component
    components.push({
      name: `${pack.name}Component`,
      type: 'component',
      template: this.generateComponentTemplate(pack, input),
      path: `src/components/${pack.name}/${pack.name}.tsx`,
    });

    // Generate test file
    components.push({
      name: `${pack.name}Test`,
      type: 'test',
      template: this.generateTestTemplate(pack),
      path: `src/components/${pack.name}/${pack.name}.test.tsx`,
    });

    // Generate memory schema
    components.push({
      name: `${pack.name}Memory`,
      type: 'memory',
      template: this.generateMemoryTemplate(pack),
      path: `src/memory/${pack.name}.memory.ts`,
    });

    return components;
  }

  private generateComponentTemplate(pack: PromptPack, input: any): string {
    return `import React from 'react';
import { usePromptPack } from '../../hooks/usePromptPack';
import type { ${pack.name}Props } from './types';

export const ${pack.name} = ({ data, preferences }: ${pack.name}Props) => {
  const { result, loading, error } = usePromptPack('${pack.name}', {
    data,
    preferences,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div role="region" aria-label={result.insight.ariaLabel}>
      {/* Component content generated from PromptPack */}
    </div>
  );
};`;
  }

  private generateTestTemplate(pack: PromptPack): string {
    return `import { render, screen } from '@testing-library/react';
import { ${pack.name} } from './${pack.name}';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('${pack.name}', () => {
  it('should render without accessibility violations', async () => {
    const { container } = render(<${pack.name} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});`;
  }

  private generateMemoryTemplate(pack: PromptPack): string {
    return `import { z } from 'zod';

export const ${pack.name}Schema = ${JSON.stringify(pack.output, null, 2)};

export type ${pack.name}Memory = z.infer<typeof ${pack.name}Schema>;`;
  }

  private async storeInMemory(pack: PromptPack, components: ComponentGenerationConfig[]) {
    await updateMemory({
      key: `promptpack-${pack.name}`,
      value: {
        components,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        type: 'promptpack',
        name: pack.name,
        version: pack.version,
        agent: 'promptpack-runner',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const promptPackRunner = new PromptPackRunner();
