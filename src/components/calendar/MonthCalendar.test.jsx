import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MonthCalendar from './MonthCalendar';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('MonthCalendar', () => {
  const mockDate = new Date(2023, 4, 15); // May 15, 2023
  const mockOnDateSelect = vi.fn();

  it('renders correctly', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={mockOnDateSelect}
      />
    );

    // Check if month and year are displayed
    expect(screen.getByText(/May 2023/i)).toBeInTheDocument();

    // Check if days are rendered (May 15 should be there)
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('handles date click', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={mockOnDateSelect}
      />
    );

    // Use '15' which is definitely unique in this 42-cell view for May 2023
    // (Apr 30 is start, ends June 10)
    const day15 = screen.getByText('15').closest('button');
    fireEvent.click(day15);

    expect(mockOnDateSelect).toHaveBeenCalled();
  });

  it('renders journal and favorite indicators', () => {
    const journalEntries = {
      [new Date(2023, 4, 15).toDateString()]: 'Some entry'
    };
    const favorites = [
      { savedAt: new Date(2023, 4, 15).toISOString() }
    ];

    render(
      <MonthCalendar
        currentDate={mockDate}
        journalEntries={journalEntries}
        favorites={favorites}
      />
    );

    const dayButton = screen.getByText('15').closest('button');
    expect(dayButton).toHaveAttribute('title', expect.stringContaining('has journal'));
    expect(dayButton).toHaveAttribute('title', expect.stringContaining('has favorites'));
  });
});
