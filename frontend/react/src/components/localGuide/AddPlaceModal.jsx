import { useState } from 'react';
import { SearchService } from '../../services/searchService';

export function AddPlaceModal({ categories = [], onSubmit, onClose }) {
  const [placeName, setPlaceName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.category_id || 23);
  const [placeDescription, setPlaceDescription] = useState('');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [priceRange, setPriceRange] = useState('₹50 - ₹150');
  const [tags, setTags] = useState('');
  const [initialRating, setInitialRating] = useState(5);
  const [initialReview, setInitialReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLng(longitude);
        try {
          const geo = await SearchService.reverseGeocode(latitude, longitude);
          if (geo?.display_name) {
            setAddress(geo.display_name.split(',').slice(0, 3).join(',').trim());
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Unable to get current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!placeName.trim() || !placeDescription.trim()) {
      setError('Place name and description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await onSubmit({
        placeName: placeName.trim(),
        categoryId: parseInt(categoryId, 10),
        placeDescription: placeDescription.trim(),
        address: address.trim() || 'Near Campus, Prayagraj',
        distance: distance ? parseFloat(distance) : null,
        lat: lat != null ? parseFloat(lat) : null,
        lng: lng != null ? parseFloat(lng) : null,
        priceRange: priceRange.trim(),
        tags: tags.trim(),
        initialRating: parseInt(initialRating, 10),
        initialReview: initialReview.trim()
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to add place.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5 animate-fadeIn my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Recommend a Campus Spot</h3>
              <p className="text-xs text-text-secondary">Share your favorite cafe, hangout, or service with fellow students.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Place Name */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Spot Name *
            </label>
            <input
              type="text"
              required
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="e.g. Rajesh Canteen, Sharma Chai, Ganga Dhaba..."
              className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category & Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Distance from Campus (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 0.3"
                className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Price Range & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Typical Price Range
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g. ₹50 - ₹120"
                className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold uppercase tracking-wider text-text-secondary">
                  Address / Location
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{isLocating ? '⏳' : '📍'}</span>
                  <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                </button>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Outside Ganga Gate, Teliyarganj"
                className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {lat && lng && (
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>✓</span>
                  <span>GPS pinned ({lat.toFixed(4)}, {lng.toFixed(4)})</span>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={placeDescription}
              onChange={(e) => setPlaceDescription(e.target.value)}
              placeholder="What is this place famous for? What makes it great for students?"
              className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Tags <span className="text-text-secondary/60 lowercase">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Cold Coffee, Midnight, Wifi, Affordable"
              className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Your Review & Rating */}
          <div className="p-3.5 rounded-xl bg-card/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setInitialRating(star)}
                    className={`text-lg transition-transform hover:scale-125 ${
                      star <= initialRating ? 'text-amber-400' : 'text-white/20'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={2}
              value={initialReview}
              onChange={(e) => setInitialReview(e.target.value)}
              placeholder="Your first student review (recommended dishes, timing, advice)..."
              className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline text-xs px-4 py-2"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs px-5 py-2 flex items-center gap-2"
            >
              {submitting ? 'Adding...' : 'Add to Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

