
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AiModal from './AiModal';

describe('AiModal Security', () => {
    // In JSDOM, window.alert might be undefined or not configurable
    // We need to ensure it exists before spying on it

    let originalAlert;

    beforeEach(() => {
        originalAlert = window.alert;
        window.alert = vi.fn();
    });

    afterEach(() => {
        window.alert = originalAlert;
    });

  it('should not allow sending profanity (isFamilyFriendly check)', async () => {
    const handleClose = vi.fn();
    render(<AiModal isOpen={true} onClose={handleClose} />);

    const input = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');

    // Type profanity
    fireEvent.change(input, { target: { value: 'This is damn shit' } });
    fireEvent.click(sendButton);

    // Wait for potential async state updates
    await waitFor(() => {
        // We expect the profanity to NOT appear in the chat as a user message
        const profanityMessage = screen.queryByText('This is damn shit');
        expect(profanityMessage).toBeNull();

        // We expect alert to be called
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Please use appropriate language'));
    });
  });
});
