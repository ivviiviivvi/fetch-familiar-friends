import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

function RecordsList({ records, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const recordTypes = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'vaccination', name: 'Vaccination', icon: '💉' },
    { id: 'checkup', name: 'Checkup', icon: '🩺' },
    { id: 'medication', name: 'Medication', icon: '💊' },
    { id: 'surgery', name: 'Surgery', icon: '🏥' },
    { id: 'dental', name: 'Dental', icon: '🦷' },
    { id: 'grooming', name: 'Grooming', icon: '✂️' },
  ];

  const getRecordTypeIcon = (type) => {
    const found = recordTypes.find(t => t.id === type);
    return found?.icon || '📝';
  };

  const filteredRecords = filter === 'all'
    ? records
    : records.filter(r => r.record_type === filter);

  const handleDelete = async (recordId) => {
    await onDelete(recordId);
    setDeleteConfirm(null);
  };

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {recordTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 text-sm ${
              filter === type.id
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <span>{type.icon}</span>
            {type.name}
          </button>
        ))}
      </div>

      {/* Records list */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-3">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Record header (always visible) */}
              <button
                onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-3xl">{getRecordTypeIcon(record.record_type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {record.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                    {record.vet_name && <span>• {record.vet_name}</span>}
                    {record.cost && <span>• {formatCurrency(record.cost)}</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  record.record_type === 'vaccination' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  record.record_type === 'checkup' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  record.record_type === 'surgery' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {record.record_type}
                </span>
                <span className="text-gray-400">
                  {expandedId === record.id ? '▲' : '▼'}
                </span>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedId === record.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                      {record.description && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</h5>
                          <p className="text-gray-800 dark:text-gray-200">{record.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {record.vet_clinic && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Clinic</h5>
                            <p className="text-gray-800 dark:text-gray-200">{record.vet_clinic}</p>
                          </div>
                        )}
                        {record.next_due_date && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Next Due</h5>
                            <p className="text-gray-800 dark:text-gray-200">
                              {new Date(record.next_due_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {record.cost && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cost</h5>
                            <p className="text-gray-800 dark:text-gray-200">{formatCurrency(record.cost)}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => setDeleteConfirm(record.id)}
                          className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Delete confirmation */}
                      {deleteConfirm === record.id && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                            Are you sure you want to delete this record?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              Yes, Delete
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <div className="text-6xl mb-4">📋</div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
            No {filter === 'all' ? '' : filter} records found
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {filter !== 'all' ? 'Try selecting a different filter or add a new record.' : 'Start by adding your first health record.'}
          </p>
        </div>
      )}
    </div>
  );
}

RecordsList.propTypes = {
  records: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RecordsList;
