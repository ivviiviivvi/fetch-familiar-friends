import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function RecordForm({ petId, pets, onCreateRecord, onCreateReminder, onSuccess }) {
  const [formData, setFormData] = useState({
    petId: petId,
    type: 'checkup',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vetName: '',
    vetClinic: '',
    cost: '',
    createReminder: false,
    nextDueDate: '',
    repeatInterval: 'none',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recordTypes = [
    { id: 'checkup', name: 'Checkup', icon: '🩺' },
    { id: 'vaccination', name: 'Vaccination', icon: '💉' },
    { id: 'medication', name: 'Medication', icon: '💊' },
    { id: 'surgery', name: 'Surgery', icon: '🏥' },
    { id: 'dental', name: 'Dental', icon: '🦷' },
    { id: 'grooming', name: 'Grooming', icon: '✂️' },
    { id: 'other', name: 'Other', icon: '📝' },
  ];

  const repeatIntervals = [
    { id: 'none', name: 'No repeat' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'yearly', name: 'Yearly' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.date) {
      setError('Date is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the health record
      const recordResult = await onCreateRecord({
        petId: formData.petId,
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        nextDueDate: formData.nextDueDate || null,
        vetName: formData.vetName.trim() || null,
        vetClinic: formData.vetClinic.trim() || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      });

      if (recordResult.error) {
        throw recordResult.error;
      }

      // Create reminder if requested
      if (formData.createReminder && formData.nextDueDate) {
        await onCreateReminder({
          petId: formData.petId,
          type: formData.type,
          title: `${formData.title} - Due`,
          description: formData.description,
          dueAt: formData.nextDueDate,
          repeatInterval: formData.repeatInterval,
        });
      }

      // Reset form and notify success
      setFormData({
        petId: petId,
        type: 'checkup',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        vetName: '',
        vetClinic: '',
        cost: '',
        createReminder: false,
        nextDueDate: '',
        repeatInterval: 'none',
      });

      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        Add Health Record
      </h4>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Pet selector (if multiple pets) */}
      {pets.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pet
          </label>
          <div className="flex gap-2 flex-wrap">
            {pets.map(pet => (
              <button
                key={pet.id}
                type="button"
                onClick={() => handleChange('petId', pet.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  formData.petId === pet.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {pet.species === 'cat' ? '🐱' : '🐕'}
                {pet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Record type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Record Type
        </label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {recordTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleChange('type', type.id)}
              className={`p-3 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                formData.type === type.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-xs">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Annual checkup, Rabies vaccine"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Vet info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vet Name
          </label>
          <input
            type="text"
            value={formData.vetName}
            onChange={(e) => handleChange('vetName', e.target.value)}
            placeholder="Dr. Smith"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clinic
          </label>
          <input
            type="text"
            value={formData.vetClinic}
            onChange={(e) => handleChange('vetClinic', e.target.value)}
            placeholder="Happy Paws Vet Clinic"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cost
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Reminder section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.createReminder}
            onChange={(e) => handleChange('createReminder', e.target.checked)}
            className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Create a reminder for the next appointment
          </span>
        </label>

        {formData.createReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 pl-8"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Next Due Date
              </label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => handleChange('nextDueDate', e.target.value)}
                min={formData.date}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repeat
              </label>
              <div className="flex gap-2 flex-wrap">
                {repeatIntervals.map(interval => (
                  <button
                    key={interval.id}
                    type="button"
                    onClick={() => handleChange('repeatInterval', interval.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      formData.repeatInterval === interval.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {interval.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Saving...
          </>
        ) : (
          <>
            <span>💾</span>
            Save Record
          </>
        )}
      </button>
    </motion.form>
  );
}

RecordForm.propTypes = {
  petId: PropTypes.string,
  pets: PropTypes.array.isRequired,
  onCreateRecord: PropTypes.func.isRequired,
  onCreateReminder: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default RecordForm;
