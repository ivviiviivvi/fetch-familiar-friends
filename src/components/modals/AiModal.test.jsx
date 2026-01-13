import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AiModal from './AiModal';

// Mock dependencies
vi.mock('../../utils/breedKnowledge', () => ({
  getBreedSpecificResponse: vi.fn(),
}));

// Mock scrollIntoView since it's not implemented in JSDOM
Element.prototype.scrollIntoView = vi.fn();

describe('AiModal Security & Validation', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentBreed: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates input length', async () => {
    render(<AiModal {...defaultProps} />);

    const input = screen.getByPlaceholderText(/ask me anything/i);
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('prevents profanity submission', async () => {
    const user = userEvent.setup();
    render(<AiModal {...defaultProps} />);

    const input = screen.getByPlaceholderText(/ask me anything/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'This is shit');
    await user.click(sendButton);

    expect(await screen.findByText(/family-friendly/i)).toBeInTheDocument();

    const chatMessages = screen.queryAllByText('This is shit', { selector: 'p' });
    expect(chatMessages).toHaveLength(0);
  });

  it('sanitizes input before processing', async () => {
    // If the input is blocked by profanity filter, it won't be sent.
    // "Hello <b>world</b>" contains "hell".
    // "hell" is in the profanity list!
    // Ah! That's why it was failing!
    // isFamilyFriendly checks for "hell".

    render(<AiModal {...defaultProps} />);

    const input = screen.getByPlaceholderText(/ask me anything/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Use a clean word
    const dirtyInput = 'Hi <b>friend</b>';
    fireEvent.change(input, { target: { value: dirtyInput } });
    fireEvent.click(sendButton);

    await waitFor(() => {
       const ps = screen.getAllByText((content, element) => {
           return element.tagName.toLowerCase() === 'p' && !content.includes('demo AI assistant');
       });
       expect(ps.length).toBeGreaterThan(1);

       const lastMsg = ps[ps.length - 1];
       expect(lastMsg.textContent).toContain('&lt;');
    });
  });

  it('clears error when typing', async () => {
    const user = userEvent.setup();
    render(<AiModal {...defaultProps} />);

    const input = screen.getByPlaceholderText(/ask me anything/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Trigger error
    await user.type(input, 'bad shit');
    await user.click(sendButton);
    expect(await screen.findByText(/family-friendly/i)).toBeInTheDocument();

    // Type more to clear error
    await user.type(input, ' sorry');
    expect(screen.queryByText(/family-friendly/i)).not.toBeInTheDocument();
  });
});
