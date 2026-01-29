import { useState, useEffect } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { PrayagrajPlaceSearch } from '../components/localGuide/PrayagrajPlaceSearch';
import { MultiFareSubmit } from '../components/localGuide/MultiFareSubmit';
import { BellCurveChart } from '../components/localGuide/BellCurveChart';
import { FareDataSeederButton } from '../components/localGuide/FareDataSeederButton';
import { useFareStorage } from '../hooks/useFareStorage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

// Fare Analysis Page
// Complete fare submission and analysis workflow
export function FareAnalysisPage() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeTab, setActiveTab] = useState('submit');
  const [submissionCooldown, setSubmissionCooldown] = useState(0);
  const { addFare, getPlacesWithFares } = useFareStorage();

  // Handle cooldown timer
  useEffect(() => {
    if (submissionCooldown > 0) {
      const timer = setTimeout(() => {
        setSubmissionCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submissionCooldown]);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setActiveTab('submit');
  };

  const handleFareSubmit = async (fareData) => {
    // Check cooldown
    if (submissionCooldown > 0) {
      throw new Error(`Please wait ${submissionCooldown} seconds before submitting another fare`);
    }

    try {
      await addFare(fareData);
      
      // Set cooldown (reduced to 5 seconds for multiple submissions)
      setSubmissionCooldown(5);
      
      // Clear selected place to allow immediate next submission
      setSelectedPlace(null);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const tabs = [
    { id: 'submit', label: 'Submit Fares', icon: '💰' },
    { id: 'analysis', label: 'View Analysis', icon: '📊' },
    { id: 'history', label: 'Submission History', icon: '📝' }
  ];

  const placesWithFares = getPlacesWithFares();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Prayagraj Fare Analysis
            </h1>
            <p className="text-gray-600 mt-2">
              Submit fares for multiple places in Prayagraj and analyze transportation costs
            </p>
            <div className="mt-2 text-sm text-blue-600">
              💡 Submit fares for multiple places - only 5 second cooldown between submissions!
            </div>
          </div>

          {/* Cooldown Alert */}
          {submissionCooldown > 0 && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⏱️</span>
                <div>
                  <p className="text-yellow-800 font-medium">
                    Quick Cooldown Active
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Please wait {submissionCooldown} seconds before submitting another fare
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'submit' && (
            <div className="space-y-6">
              {/* Test Data Seeder */}
              <FareDataSeederButton />
              
              {/* Place Search */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  1. Search Prayagraj Destination
                </h3>
                <PrayagrajPlaceSearch
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for any destination in Prayagraj..."
                />
              </div>

              {/* Multi Fare Submission */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  2. Submit Multiple Fares
                </h3>
                <MultiFareSubmit
                  onFareSubmit={handleFareSubmit}
                  disabled={submissionCooldown > 0}
                />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Place Selection for Analysis */}
              {!selectedPlace && placesWithFares.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select Place for Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {placesWithFares.map((place, index) => (
                      <button
                        key={`${place.fareKey || place.name}-${index}`}
                        onClick={() => setSelectedPlace(place)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">📍</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {place.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {place.fareCount} fare{place.fareCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-blue-600">
                              Latest: ₹{place.latestFare}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Distribution Chart */}
              {selectedPlace ? (
                <BellCurveChart
                  placeKey={selectedPlace.fareKey || selectedPlace.name}
                  placeName={selectedPlace.name || selectedPlace.displayName}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <div className="text-center text-gray-500">
                    <span className="text-2xl">📊</span>
                    <p className="mt-2">Select a place to view fare analysis</p>
                    <p className="text-sm">Submit fares or choose from places with existing data</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Submission History
              </h3>
              
              {placesWithFares.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <div className="text-center text-gray-500">
                    <span className="text-2xl">📝</span>
                    <p className="mt-2">No fare submissions yet</p>
                    <p className="text-sm">Start by submitting fares for places you visit</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Place
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submissions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Latest Fare
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {placesWithFares.map((place, index) => (
                          <tr key={`${place.fareKey || place.name}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {place.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {place.displayName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {place.fareCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{place.latestFare}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedPlace(place);
                                  setActiveTab('analysis');
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Analysis
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
