import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function HealthOverview({
  records,
  overdueReminders,
  todayReminders,
  upcomingReminders,
  onCompleteReminder,
  onNavigateToRecords,
  onNavigateToReminders,
  onAddNew,
}) {
  // Get recent records (last 5)
  const recentRecords = records.slice(0, 5);

  // Count records by type
  const recordCounts = records.reduce((acc, record) => {
    const type = record.record_type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: 'Total Records', value: records.length, icon: '📋', color: 'blue' },
    { label: 'Vaccinations', value: recordCounts.vaccination || 0, icon: '💉', color: 'green' },
    { label: 'Checkups', value: recordCounts.checkup || 0, icon: '🩺', color: 'purple' },
    { label: 'Active Reminders', value: overdueReminders.length + todayReminders.length + upcomingReminders.length, icon: '🔔', color: 'orange' },
  ];

  const getRecordTypeIcon = (type) => {
    const icons = {
      vaccination: '💉',
      checkup: '🩺',
      medication: '💊',
      surgery: '🏥',
      dental: '🦷',
      grooming: '✂️',
      other: '📝',
    };
    return icons[type] || '📝';
  };

  return (
    <div className="space-y-6">
      {/* Overdue reminders alert */}
      {overdueReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-200">
                  {overdueReminders.length} Overdue Reminder{overdueReminders.length > 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {overdueReminders[0]?.title}
                  {overdueReminders.length > 1 && ` and ${overdueReminders.length - 1} more`}
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToReminders}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              View All
            </button>
          </div>
        </motion.div>
      )}

      {/* Today's reminders */}
      {todayReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📅</span>
              <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200">
                  {todayReminders.length} Reminder{todayReminders.length > 1 ? 's' : ''} Today
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {todayReminders[0]?.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => onCompleteReminder(todayReminders[0]?.id)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Complete
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all flex items-center gap-2"
        >
          <span>➕</span> Add Record
        </button>
        <button
          onClick={onNavigateToReminders}
          className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-600"
        >
          <span>🔔</span> View Reminders
        </button>
      </div>

      {/* Recent records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Recent Records</h4>
          <button
            onClick={onNavigateToRecords}
            className="text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            View All →
          </button>
        </div>

        {recentRecords.length > 0 ? (
          <div className="space-y-3">
            {recentRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-2xl">{getRecordTypeIcon(record.record_type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 dark:text-gray-100 truncate">
                    {record.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                    {record.vet_name && ` • ${record.vet_name}`}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full capitalize">
                  {record.record_type}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p>No health records yet.</p>
            <button
              onClick={onAddNew}
              className="mt-2 text-green-600 dark:text-green-400 hover:underline"
            >
              Add your first record
            </button>
          </div>
        )}
      </div>

      {/* Upcoming reminders preview */}
      {upcomingReminders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">
            Coming Up This Week
          </h4>
          <div className="space-y-2">
            {upcomingReminders.slice(0, 3).map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📌</span>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">{reminder.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reminder.due_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

HealthOverview.propTypes = {
  records: PropTypes.array.isRequired,
  overdueReminders: PropTypes.array.isRequired,
  todayReminders: PropTypes.array.isRequired,
  upcomingReminders: PropTypes.array.isRequired,
  onCompleteReminder: PropTypes.func.isRequired,
  onNavigateToRecords: PropTypes.func.isRequired,
  onNavigateToReminders: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired,
};

export default HealthOverview;
