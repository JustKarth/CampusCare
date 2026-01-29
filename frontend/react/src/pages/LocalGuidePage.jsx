import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useLocalGuide } from '../hooks/useLocalGuide';
import { CategoryFilter } from '../components/localGuide/CategoryFilter';
import { PlaceCard } from '../components/localGuide/PlaceCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/common/Pagination';
import { PlaceCardSkeleton } from '../components/common/SkeletonLoader';
import { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { InteractiveMap } from '../components/localGuide/InteractiveMap';
import { PlaceSearch } from '../components/localGuide/PlaceSearch';
import { NearbyPlaces } from '../components/localGuide/NearbyPlaces';
import { RouteCalculator } from '../components/localGuide/RouteCalculator';
import { Link } from 'react-router-dom';

// Local Guide Page
// Replaces: local-guide.html + localGuide.js

export function LocalGuidePage() {
  const {
    categories,
    places,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    submitRating,
  } = useLocalGuide();

  const { location, loading: locationLoading } = useGeolocation();
  const [activeTab, setActiveTab] = useState('nearby');
  const [showMap, setShowMap] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);

  // Pagination
  const { paginatedItems, currentPage, totalPages, goToPage } = 
    usePagination(places, 10);

  const tabs = [
    { id: 'nearby', label: 'Nearby', icon: '🗺️' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'routes', label: 'Routes', icon: '🛣️' },
    { id: 'fares', label: 'Fare Analysis', icon: '💰' }
  ];

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    // Switch to nearby tab to show the selected place
    setActiveTab('nearby');
  };

  const handleRouteCalculated = (routeData) => {
    setCurrentRoute(routeData);
  };

  const handleSearch = (place) => {
    setSearchResults([place]);
    setSelectedPlace(place);
    setActiveTab('nearby');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl">Local Guide</h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showMap ? '📋 Hide Map' : '🗺️ Show Map'}
            </button>
          </div>

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

          {/* Map (shown when enabled) */}
          {showMap && (
            <div className="mb-6">
              <InteractiveMap
                userLocation={location}
                places={searchResults}
                selectedPlace={selectedPlace}
                route={currentRoute}
                onPlaceClick={handlePlaceSelect}
                showUserLocation={true}
              />
            </div>
          )}

          {/* Tab Content */}
          <ErrorMessage message={error} className="mb-6" />

          {activeTab === 'nearby' && (
            <NearbyPlaces onPlaceSelect={handlePlaceSelect} />
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Search Places</h3>
                <PlaceSearch
                  onPlaceSelect={handleSearch}
                  placeholder="Search for restaurants, hospitals, schools..."
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700">Search Results</h4>
                  {searchResults.map((place, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium">{place.display_name}</h5>
                      <p className="text-sm text-gray-600">{place.class} • {place.type}</p>
                      <button
                        onClick={() => handlePlaceSelect(place)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'routes' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Route Calculator</h3>
              <RouteCalculator onRouteCalculated={handleRouteCalculated} />
            </div>
          )}

          {activeTab === 'fares' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Fare Analysis</h3>
                    <p className="text-blue-700">Submit and analyze transportation fares to different places</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/fare-analysis"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Fare Analysis
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-2xl">📍</span>
                    <h4 className="font-medium text-gray-900 mt-2">Search Places</h4>
                    <p className="text-sm text-gray-600 mt-1">Find any destination</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-2xl">💵</span>
                    <h4 className="font-medium text-gray-900 mt-2">Submit Fares</h4>
                    <p className="text-sm text-gray-600 mt-1">Share transportation costs</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-2xl">📊</span>
                    <h4 className="font-medium text-gray-900 mt-2">View Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">See fare distributions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
