import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

describe('MonthCalendar', () => {
  const currentDate = new Date(2023, 5, 15); // June 15, 2023

  it('renders correctly', () => {
    render(
      <MonthCalendar
        currentDate={currentDate}
      />
    );
    expect(screen.getByText('June 2023')).toBeInTheDocument();
  });

  it('renders favorite indicators correctly', () => {
    const favorites = [
      { savedAt: new Date(2023, 5, 15).toISOString() }, // Today
      { savedAt: new Date(2023, 5, 20).toISOString() }  // Future date in month
    ];

    render(
      <MonthCalendar
        currentDate={currentDate}
        favorites={favorites}
      />
    );

    // June 15th should have a favorite indicator
    const day15 = screen.getByLabelText(new Date(2023, 5, 15).toLocaleDateString());
    expect(day15).toBeInTheDocument();

    // We can check if the indicator is present by looking for the aria-label
    // The component renders: <div ... aria-label="Has favorite" />
    const favoriteIndicators = screen.getAllByLabelText('Has favorite');
    expect(favoriteIndicators.length).toBeGreaterThan(0);
  });

  it('renders journal indicators correctly', () => {
    const journalEntries = {
      [new Date(2023, 5, 10).toDateString()]: 'Some entry'
    };

    render(
      <MonthCalendar
        currentDate={currentDate}
        journalEntries={journalEntries}
      />
    );

    const journalIndicators = screen.getAllByLabelText('Has journal entry');
    expect(journalIndicators.length).toBeGreaterThan(0);
  });

  it('handles date selection', () => {
    const onDateSelect = vi.fn();
    render(
      <MonthCalendar
        currentDate={currentDate}
        onDateSelect={onDateSelect}
      />
    );

    // Click on June 10th
    const day10 = screen.getByLabelText(new Date(2023, 5, 10).toLocaleDateString());
    fireEvent.click(day10);

    expect(onDateSelect).toHaveBeenCalled();
  });
});
