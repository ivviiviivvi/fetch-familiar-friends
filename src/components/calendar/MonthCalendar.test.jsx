import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('MonthCalendar', () => {
  const mockDate = new Date('2024-05-15T12:00:00'); // Mid-day to avoid timezone edge cases
  const mockOnDateSelect = vi.fn();

  it('renders correctly', () => {
    render(
      <MonthCalendar
        currentDate={mockDate}
        onDateSelect={mockOnDateSelect}
      />
    );
    expect(screen.getByText('May 2024')).toBeInTheDocument();
  });

  it('identifies favorite days correctly', () => {
    const favorites = [
      { savedAt: new Date('2024-05-15T12:00:00').getTime() },
      { savedAt: new Date('2024-05-20T12:00:00').getTime() }
    ];

    render(
      <MonthCalendar
        currentDate={mockDate}
        favorites={favorites}
        onDateSelect={mockOnDateSelect}
      />
    );

    // We look for the button corresponding to the date
    // The aria-label is constructed using toLocaleDateString()
    // We'll use a regex to be flexible with locale variations if needed,
    // but typically it's M/D/YYYY in jsdom.

    // 15th
    const day15Buttons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.includes('marked as favorite') &&
      btn.textContent === '15'
    );
    expect(day15Buttons.length).toBe(1);

    // 20th
    const day20Buttons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.includes('marked as favorite') &&
      btn.textContent === '20'
    );
    expect(day20Buttons.length).toBe(1);

    // 10th (not favorite)
    const day10Buttons = screen.getAllByRole('button').filter(btn =>
      btn.textContent === '10'
    );
    expect(day10Buttons.length).toBe(1);
    expect(day10Buttons[0].getAttribute('aria-label')).not.toContain('marked as favorite');
  });
});
