import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('MonthCalendar', () => {
  it('correctly identifies favorite dates', () => {
    // Fixed date for testing: October 15, 2023
    const testDate = new Date(2023, 9, 15); // Month is 0-indexed
    const favorites = [
      {
        id: '1',
        url: 'test.jpg',
        savedAt: testDate.getTime()
      }
    ];

    render(
      <MonthCalendar
        currentDate={testDate}
        favorites={favorites}
      />
    );

    // Look for the button with the specific aria-label
    // The date string format depends on the locale, but usually MM/DD/YYYY in jsdom default en-US
    const dateStr = testDate.toLocaleDateString();
    // Escape special regex characters in date string if necessary, but MM/DD/YYYY is usually safe-ish.
    // However, to be safe, we can just look for the text part if we are sure.
    // But let's stick to the regex plan.
    const button = screen.getByRole('button', {
      name: new RegExp(`${dateStr}.*marked as favorite`) // Regex matching
    });

    expect(button).toBeInTheDocument();
  });
});
