import { memo } from 'react';
import PropTypes from 'prop-types';

// Memoized to prevent unnecessary re-renders when other app state changes
const DateNavigation = memo(function DateNavigation({ currentDate, onDateChange }) {
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const isFuture = () => {
    const today = new Date();
    return currentDate > today;
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-4" role="navigation" aria-label="Date navigation">
      <button
        onClick={goToPreviousDay}
        className="p-2 rounded-lg bg-white/50 hover:bg-white/70 text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Go to previous day"
        title="Previous day"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToToday}
        disabled={isToday()}
        className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isToday()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        aria-label="Go to today"
        title="Jump to today"
      >
        Today
      </button>

      <button
        onClick={goToNextDay}
        disabled={isFuture()}
        className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isFuture()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white/50 hover:bg-white/70 text-gray-700'
        }`}
        aria-label="Go to next day"
        title="Next day"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
});

DateNavigation.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired
};

export default DateNavigation;
