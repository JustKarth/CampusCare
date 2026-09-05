import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { escapeHtml } from '../../utils/escapeHtml';
import { SearchService } from '../../services/searchService';

export function PlaceCard({ place, onSubmitRating, onClaimOnlineSpot }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Location tagging in review
  const [taggedLocation, setTaggedLocation] = useState(null);
  const [fetchingGps, setFetchingGps] = useState(false);

  const handleUseCurrentLocationForReview = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const geoRes = await SearchService.reverseGeocode(lat, lng);
          const address = geoRes?.display_name || 'Current Location';
          setTaggedLocation({ lat, lng, address });
        } catch (err) {
          setTaggedLocation({ lat, lng, address: 'Current Location' });
        } finally {
          setFetchingGps(false);
        }
      },
      (err) => {
        setFetchingGps(false);
        alert('Could not access current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const categoryIcons = {
    Food: '🍔',
    Healthcare: '🏥',
    'Local Hotspots': '📍',
    'Tech Support': '💻',
    'General Stores': '🛒',
    Cinema: '🎬',
    Arcades: '🎮',
    Clothing: '👕',
    Logistics: '📦',
    Miscellaneous: '✨'
  };

  const icon = categoryIcons[place.category_name] || '📍';
  const reviews = place.reviews || [];

  const handleNavigateToFare = () => {
    navigate('/fare-analysis', {
      state: {
        toLocation: {
          id: `place-${place.place_id || 'online-' + Math.random().toString(36).substr(2, 5)}`,
          name: place.place_name,
          lat: place.lat != null ? parseFloat(place.lat) : 25.4358,
          lng: place.lng != null ? parseFloat(place.lng) : 81.8463,
          icon: icon,
          area: place.address || place.category_name || 'Prayagraj'
        },
        fromLocalGuide: true,
        placeName: place.place_name
      }
    });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      alert('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    setSubmitSuccess('');

    // If it's an online place, call onClaimOnlineSpot if provided
    if (place.isOnline && onClaimOnlineSpot) {
      const res = await onClaimOnlineSpot(place, selectedRating, reviewText);
      setSubmitting(false);
      if (res.success) {
        setSubmitSuccess('Review added and spot saved to student guide!');
        setReviewText('');
        setTaggedLocation(null);
        setIsReviewOpen(false);
      } else {
        alert(res.error || 'Failed to submit review.');
      }
      return;
    }

    const result = await onSubmitRating(place.place_id, selectedRating, reviewText, taggedLocation);
    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess('Thank you! Your review and location update have been shared with all students.');
      setReviewText('');
      setTaggedLocation(null);
      setIsReviewOpen(false);
      setTimeout(() => setSubmitSuccess(''), 5000);
    } else {
      alert(result.error || 'Failed to submit rating.');
    }
  };

  return (
    <div className="card-glass rounded-2xl p-5 md:p-6 mb-4 shadow-xl border border-white/10 hover:border-primary/40 transition-all space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10">
            {icon}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg md:text-xl font-bold text-text-primary">
                {escapeHtml(place.place_name)}
              </h3>
              {place.isOnline ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  🌐 Discovered Online
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>✓</span>
                  <span>Student Verified</span>
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{escapeHtml(place.category_name || 'Spot')}</span>
              {place.address && (
                <>
                  <span>•</span>
                  <span>{escapeHtml(place.address)}</span>
                </>
              )}
              {place.distance != null && (
                <>
                  <span>•</span>
                  <span className="text-primary font-semibold">{place.distance} km from campus</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Rating & Price Badge */}
        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1.5 self-start">
          <div className="flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-xl">
            <span className="text-amber-400 font-bold text-sm">★</span>
            <span className="font-black text-text-primary text-sm">
              {place.average_rating != null && place.average_rating > 0
                ? Number(place.average_rating).toFixed(1)
                : 'New'}
            </span>
            <span className="text-[10px] text-text-secondary">
              ({place.rating_count || 0})
            </span>
          </div>
          {place.price_range && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {place.price_range}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {place.place_description && (
        <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
          {escapeHtml(place.place_description)}
        </p>
      )}

      {/* Tags */}
      {place.tags && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {place.tags.split(',').map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Prominent Check Travel Fare & Route CTA Banner */}
      <div className="p-3.5 bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/10 rounded-2xl border border-primary/35 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg hover:border-primary/60 transition-all group">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-xl bg-primary/20 border border-primary/30 group-hover:scale-110 transition-transform">
            🛺
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm font-bold text-white">Plan Ride & Fare to this Spot</p>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-semibold border border-emerald-500/30">
                Shared & Auto
              </span>
            </div>
            <p className="text-[11px] text-white/70 mt-0.5">
              Compare actual student reports, online cab benchmarks & live route
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNavigateToFare}
          className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center flex-shrink-0"
        >
          <span>Check Travel Fare</span>
          <span>→</span>
        </button>
      </div>

      {/* Student Reviews Section */}
      {reviews.length > 0 && (
        <div className="pt-3 border-t border-white/10 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <span>💬</span>
            <span>Student & Senior Reviews ({reviews.length})</span>
          </p>
          <div className="space-y-1.5">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-card/40 border border-white/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary">
                    {rev.first_name || 'Senior'} {rev.last_name || ''}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <span>★</span>
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-text-primary text-[11px] italic leading-relaxed">
                  &ldquo;{escapeHtml(rev.review_text)}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Add Review Button */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        {place.phone ? (
          <a
            href={`tel:${place.phone}`}
            className="text-xs text-text-secondary hover:text-white flex items-center gap-1"
          >
            <span>📞</span>
            <span>{place.phone}</span>
          </a>
        ) : <div />}

        <button
          type="button"
          onClick={() => setIsReviewOpen(prev => !prev)}
          className="btn-outline text-xs px-4 py-1.5 rounded-xl flex items-center gap-1.5 hover:border-primary hover:text-primary transition-all"
        >
          <span>✍️</span>
          <span>{isReviewOpen ? 'Close Review' : 'Add Student Review'}</span>
        </button>
      </div>

      {submitSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
          {submitSuccess}
        </div>
      )}

      {/* Expandable Review & Rating Form */}
      {isReviewOpen && (
        <form
          onSubmit={handleRatingSubmit}
          className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3 animate-fadeIn text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary">Rate your experience:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className={`text-xl transition-transform hover:scale-125 ${
                    star <= selectedRating ? 'text-amber-400' : 'text-white/20'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs font-bold text-white ml-1.5">{selectedRating}/5</span>
            </div>
          </div>

          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share tips for students: best dishes, budget advice, timing, discounts..."
            className="w-full px-3 py-2 bg-card rounded-xl border border-white/15 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={1000}
          />

          {/* Location Tagging / GPS attach in review */}
          <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
                <span>📍</span>
                <span>Tag / Update Spot Location:</span>
              </span>
              <button
                type="button"
                onClick={handleUseCurrentLocationForReview}
                disabled={fetchingGps}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 flex items-center gap-1 transition-all"
              >
                <span>{fetchingGps ? '⏳ Locating...' : '📍 Use My Current Location'}</span>
              </button>
            </div>
            {taggedLocation && (
              <div className="text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                <span className="truncate">
                  ✓ Location pinned: {taggedLocation.address} ({taggedLocation.lat.toFixed(4)}, {taggedLocation.lng.toFixed(4)})
                </span>
                <button
                  type="button"
                  onClick={() => setTaggedLocation(null)}
                  className="text-white/60 hover:text-white ml-2 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsReviewOpen(false)}
              className="text-text-secondary hover:text-white px-3 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
