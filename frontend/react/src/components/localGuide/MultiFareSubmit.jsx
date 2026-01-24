import { useState } from 'react';

// Multi Fare Submit component
// Allows users to submit fares for multiple places in one session
export function MultiFareSubmit({ onFareSubmit, disabled = false }) {
  const [fares, setFares] = useState([]);
  const [currentFare, setCurrentFare] = useState({
    place: null,
    amount: '',
    errors: {}
  });

  const handleFareChange = (field, value) => {
    setCurrentFare(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const validateFare = () => {
    const errors = {};
    
    if (!currentFare.place) {
      errors.place = 'Please select a destination';
    }
    
    if (!currentFare.amount) {
      errors.amount = 'Please enter fare amount';
    } else {
      const numValue = parseFloat(currentFare.amount);
      if (isNaN(numValue) || numValue <= 0) {
        errors.amount = 'Please enter a valid positive fare amount';
      } else if (numValue > 10000) {
        errors.amount = 'Fare amount seems too high';
      }
    }
    
    setCurrentFare(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const addFareToList = () => {
    if (!validateFare()) return;

    const fareEntry = {
      id: Date.now(),
      place: currentFare.place,
      amount: parseFloat(currentFare.amount),
      timestamp: new Date().toISOString()
    };

    setFares(prev => [...prev, fareEntry]);
    
    // Reset current fare
    setCurrentFare({
      place: null,
      amount: '',
      errors: {}
    });
  };

  const removeFare = (id) => {
    setFares(prev => prev.filter(fare => fare.id !== id));
  };

  const submitAllFares = async () => {
    if (fares.length === 0) {
      throw new Error('Please add at least one fare to submit');
    }

    try {
      // Submit all fares
      for (const fare of fares) {
        await onFareSubmit({
          place: fare.place,
          fare: fare.amount,
          currency: 'INR',
          timestamp: fare.timestamp
        });
      }
      
      // Clear the list after successful submission
      setFares([]);
      return { success: true, count: fares.length };
    } catch (error) {
      throw error;
    }
  };

  const getTotalFares = () => {
    return fares.reduce((sum, fare) => sum + fare.amount, 0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Multiple Fare Submission
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add fares for multiple destinations and submit them all at once
          </p>
        </div>

        {/* Current Fare Input */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Add New Fare
          </h4>
          
          {/* Selected Place */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            {currentFare.place ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📍</span>
                  <span className="text-sm font-medium text-blue-900">
                    {currentFare.place.name}
                  </span>
                </div>
                <button
                  onClick={() => handleFareChange('place', null)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                Select a destination from the search above
              </div>
            )}
            {currentFare.errors.place && (
              <p className="text-red-600 text-xs mt-1">{currentFare.errors.place}</p>
            )}
          </div>

          {/* Fare Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fare Amount (₹)
            </label>
            <input
              type="text"
              value={currentFare.amount}
              onChange={(e) => handleFareChange('amount', e.target.value)}
              placeholder="0.00"
              disabled={disabled || !currentFare.place}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              inputMode="decimal"
              step="0.01"
              min="0"
            />
            {currentFare.errors.amount && (
              <p className="text-red-600 text-xs mt-1">{currentFare.errors.amount}</p>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={addFareToList}
            disabled={disabled || !currentFare.place || !currentFare.amount}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            ➕ Add to List
          </button>
        </div>

        {/* Fare List */}
        {fares.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Fare List ({fares.length} items)
              </h4>
              <div className="text-sm text-gray-600">
                Total: ₹{getTotalFares().toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {fares.map((fare) => (
                <div key={fare.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {fare.place.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {fare.place.displayName.split(',')[1]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{fare.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFare(fare.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit All Button */}
            <button
              onClick={submitAllFares}
              disabled={disabled}
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>Submit All {fares.length} Fares</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {fares.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl">📝</span>
            <p className="mt-2">No fares added yet</p>
            <p className="text-sm">Select destinations and add fares to the list above</p>
          </div>
        )}
      </div>
    </div>
  );
}
