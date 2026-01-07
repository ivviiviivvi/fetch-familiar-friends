import { useState, useMemo, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Static data defined outside component to avoid recreation
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Memoized day component to prevent unnecessary re-renders of all 42 cells
const CalendarDay = memo(function CalendarDay({
  dayData,
  hasJournal,
  hasFavorite,
  isCurrentDay,
  isSelectedDay,
  isFutureDay,
  onClick
}) {
  // Use useCallback to keep the click handler stable, although onClick is stable
  const handleClick = useCallback(() => {
    onClick(dayData.date);
  }, [onClick, dayData.date]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={isFutureDay}
      whileHover={!isFutureDay ? { scale: 1.05 } : {}}
      whileTap={!isFutureDay ? { scale: 0.95 } : {}}
      className={`
        relative aspect-square p-2 rounded-lg text-center transition-all
        ${!dayData.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
        ${isCurrentDay ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${isSelectedDay ? 'bg-blue-500 dark:bg-blue-600 text-white font-bold' : ''}
        ${!isSelectedDay && dayData.isCurrentMonth && !isFutureDay ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
        ${isFutureDay ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${!isFutureDay && !isSelectedDay ? 'focus:outline-none focus:ring-2 focus:ring-blue-400' : ''}
      `}
      aria-label={`${dayData.date.toLocaleDateString()}`}
      title={`${dayData.date.toLocaleDateString()}${hasJournal ? ' (has journal)' : ''}${hasFavorite ? ' (has favorites)' : ''}`}
    >
      <div className="text-sm font-medium">{dayData.day}</div>

      {/* Indicators */}
      {(hasJournal || hasFavorite) && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {hasJournal && (
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isSelectedDay ? 'bg-white' : 'bg-green-500'
              }`}
              aria-label="Has journal entry"
            />
          )}
          {hasFavorite && (
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isSelectedDay ? 'bg-yellow-200' : 'bg-yellow-500'
              }`}
              aria-label="Has favorite"
            />
          )}
        </div>
      )}
    </motion.button>
  );
});

CalendarDay.propTypes = {
  dayData: PropTypes.object.isRequired,
  hasJournal: PropTypes.bool,
  hasFavorite: PropTypes.bool,
  isCurrentDay: PropTypes.bool,
  isSelectedDay: PropTypes.bool,
  isFutureDay: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

const MonthCalendar = memo(function MonthCalendar({ currentDate, journalEntries = {}, favorites = [], onDateSelect }) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  // Pre-calculate today to avoid creating new Date() 42 times per render
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []); // Stable 'today' reference

  // Optimization: Pre-calculate favorite dates to avoid O(N*M) loop inside render
  const favoriteDates = useMemo(() => {
    const dates = new Set();
    favorites.forEach(fav => {
      if (fav.savedAt) {
        dates.add(new Date(fav.savedAt).toDateString());
      }
    });
    return dates;
  }, [favorites]);

  // Get calendar data for the month
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Days from previous month to show
    const prevMonthDays = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();

    // Total cells needed (always 6 rows for consistency)
    const totalCells = 42;
    const nextMonthDays = totalCells - (prevMonthDays + daysInMonth);

    // Build calendar array
    const days = [];

    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }

    // Next month days
    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }

    return days;
  }, [viewDate]);

  // Check if a date has journal entry
  const hasJournalEntry = useCallback((date) => {
    const dateKey = date.toDateString();
    return journalEntries[dateKey] && journalEntries[dateKey].trim().length > 0;
  }, [journalEntries]);

  // Check if a date has favorites - optimized with Set
  const hasFavorite = useCallback((date) => {
    return favoriteDates.has(date.toDateString());
  }, [favoriteDates]);

  // Check if date is today
  const isToday = useCallback((date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);

  // Check if date is selected
  const isSelected = useCallback((date) => {
    return date.toDateString() === currentDate.toDateString();
  }, [currentDate]);

  // Check if date is in the future
  const isFuture = useCallback((date) => {
    return date > today;
  }, [today]);

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const handleToday = () => {
    setViewDate(new Date());
  };

  const handleDateClick = useCallback((date) => {
    if (!isFuture(date) && onDateSelect) {
      onDateSelect(date);
    }
  }, [isFuture, onDateSelect]);

  const formatMonthYear = () => {
    return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatMonthYear()}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
            title="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            aria-label="Go to today"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
            title="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((dayData, index) => (
          <CalendarDay
            key={index}
            dayData={dayData}
            hasJournal={hasJournalEntry(dayData.date)}
            hasFavorite={hasFavorite(dayData.date)}
            isCurrentDay={isToday(dayData.date)}
            isSelectedDay={isSelected(dayData.date)}
            isFutureDay={isFuture(dayData.date)}
            onClick={handleDateClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Journal Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Favorite</span>
          </div>
        </div>
      </div>
    </div>
  );
});

MonthCalendar.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  journalEntries: PropTypes.object,
  favorites: PropTypes.array,
  onDateSelect: PropTypes.func
};

MonthCalendar.defaultProps = {
  journalEntries: {},
  favorites: [],
  onDateSelect: null
};

export default MonthCalendar;
