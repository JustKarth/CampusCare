import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { SEO } from '../components/common/SEO';
import { FareMap } from '../components/fare/FareMap';
import { FarePlaceSearch } from '../components/fare/FarePlaceSearch';
import { FareSummaryCard } from '../components/fare/FareSummaryCard';
import { FareSubmitForm } from '../components/fare/FareSubmitForm';
import { useFares } from '../hooks/useFares';
import { SearchService } from '../services/searchService';
import { PRAYAGRAJ_HOTSPOTS, MNNIT_CAMPUS } from '../config/prayagrajPlaces';

export function FareAnalysisPage() {
  const location = useLocation();
  const locationState = location.state;

  // Origin & Destination state (default MNNIT to Prayagraj Junction or locationState destination)
  const [fromLocation, setFromLocation] = useState(MNNIT_CAMPUS);
  const [toLocation, setToLocation] = useState(locationState?.toLocation || PRAYAGRAJ_HOTSPOTS[1]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [isLocatingOrigin, setIsLocatingOrigin] = useState(false);

  // Sync toLocation if passed via router navigation
  useEffect(() => {
    if (locationState?.toLocation) {
      setToLocation(locationState.toLocation);
    }
  }, [locationState]);

  const handleSetStartingFromGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingOrigin(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const geo = await SearchService.reverseGeocode(lat, lng);
          const name = geo?.display_name ? geo.display_name.split(',')[0] : 'Current Location';
          const area = geo?.display_name ? geo.display_name.split(',').slice(1, 3).join(',').trim() : 'Live GPS';
          setFromLocation({
            id: 'gps-origin-' + Date.now(),
            name: `${name} (My Location)`,
            displayName: geo?.display_name || 'Current Location',
            lat,
            lng,
            icon: '📍',
            area: area || 'Current Location'
          });
        } catch (e) {
          setFromLocation({
            id: 'gps-origin-' + Date.now(),
            name: 'My Current Location',
            displayName: 'My Current Location',
            lat,
            lng,
            icon: '📍',
            area: 'Live GPS'
          });
        } finally {
          setIsLocatingOrigin(false);
        }
      },
      (err) => {
        setIsLocatingOrigin(false);
        alert('Could not access current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState('recent'); // 'recent' | 'mine'

  const {
    loading,
    error,
    routeFares,
    routeStats,
    recentFares,
    myFares,
    fetchRouteFares,
    submitFare,
    deleteFare
  } = useFares();

  // Fetch route fares whenever from or to location changes
  useEffect(() => {
    if (fromLocation?.name && toLocation?.name) {
      fetchRouteFares({
        fromLat: fromLocation.lat,
        fromLng: fromLocation.lng,
        toLat: toLocation.lat,
        toLng: toLocation.lng,
        fromName: fromLocation.name,
        toName: toLocation.name
      });
    }
  }, [fromLocation, toLocation, fetchRouteFares]);

  // Swap Origin and Destination
  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  // Quick select a destination
  const handleQuickDestination = (place) => {
    setToLocation(place);
  };

  // Handle fare submission
  const handleFareSubmit = async (formData) => {
    await submitFare(formData);
    setIsSubmitModalOpen(false);
    setSubmitSuccessMsg('Thank you! Your fare contribution has been added for all students.');
    setTimeout(() => setSubmitSuccessMsg(''), 6000);

    // Refresh route fares
    fetchRouteFares({
      fromLat: fromLocation.lat,
      fromLng: fromLocation.lng,
      toLat: toLocation.lat,
      toLng: toLocation.lng,
      fromName: fromLocation.name,
      toName: toLocation.name
    });
  };

  const vehicleIcons = {
    auto: '🛺',
    cab: '🚗',
    'e-rickshaw': '⚡',
    bus: '🚌',
    other: '🛵'
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <SEO
        title="Campus Transit & Fare Analysis"
        description="Check fair auto and cab prices in Prayagraj. Community-reported transit costs to prevent student overcharging."
      />
      <TopNav />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
              <span>🛺</span>
              <span>Anti-Overcharge Transit System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Transit & Fare Calculator
            </h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              Real senior-reported travel fares between any two points in Prayagraj. Check the fair price before you board.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="btn-primary text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all self-start md:self-auto"
          >
            <span className="text-base">🤝</span>
            <span>Contribute Fare</span>
          </button>
        </div>

        {/* Success Alert */}
        {submitSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">✅</span>
              <span>{submitSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSubmitSuccessMsg('')}
              className="text-xs hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Local Guide Arrival Banner */}
        {locationState?.fromLocalGuide && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/10 border border-primary/40 text-white text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-primary/25 border border-primary/40">📍</span>
              <div>
                <p className="font-bold text-white">
                  Arrived from Local Guide: <span className="text-primary">{locationState.placeName || toLocation.name}</span>
                </p>
                <p className="text-xs text-white/70">
                  Destination pre-filled from student recommendations. Start from your campus or use your live GPS!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSetStartingFromGps}
              disabled={isLocatingOrigin}
              className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <span>📍</span>
              <span>{isLocatingOrigin ? 'Acquiring GPS...' : 'Start from My Current Location'}</span>
            </button>
          </div>
        )}

        {/* Route Selector Bar */}
        <div className="card-glass rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] items-end gap-3">
            <FarePlaceSearch
              label="Starting Location (From)"
              placeholder="e.g. MNNIT, Prayagraj Jn, Civil Lines..."
              selectedLocation={fromLocation}
              onSelectLocation={setFromLocation}
              badgeColor="emerald"
            />

            <button
              type="button"
              onClick={handleSwapLocations}
              className="self-center lg:mb-1 w-11 h-11 rounded-xl bg-card/80 border border-white/10 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-all shadow-md mx-auto"
              title="Swap From and To locations"
            >
              <span className="text-lg">⇄</span>
            </button>

            <FarePlaceSearch
              label="Destination (To)"
              placeholder="Search destination or select hotspot..."
              selectedLocation={toLocation}
              onSelectLocation={setToLocation}
              badgeColor="rose"
            />
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none text-xs">
            <span className="text-text-secondary/60 text-[11px] uppercase font-bold tracking-wider flex-shrink-0">
              Popular Drops:
            </span>
            {PRAYAGRAJ_HOTSPOTS.filter(p => p.id !== fromLocation?.id).map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handleQuickDestination(place)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  toLocation?.id === place.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-card/40 border-white/10 text-text-secondary hover:bg-card hover:text-white'
                }`}
              >
                <span>{place.icon}</span>
                <span>{place.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-8 animate-fadeIn">
              <FareSubmitForm
                initialFrom={fromLocation}
                initialTo={toLocation}
                onSubmit={handleFareSubmit}
                onCancel={() => setIsSubmitModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Route Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <span>🗺️</span>
                <span>Live Route & Navigation Map</span>
              </h2>
              <span className="text-[11px] text-text-secondary">Powered by OpenStreetMap & OSRM</span>
            </div>

            <FareMap
              fromLocation={fromLocation}
              toLocation={toLocation}
              onRouteChange={({ distanceKm }) => setRouteDistance(distanceKm)}
            />
          </div>

          {/* Fare Summary & Anti-Overcharge Calculator Column */}
          <div className="lg:col-span-5">
            <FareSummaryCard
              stats={routeStats}
              fares={routeFares}
              fromName={fromLocation?.shortName || fromLocation?.name || 'Origin'}
              toName={toLocation?.shortName || toLocation?.name || 'Destination'}
              distanceKm={routeDistance}
              fromLocation={fromLocation}
              toLocation={toLocation}
              onOpenSubmit={() => setIsSubmitModalOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Section: Community Streams & Personal Submissions */}
        <div className="card-glass rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
          {/* Section Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveBottomTab('recent')}
                className={`text-sm font-bold pb-2 transition-all border-b-2 flex items-center gap-2 ${
                  activeBottomTab === 'recent'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-white'
                }`}
              >
                <span>🌍</span>
                <span>Latest Community Fares</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab('mine')}
                className={`text-sm font-bold pb-2 transition-all border-b-2 flex items-center gap-2 ${
                  activeBottomTab === 'mine'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-white'
                }`}
              >
                <span>📝</span>
                <span>My Contributions ({myFares.length})</span>
              </button>
            </div>
          </div>

          {/* Tab Content: Recent Community Fares */}
          {activeBottomTab === 'recent' && (
            <div>
              {recentFares.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm">
                  No community fares submitted yet. Be the first to add one!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentFares.map((fare) => (
                    <div
                      key={fare.fare_id}
                      onClick={() => {
                        setFromLocation({
                          id: `custom-from-${fare.fare_id}`,
                          name: fare.from_place_name,
                          lat: parseFloat(fare.from_lat),
                          lng: parseFloat(fare.from_lng)
                        });
                        setToLocation({
                          id: `custom-to-${fare.fare_id}`,
                          name: fare.to_place_name,
                          lat: parseFloat(fare.to_lat),
                          lng: parseFloat(fare.to_lng)
                        });
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="p-4 rounded-xl bg-card/40 border border-white/5 hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-medium text-white/80 flex items-center gap-1">
                          <span>{vehicleIcons[fare.vehicle_type] || '🚗'}</span>
                          <span className="capitalize">{fare.vehicle_type}</span>
                        </span>
                        <span className="text-base font-black text-primary">₹{fare.fare_amount}</span>
                      </div>

                      <div className="text-xs">
                        <p className="font-semibold text-white truncate">{fare.from_place_name}</p>
                        <p className="text-text-secondary/80 flex items-center gap-1 mt-0.5 truncate">
                          <span>↓</span>
                          <span>{fare.to_place_name}</span>
                        </p>
                      </div>

                      {fare.notes && (
                        <p className="text-[11px] text-text-secondary italic line-clamp-2 pt-1 border-t border-white/5">
                          &ldquo;{fare.notes}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1">
                        <span>By {fare.first_name || 'Senior'}</span>
                        <span className="text-primary group-hover:underline">View on Map →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: My Contributions */}
          {activeBottomTab === 'mine' && (
            <div>
              {myFares.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm">
                  You haven&apos;t contributed any fares yet. Click &ldquo;Contribute Fare&rdquo; above to share your travel rates!
                </div>
              ) : (
                <div className="space-y-2">
                  {myFares.map((fare) => (
                    <div
                      key={fare.fare_id}
                      className="p-3.5 rounded-xl bg-card/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-lg bg-white/5">
                          {vehicleIcons[fare.vehicle_type] || '🚗'}
                        </span>
                        <div>
                          <p className="font-bold text-text-primary text-sm">
                            {fare.from_place_name} → {fare.to_place_name}
                          </p>
                          <p className="text-[11px] text-text-secondary mt-0.5">
                            {fare.vehicle_type} • {new Date(fare.submitted_at).toLocaleDateString()}
                            {fare.notes && ` • "${fare.notes}"`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="text-base font-black text-primary">₹{fare.fare_amount}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this contribution?')) {
                              await deleteFare(fare.fare_id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10"
                          title="Delete this fare"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
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
