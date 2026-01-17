import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import CalendarCard from './CalendarCard';
import React from 'react';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    img: ({ children, ...props }) => <img {...props} />,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../utils/dailyContent', () => ({
  getAllDailyContent: vi.fn(() => ({
    fact: 'Dogs are cool',
    mood: { emoji: '🐶', text: 'Happy', description: 'Very happy' },
    quote: 'Woof',
  })),
}));

vi.mock('../../utils/imageCache', () => ({
  getCachedImage: vi.fn(() => null),
  cacheImage: vi.fn(),
  preloadNearbyDates: vi.fn(() => Promise.resolve()),
}));

describe('CalendarCard', () => {
  it('renders correctly', () => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'https://dog.ceo/api/img/1.jpg' })
      })
    );

    const { container } = render(
      <CalendarCard
        date={new Date('2023-01-01')}
      />
    );
    expect(container).toBeTruthy();
  });
});
