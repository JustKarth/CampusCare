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
    <div className="bg-white rounded-lg p-5 mb-4 shadow-md hover:shadow-lg transition-shadow fade-in">
      <h4 className="text-lg font-semibold mb-2 text-gray-800">{escapeHtml(place.place_name)}</h4>
      {place.place_description && (
        <p className="text-gray-600 mb-3 text-sm md:text-base">{escapeHtml(place.place_description)}</p>
      )}
      <div className="space-y-2 text-sm mb-4">
        <p><strong className="text-gray-700">Category:</strong> <span className="text-gray-600">{escapeHtml(place.category_name)}</span></p>
        {place.address && <p><strong className="text-gray-700">Address:</strong> <span className="text-gray-600">{escapeHtml(place.address)}</span></p>}
        {place.distance != null && (
          <p><strong className="text-gray-700">Distance:</strong> <span className="text-gray-600">{escapeHtml(place.distance)} km</span></p>
        )}
        {place.website && (
          <p>
            <a
              href={escapeHtml(place.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Website
            </a>
          </p>
        )}
        {place.phone && <p><strong className="text-gray-700">Phone:</strong> <span className="text-gray-600">{escapeHtml(place.phone)}</span></p>}
        <p>
          <strong className="text-gray-700">Rating:</strong>{' '}
          <span className="text-gray-600">
            {place.average_rating != null
              ? Number(place.average_rating).toFixed(1)
              : 'No ratings'}{' '}
            ({place.rating_count || 0})
          </span>
        </p>
      </div>
      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-sm flex items-center gap-2">
          <span className="text-gray-700">Rate this place:</span>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            disabled={submitting}
            className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all disabled:opacity-50"
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
          className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
