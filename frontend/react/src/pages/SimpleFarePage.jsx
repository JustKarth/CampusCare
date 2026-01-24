import { useState, useEffect } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';

// Simple Fare Page - Basic working version
export function SimpleFarePage() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [fare, setFare] = useState('');
  const [submittedFares, setSubmittedFares] = useState([]);

  // Sample places
  const places = [
    { name: 'Sangam', fareKey: 'sangam' },
    { name: 'Allahabad University', fareKey: 'allahabad-university' },
    { name: 'Civil Lines', fareKey: 'civil-lines' },
    { name: 'Railway Station', fareKey: 'railway-station' },
    { name: 'MNNIT', fareKey: 'mnnit' },
    { name: 'Katra Market', fareKey: 'katra' }
  ];

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleFareSubmit = () => {
    if (!selectedPlace || !fare) {
      alert('Please select a place and enter fare');
      return;
    }

    const fareValue = parseFloat(fare);
    if (isNaN(fareValue) || fareValue <= 0) {
      alert('Please enter a valid fare amount');
      return;
    }

    const newFare = {
      id: Date.now(),
      place: selectedPlace,
      fare: fareValue,
      timestamp: new Date().toISOString()
    };

    setSubmittedFares(prev => [...prev, newFare]);
    setFare('');
    alert(`Fare submitted: ₹${fareValue} for ${selectedPlace.name}`);
  };

  // Simple chart data
  const getChartData = () => {
    const chartData = {};
    submittedFares.forEach(fare => {
      if (!chartData[fare.place.fareKey]) {
        chartData[fare.place.fareKey] = [];
      }
      chartData[fare.place.fareKey].push(fare.fare);
    });
    return chartData;
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Simple Fare Analysis
          </h1>

          {/* Place Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Destination</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {places.map(place => (
                <button
                  key={place.fareKey}
                  onClick={() => handlePlaceSelect(place)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedPlace?.fareKey === place.fareKey
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{place.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fare Input */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Submit Fare</h2>
            {selectedPlace ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Selected: {selectedPlace.name}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fare Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    placeholder="Enter fare amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  onClick={handleFareSubmit}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Fare
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Please select a destination first</p>
            )}
          </div>

          {/* Submitted Fares */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Submitted Fares</h2>
            {submittedFares.length === 0 ? (
              <p className="text-gray-500">No fares submitted yet</p>
            ) : (
              <div className="space-y-2">
                {submittedFares.map(fare => (
                  <div key={fare.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{fare.place.name}</span>
                    <span className="text-green-600 font-semibold">₹{fare.fare}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simple Chart */}
          {Object.keys(chartData).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Fare Distribution</h2>
              {Object.entries(chartData).map(([placeKey, fares]) => {
                const avgFare = fares.reduce((sum, f) => sum + f, 0) / fares.length;
                const maxFare = Math.max(...fares);
                const minFare = Math.min(...fares);
                
                return (
                  <div key={placeKey} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">
                      {places.find(p => p.fareKey === placeKey)?.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Average:</span>
                        <span className="ml-2 font-semibold">₹{avgFare.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Range:</span>
                        <span className="ml-2 font-semibold">₹{minFare}-{maxFare}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Count:</span>
                        <span className="ml-2 font-semibold">{fares.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Test Data Button */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <button
              onClick={() => {
                // Add test data
                const testFares = [
                  { place: places[0], fare: 45 },
                  { place: places[0], fare: 50 },
                  { place: places[0], fare: 42 },
                  { place: places[1], fare: 38 },
                  { place: places[1], fare: 40 },
                  { place: places[1], fare: 35 },
                  { place: places[2], fare: 25 },
                  { place: places[2], fare: 30 },
                  { place: places[2], fare: 28 },
                ];
                
                testFares.forEach((tf, index) => {
                  setTimeout(() => {
                    setSubmittedFares(prev => [...prev, {
                      id: Date.now() + index,
                      place: tf.place,
                      fare: tf.fare,
                      timestamp: new Date().toISOString()
                    }]);
                  }, index * 100);
                });
                
                alert('Test data added!');
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Add Test Data
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
