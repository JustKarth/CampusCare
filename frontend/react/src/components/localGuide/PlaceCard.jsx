import { useState } from 'react';
import { escapeHtml } from '../../utils/escapeHtml';

// Place Card component
// Replaces: localGuide.js HTML template for place display

export function PlaceCard({ place, onSubmitRating }) {
  const [selectedRating, setSelectedRating] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmitRating(place.place_id, parseInt(selectedRating, 10));
    setSubmitting(false);

    if (result.success) {
      setSelectedRating('');
    } else {
      alert(result.error || 'Failed to submit rating.');
    }
  };

  return (
    <div className="bg-card rounded-card p-5 mb-4 shadow-card hover:shadow-card-hover transition-shadow fade-in border border-white/5">
      <h4 className="text-lg font-semibold mb-2 text-text-primary">{escapeHtml(place.place_name)}</h4>
      {place.place_description && (
        <p className="text-text-secondary mb-3 text-sm md:text-base">{escapeHtml(place.place_description)}</p>
      )}
      <div className="space-y-2 text-sm mb-4">
        <p><strong className="text-text-primary">Category:</strong> <span className="text-text-secondary">{escapeHtml(place.category_name)}</span></p>
        {place.address && <p><strong className="text-text-primary">Address:</strong> <span className="text-text-secondary">{escapeHtml(place.address)}</span></p>}
        {place.distance != null && (
          <p><strong className="text-text-primary">Distance:</strong> <span className="text-text-secondary">{escapeHtml(place.distance)} km</span></p>
        )}
        {place.website && (
          <p>
            <a
              href={escapeHtml(place.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Website
            </a>
          </p>
        )}
        {place.phone && <p><strong className="text-text-primary">Phone:</strong> <span className="text-text-secondary">{escapeHtml(place.phone)}</span></p>}
        <p>
          <strong className="text-text-primary">Rating:</strong>{' '}
          <span className="text-text-secondary">
            {place.average_rating != null
              ? Number(place.average_rating).toFixed(1)
              : 'No ratings'}{' '}
            ({place.rating_count || 0})
          </span>
        </p>
      </div>
      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-sm flex items-center gap-2">
          <span className="text-text-primary">Rate this place:</span>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            disabled={submitting}
            className="input-field px-2 py-1"
          >
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <button
          type="button"
          onClick={handleRatingSubmit}
          disabled={submitting || !selectedRating}
          className="btn-primary text-sm"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
