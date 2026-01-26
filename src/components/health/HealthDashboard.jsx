import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { usePets } from '../../hooks/usePets';
import { useAuth } from '../../contexts/AuthContext';
import HealthOverview from './HealthOverview';
import RecordsList from './RecordsList';
import RemindersList from './RemindersList';
import RecordForm from './RecordForm';

function HealthDashboard({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();
  const { pets, primaryPet, loading: petsLoading } = usePets();
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Use selected pet or primary pet
  const currentPetId = selectedPetId || primaryPet?.id;

  const {
    records,
    reminders,
    loading: healthLoading,
    error,
    allRecords,
    overdueReminders,
    todayReminders,
    upcomingReminders,
    createRecord,
    updateRecord,
    deleteRecord,
    createReminder,
    completeReminder,
    deleteReminder,
  } = useHealthRecords(currentPetId);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'records', name: 'Records', icon: '📋' },
    { id: 'reminders', name: 'Reminders', icon: '🔔' },
    { id: 'add', name: 'Add New', icon: '➕' },
  ];

  const loading = petsLoading || healthLoading;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="health-modal-title"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="health-modal-title" className="text-2xl font-bold flex items-center gap-2">
                  <span>🏥</span> Health Dashboard
                </h2>
                <p className="text-green-100 mt-1">
                  Track vaccinations, checkups, and health records
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Pet selector (if multiple pets) */}
            {pets.length > 1 && (
              <div className="mt-4">
                <label className="text-sm text-green-100 block mb-2">Select Pet:</label>
                <div className="flex gap-2 flex-wrap">
                  {pets.map(pet => (
                    <button
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        currentPetId === pet.id
                          ? 'bg-white text-green-600'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {pet.avatar_url ? (
                        <img src={pet.avatar_url} alt={pet.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <span>{pet.species === 'cat' ? '🐱' : '🐕'}</span>
                      )}
                      {pet.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-green-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                  {tab.id === 'reminders' && overdueReminders.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {overdueReminders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] bg-gray-50 dark:bg-gray-900">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Sign in Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please sign in to access your pet&apos;s health records.
                </p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p>Error loading health data: {error}</p>
              </div>
            ) : !currentPetId ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  No Pets Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add a pet to your profile to start tracking their health.
                </p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <HealthOverview
                    records={allRecords}
                    overdueReminders={overdueReminders}
                    todayReminders={todayReminders}
                    upcomingReminders={upcomingReminders}
                    onCompleteReminder={completeReminder}
                    onNavigateToRecords={() => setActiveTab('records')}
                    onNavigateToReminders={() => setActiveTab('reminders')}
                    onAddNew={() => setActiveTab('add')}
                  />
                )}
                {activeTab === 'records' && (
                  <RecordsList
                    records={allRecords}
                    onUpdate={updateRecord}
                    onDelete={deleteRecord}
                  />
                )}
                {activeTab === 'reminders' && (
                  <RemindersList
                    reminders={reminders}
                    overdueReminders={overdueReminders}
                    todayReminders={todayReminders}
                    upcomingReminders={upcomingReminders}
                    onComplete={completeReminder}
                    onDelete={deleteReminder}
                  />
                )}
                {activeTab === 'add' && (
                  <RecordForm
                    petId={currentPetId}
                    pets={pets}
                    onCreateRecord={createRecord}
                    onCreateReminder={createReminder}
                    onSuccess={() => setActiveTab('records')}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

HealthDashboard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HealthDashboard;
