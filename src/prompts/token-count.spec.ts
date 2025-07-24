import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastMCP } from 'fastmcp';
import { registerGetTokenCountForTextPrompt } from './token-count';

describe('registerGetTokenCountForTextPrompt', () => {
  let mockServer: FastMCP;
  let mockAddPrompt: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAddPrompt = vi.fn();
    mockServer = {
      addPrompt: mockAddPrompt,
    } as unknown as FastMCP;
  });

  it('should register a prompt with correct name and description', () => {
    registerGetTokenCountForTextPrompt(mockServer);

    expect(mockAddPrompt).toHaveBeenCalledTimes(1);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    expect(promptConfig.name).toBe('getTokenCountForText');
    expect(promptConfig.description).toBe(
      'Get the token count for a given text'
    );
  });

  it('should register a prompt with correct arguments', () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    expect(promptConfig.arguments).toEqual([
      {
        name: 'text',
        description: 'The text to count tokens for',
      },
    ]);
  });

  it('should have a load function that returns formatted text', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    expect(typeof loadFunction).toBe('function');

    const testText = 'Hello, world!';
    const result = await loadFunction({ text: testText });

    expect(result).toBe(
      `Count the number of tokens in this text:\n\n${testText}`
    );
  });

  it('should handle empty text input', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const result = await loadFunction({ text: '' });

    expect(result).toBe('Count the number of tokens in this text:\n\n');
  });

  it('should handle multiline text input', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const multilineText = 'Line 1\nLine 2\nLine 3';
    const result = await loadFunction({ text: multilineText });

    expect(result).toBe(
      `Count the number of tokens in this text:\n\n${multilineText}`
    );
  });

  it('should handle text with special characters', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const specialText = 'Hello! @#$%^&*()_+ 🚀 émojis and spëcial chars';
    const result = await loadFunction({ text: specialText });

    expect(result).toBe(
      `Count the number of tokens in this text:\n\n${specialText}`
    );
  });

  it('should handle very long text input', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const longText = 'A'.repeat(10000);
    const result = await loadFunction({ text: longText });

    expect(result).toBe(
      `Count the number of tokens in this text:\n\n${longText}`
    );
  });

  it('should preserve whitespace and formatting in text', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const formattedText = '  Leading spaces\n\nDouble newlines\t\tTabs  ';
    const result = await loadFunction({ text: formattedText });

    expect(result).toBe(
      `Count the number of tokens in this text:\n\n${formattedText}`
    );
  });

  it('should handle null or undefined text gracefully', async () => {
    registerGetTokenCountForTextPrompt(mockServer);

    const promptConfig = mockAddPrompt.mock.calls[0][0];
    const loadFunction = promptConfig.load;

    const result1 = await loadFunction({ text: null as any });
    const result2 = await loadFunction({ text: undefined as any });

    expect(result1).toBe('Count the number of tokens in this text:\n\nnull');
    expect(result2).toBe(
      'Count the number of tokens in this text:\n\nundefined'
    );
  });

  it('should not throw errors when registering', () => {
    expect(() => {
      registerGetTokenCountForTextPrompt(mockServer);
    }).not.toThrow();
  });

  it('should call server.addPrompt exactly once', () => {
    registerGetTokenCountForTextPrompt(mockServer);

    expect(mockAddPrompt).toHaveBeenCalledTimes(1);
  });
});
