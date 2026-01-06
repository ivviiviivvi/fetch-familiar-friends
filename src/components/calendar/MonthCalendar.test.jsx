import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonthCalendar from './MonthCalendar';

// Mock current date to a fixed point in time
const MOCK_DATE = new Date('2024-04-15T00:00:00');

describe('MonthCalendar', () => {
  it('renders correctly with weekday headers having full accessible names', () => {
    render(
      <MonthCalendar
        currentDate={MOCK_DATE}
      />
    );

    // Check for weekday abbreviations visible text
    expect(screen.getByText('Sun')).toBeInTheDocument();

    // Check for accessible labels
    const sundayHeader = screen.getByText('Sun');
    expect(sundayHeader).toHaveAttribute('aria-label', 'Sunday');

    const mondayHeader = screen.getByText('Mon');
    expect(mondayHeader).toHaveAttribute('aria-label', 'Monday');
  });

  it('renders date buttons with accessible status labels', () => {
    const journalEntries = {
      '2024-04-15': 'Test Journal Entry'
    };

    const favorites = [
      { savedAt: '2024-04-16T12:00:00.000Z' } // Tomorrow has favorite
    ];

    render(
      <MonthCalendar
        currentDate={MOCK_DATE}
        journalEntries={journalEntries}
        favorites={favorites}
      />
    );

    // Check the 15th (Selected, Today if mock aligns, Has Journal)
    // Note: MonthCalendar determines "Today" based on system time `new Date()`.
    // We can't easily mock system time without fake timers, so let's focus on "Has Journal".

    // Find button for 15th
    const day15Buttons = screen.getAllByText('15');
    // There might be prev/next month 15s, but Apr 15 is unique in this view (prev month Mar 15 is not shown, next May 15 is not shown)
    // Actually April view shows previous March days (31, 30...) and May days (1, 2...)
    // 15 is safe.
    const day15Button = day15Buttons.find(el => el.closest('button'));
    const button15 = day15Button.closest('button');

    // Should include "Selected" because it matches MOCK_DATE
    // Should include "has journal entry"
    expect(button15).toHaveAttribute('aria-label', expect.stringContaining('Selected'));
    expect(button15).toHaveAttribute('aria-label', expect.stringContaining('has journal entry'));

    // Check 16th (Has Favorite)
    const day16Button = screen.getByText('16').closest('button');
    expect(day16Button).toHaveAttribute('aria-label', expect.stringContaining('has favorites'));
  });

  it('handles legacy journal entry keys (toDateString)', () => {
    // Create a date object for the 14th
    const d = new Date(2024, 3, 14); // April 14
    const legacyKey = d.toDateString(); // "Sun Apr 14 2024"

    const journalEntries = {
      [legacyKey]: 'Legacy Entry'
    };

    render(
      <MonthCalendar
        currentDate={MOCK_DATE}
        journalEntries={journalEntries}
      />
    );

    const day14Button = screen.getByText('14').closest('button');
    expect(day14Button).toHaveAttribute('aria-label', expect.stringContaining('has journal entry'));
  });
});
