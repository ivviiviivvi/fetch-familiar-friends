import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    ),
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
}));

describe('MonthCalendar Component', () => {
  const mockDate = new Date(2023, 9, 15); // October 15, 2023
  const mockOnDateSelect = vi.fn();

  const mockJournalEntries = {
    'Sun Oct 01 2023': 'First entry',
    'Tue Oct 31 2023': 'Halloween'
  };

  const mockFavorites = [
    { savedAt: new Date(2023, 9, 5).toISOString() }, // Oct 5
    { savedAt: new Date(2023, 9, 20).toISOString() } // Oct 20
  ];

  it('renders correctly with given date', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={mockOnDateSelect}
      />
    );

    expect(screen.getByText('October 2023')).toBeInTheDocument();
    expect(screen.getAllByText('15')[0]).toBeInTheDocument();
  });

  it('calls onDateSelect when a valid date is clicked', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={mockOnDateSelect}
      />
    );

    // Click on October 16th
    const dayButton = screen.getAllByText('16')[0].closest('button');
    fireEvent.click(dayButton);

    expect(mockOnDateSelect).toHaveBeenCalled();
  });

  it('displays indicators for journal entries', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        journalEntries={mockJournalEntries}
        onDateSelect={mockOnDateSelect}
      />
    );

    // Oct 1 should have journal entry.
    // Since Oct 1 might appear in adjacent months (unlikely for Oct 2023 but possible in others),
    // or just to be safe, we select the one that is enabled or in current month.
    // However, usually we can just pick the first one or filter by aria-label if we knew it ahead of time.
    // Here we just use getAllByText and assume the first one is correct for this month setup.
    // October 2023 starts on Sunday (1st), so '1' is the first cell.
    const dayButton = screen.getAllByText('1')[0].closest('button');
    expect(dayButton.getAttribute('aria-label')).toContain('has journal entry');
  });

  it('displays indicators for favorites', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        favorites={mockFavorites}
        onDateSelect={mockOnDateSelect}
      />
    );

    // Oct 5 should have favorite
    const dayButton = screen.getAllByText('5')[0].closest('button');
    expect(dayButton.getAttribute('aria-label')).toContain('marked as favorite');
  });
});
