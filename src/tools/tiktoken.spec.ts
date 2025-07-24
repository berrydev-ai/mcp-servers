import { countTokens } from './tiktoken.js';
import { describe, it, expect } from 'vitest';

describe('countTokens', () => {
  it('should count tokens correctly', async () => {
    const tokenCount = await countTokens('Hello, world!');
    expect(tokenCount).toBe(13);
  });
});
