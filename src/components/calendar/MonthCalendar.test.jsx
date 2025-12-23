import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import MonthCalendar from './MonthCalendar';

// Mock framer-motion since it's used in the component
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button className={className} onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('MonthCalendar', () => {
  const currentDate = new Date('2023-10-15'); // October 15, 2023
  const favorites = [
    { savedAt: '2023-10-01T10:00:00.000Z' },
    { savedAt: '2023-10-05T10:00:00.000Z' }
  ];
  const journalEntries = {
    'Sat Oct 07 2023': 'Some entry',
  };

  it('renders correctly', () => {
    render(
      <MonthCalendar
        currentDate={currentDate}
        favorites={favorites}
        journalEntries={journalEntries}
      />
    );

    expect(screen.getByText('October 2023')).toBeInTheDocument();
  });

  it('indicates favorites correctly', () => {
    render(
      <MonthCalendar
        currentDate={currentDate}
        favorites={favorites}
        journalEntries={journalEntries}
      />
    );

    // The indicator for favorite has aria-label "Has favorite"
    const favIndicators = screen.getAllByLabelText('Has favorite');
    expect(favIndicators.length).toBeGreaterThan(0);
  });
});
