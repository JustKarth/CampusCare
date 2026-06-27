import { useState } from 'react';
import { fareDataSeeder } from '../../utils/fareDataSeeder';

// Fare Data Seeder Button component
// Allows seeding sample fare data for testing
export function FareDataSeederButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = () => {
    setIsSeeding(true);
    setMessage('');
    
    try {
      const seededFares = fareDataSeeder.seedFareData();
      setMessage(`✅ Successfully seeded ${seededFares.length} fare records!`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = () => {
    try {
      fareDataSeeder.clearSeededData();
      setMessage('✅ Cleared all seeded data');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const hasData = fareDataSeeder.hasSeededData();
  const dataCount = fareDataSeeder.getSeededData().length;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-yellow-900">
            🧪 Test Data Management
          </h4>
          <p className="text-xs text-yellow-700 mt-1">
            {hasData ? `Currently has ${dataCount} fare records` : 'No test data found'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSeeding ? 'Seeding...' : 'Seed Test Data'}
          </button>
          {hasData && (
            <button
              onClick={handleClearData}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Clear Data
            </button>
          )}
        </div>
      </div>
      
      {message && (
        <div className="text-xs text-yellow-800 bg-yellow-100 rounded p-2">
          {message}
        </div>
      )}
      
      <div className="text-xs text-yellow-700">
        <p><strong>📊 Test Data Includes:</strong></p>
        <ul className="mt-1 ml-4 list-disc">
          <li>12 test users with realistic names</li>
          <li>6 Prayagraj destinations</li>
          <li>12 fares per place (72 total)</li>
          <li>Fares ranging from ₹15-₹65</li>
          <li>Different distribution patterns per location</li>
        </ul>
      </div>
    </div>
  );
}
