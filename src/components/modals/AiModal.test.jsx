import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AiModal from './AiModal';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock breed knowledge
vi.mock('../../utils/breedKnowledge', () => ({
  getBreedSpecificResponse: vi.fn(),
}));

describe('AiModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders correctly when open', () => {
    render(<AiModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Use getAllByText because "AI Assistant" appears in header and message
    expect(screen.getAllByText(/AI Assistant/i).length).toBeGreaterThan(0);
  });

  it('has accessible chat log', () => {
    render(<AiModal isOpen={true} onClose={mockOnClose} />);
    // This is what we want to add
    const chatLog = screen.getByRole('log');
    expect(chatLog).toBeInTheDocument();
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
    expect(chatLog).toHaveAttribute('tabIndex', '0');
    expect(chatLog).toHaveAttribute('aria-label', 'Chat history');
  });

  it('displays typing indicator with status role', async () => {
    render(<AiModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask me anything/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    // Should show typing indicator
    const status = await screen.findByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(/AI is typing/i);
  });
});
