
import { describe, it, expect } from 'vitest';
import { isFamilyFriendly } from './dataValidation.js';

describe('isFamilyFriendly - False Positives', () => {
  it('should not flag "hello" as profanity (contains "hell")', () => {
    expect(isFamilyFriendly('Hello world')).toBe(true);
  });

  it('should not flag "class" as profanity (contains "ass")', () => {
    expect(isFamilyFriendly('I am in class')).toBe(true);
  });

  it('should not flag "scrape" as profanity (contains "crap")', () => {
    expect(isFamilyFriendly('I scrape my knee')).toBe(true);
  });
});
