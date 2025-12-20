import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AiModal from './AiModal';

// Mock Modal
vi.mock('./Modal', () => ({
  default: ({ children, isOpen }) => isOpen ? <div data-testid="mock-modal">{children}</div> : null
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('AiModal Security', () => {
  const mockOnClose = vi.fn();
  const originalAlert = window.alert;

  beforeEach(() => {
    mockOnClose.mockClear();
    window.alert = vi.fn();
  });

  afterEach(() => {
    window.alert = originalAlert;
  });

  it('should reject profanity (Family Friendly check)', async () => {
    render(<AiModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    // 'damn' is in the profanity list in dataValidation.js
    const badWord = 'damn';

    fireEvent.change(input, { target: { value: `This is ${badWord}` } });
    fireEvent.click(sendButton);

    // Expect the message NOT to be added to the document
    // We wait a bit to ensure it doesn't appear
    await waitFor(() => {
        // We assert that the text is NOT found.
        // Note: verify that the text is not present.
        expect(screen.queryByText(`This is ${badWord}`)).not.toBeInTheDocument();
    });

    // We expect an alert to warn the user
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('family-friendly'));
  });

  it('should sanitize HTML input', async () => {
    render(<AiModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    const htmlInput = '<script>alert(1)</script>';

    fireEvent.change(input, { target: { value: htmlInput } });
    fireEvent.click(sendButton);

    // We expect the rendered text to be sanitized (encoded)
    // sanitizeInput replaces < with &lt; and / with &#x2F; etc.
    // The user should see the encoded entities, not the raw tags.
    const expectedSanitized = '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;';

    await waitFor(() => {
        expect(screen.getByText((content) => content.includes(expectedSanitized))).toBeInTheDocument();
    });
  });
});
