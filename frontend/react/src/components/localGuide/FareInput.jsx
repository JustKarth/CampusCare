import { useState } from 'react';

// Fare Input component
// Handles user fare submission with validation
export function FareInput({ selectedPlace, onFareSubmit, disabled = false }) {
  const [fare, setFare] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFare = (value) => {
    const numValue = parseFloat(value);
    
    // Check if value is a valid positive number
    if (isNaN(numValue) || numValue <= 0) {
      return 'Please enter a valid positive fare amount';
    }
    
    // Check for reasonable fare limits (between 1 and 10000)
    if (numValue > 10000) {
      return 'Fare amount seems too high. Please enter a reasonable amount.';
    }
    
    // Check for decimal places (max 2)
    const decimalPlaces = (numValue.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return 'Please enter fare with maximum 2 decimal places';
    }
    
    return '';
  };

  const handleFareChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }
    
    setFare(sanitizedValue);
    setError(''); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlace) {
      setError('Please select a place first');
      return;
    }

    const validationError = validateFare(fare);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const fareData = {
        place: selectedPlace,
        fare: parseFloat(fare),
        currency: 'INR', // Default currency
        timestamp: new Date().toISOString()
      };

      await onFareSubmit(fareData);
      setFare(''); // Clear input after successful submission
    } catch (err) {
      setError(err.message || 'Failed to submit fare');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayValue = (value) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return `₹${numValue.toFixed(2)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        {/* Selected Place Display */}
        {selectedPlace ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl mt-1">📍</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-blue-900 truncate">
                  {selectedPlace.name}
                </h4>
                <p className="text-xs text-blue-700 truncate mt-1">
                  {selectedPlace.displayName}
                </p>
                {selectedPlace.coordinates && (
                  <p className="text-xs text-blue-600 mt-1">
                    📍 {selectedPlace.coordinates.lat.toFixed(4)}, {selectedPlace.coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-center text-gray-500">
              <span className="text-2xl">📍</span>
              <p className="mt-2 text-sm">Search and select a place above</p>
            </div>
          </div>
        )}

        {/* Fare Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-2">
              What is the fare to this place?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                ₹
              </span>
              <input
                id="fare"
                type="text"
                value={fare}
                onChange={handleFareChange}
                placeholder="0.00"
                disabled={disabled || isSubmitting || !selectedPlace}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                inputMode="decimal"
                step="0.01"
                min="0"
              />
              {fare && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                  {formatDisplayValue(fare)}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter fare in Indian Rupees (₹)
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled || isSubmitting || !selectedPlace || !fare}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>💰</span>
                <span>Submit Fare</span>
              </>
            )}
          </button>
        </form>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-gray-700 mb-2">💡 Fare Guidelines:</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Enter the actual fare you paid to reach this place</li>
            <li>• Include all transportation costs (auto, cab, bus, etc.)</li>
            <li>• Be honest - this helps other students plan better</li>
            <li>• You can submit multiple fares for different routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
