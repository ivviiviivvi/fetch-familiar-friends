
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MonthCalendar from './MonthCalendar';

describe('MonthCalendar', () => {
  const mockDate = new Date(2024, 4, 15); // May 15, 2024
  const onDateSelect = vi.fn();

  it('renders correctly', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={onDateSelect}
      />
    );
    expect(screen.getByText('May 2024')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('handles favorites correctly (optimization check)', () => {
    const favorites = [
      { savedAt: new Date(2024, 4, 20).getTime(), url: 'test.jpg' } // May 20
    ];

    render(
      <MonthCalendar
        currentDate={mockDate}
        favorites={favorites}
        onDateSelect={onDateSelect}
      />
    );

    // The date cell "20" should have an aria-label indicating favorite
    // or we can inspect the dot if we could target it easily.
    // Based on code: aria-label={`${date...}, marked as favorite`}

    const day20 = screen.getByRole('button', { name: /marked as favorite/i });
    expect(day20).toBeInTheDocument();
    expect(day20).toHaveTextContent('20');
  });

  it('handles journal entries correctly (key fix check)', () => {
    // Key format must be YYYY-MM-DD
    const journalEntries = {
      '2024-05-10': 'Some entry'
    };

    render(
      <MonthCalendar
        currentDate={mockDate}
        journalEntries={journalEntries}
        onDateSelect={onDateSelect}
      />
    );

    const day10 = screen.getByRole('button', { name: /has journal entry/i });
    expect(day10).toBeInTheDocument();
    expect(day10).toHaveTextContent('10');
  });
});
