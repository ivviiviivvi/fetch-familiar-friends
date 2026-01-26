import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function RemindersList({
  reminders,
  overdueReminders,
  todayReminders,
  upcomingReminders,
  onComplete,
  onDelete,
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const handleComplete = async (reminderId) => {
    setCompletingId(reminderId);
    await onComplete(reminderId);
    setCompletingId(null);
  };

  const handleDelete = async (reminderId) => {
    await onDelete(reminderId);
    setDeleteConfirm(null);
  };

  const getRepeatLabel = (interval) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      none: 'One-time',
    };
    return labels[interval] || 'One-time';
  };

  const getReminderTypeIcon = (type) => {
    const icons = {
      vaccination: '💉',
      checkup: '🩺',
      medication: '💊',
      grooming: '✂️',
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString();
  };

  // Group remaining reminders that aren't overdue, today, or upcoming
  const laterReminders = reminders.filter(r =>
    !overdueReminders.includes(r) &&
    !todayReminders.includes(r) &&
    !upcomingReminders.includes(r)
  );

  const sections = [
    { id: 'overdue', title: 'Overdue', items: overdueReminders, color: 'red', icon: '⚠️' },
    { id: 'today', title: 'Today', items: todayReminders, color: 'yellow', icon: '📅' },
    { id: 'upcoming', title: 'This Week', items: upcomingReminders, color: 'blue', icon: '📌' },
    { id: 'later', title: 'Later', items: laterReminders, color: 'gray', icon: '📆' },
  ];

  const ReminderCard = ({ reminder, color }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border-2 ${
        color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
        color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
        color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
        'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getReminderTypeIcon(reminder.reminder_type)}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 dark:text-gray-100">{reminder.title}</div>
          {reminder.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reminder.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDate(reminder.due_at)}</span>
            {reminder.repeat_interval && reminder.repeat_interval !== 'none' && (
              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
                🔄 {getRepeatLabel(reminder.repeat_interval)}
              </span>
            )}
            {reminder.pet?.name && (
              <span>• {reminder.pet.name}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleComplete(reminder.id)}
            disabled={completingId === reminder.id}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
              color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' :
              color === 'yellow' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
              'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {completingId === reminder.id ? (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ...
              </span>
            ) : (
              '✓ Done'
            )}
          </button>
          <button
            onClick={() => setDeleteConfirm(reminder.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete reminder"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm === reminder.id && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300 mb-2">
            Delete this reminder?
            {reminder.repeat_interval && reminder.repeat_interval !== 'none' && (
              <span className="block text-xs mt-1">This will also stop future occurrences.</span>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(reminder.id)}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  ReminderCard.propTypes = {
    reminder: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
  };

  const hasAnyReminders = reminders.length > 0;

  return (
    <div className="space-y-6">
      {hasAnyReminders ? (
        sections.map(section => (
          section.items.length > 0 && (
            <div key={section.id}>
              <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${
                section.color === 'red' ? 'text-red-700 dark:text-red-300' :
                section.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                section.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                'text-gray-700 dark:text-gray-300'
              }`}>
                <span>{section.icon}</span>
                {section.title}
                <span className="text-sm font-normal">({section.items.length})</span>
              </h4>
              <div className="space-y-3">
                {section.items.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} color={section.color} />
                ))}
              </div>
            </div>
          )
        ))
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <div className="text-6xl mb-4">🔔</div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
            No reminders
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Reminders will appear here when you add health records with due dates.
          </p>
        </div>
      )}
    </div>
  );
}

RemindersList.propTypes = {
  reminders: PropTypes.array.isRequired,
  overdueReminders: PropTypes.array.isRequired,
  todayReminders: PropTypes.array.isRequired,
  upcomingReminders: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RemindersList;
