import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('MonthCalendar', () => {
  const mockDate = new Date('2023-10-15'); // October 15, 2023 is a Sunday

  it('renders weekday headers with accessible labels', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        journalEntries={{}}
        favorites={[]}
      />
    );

    // Check for presence of short names
    const sundayHeader = screen.getByText('Sun');
    expect(sundayHeader).toBeInTheDocument();

    // These expectations verify the accessibility improvements
    expect(sundayHeader).toHaveAttribute('aria-label', 'Sunday');
    expect(sundayHeader).toHaveAttribute('role', 'columnheader');

    const mondayHeader = screen.getByText('Mon');
    expect(mondayHeader).toHaveAttribute('aria-label', 'Monday');
    expect(mondayHeader).toHaveAttribute('role', 'columnheader');
  });

  it('renders weekday row with correct role', () => {
     render(
      <MonthCalendar
        currentDate={mockDate}
        journalEntries={{}}
        favorites={[]}
      />
    );

    // Find the container for weekdays.
    // Since we don't have a test id, we look for the parent of one of the headers
    const sundayHeader = screen.getByText('Sun');
    const rowContainer = sundayHeader.parentElement;

    expect(rowContainer).toHaveAttribute('role', 'row');
  });
});
