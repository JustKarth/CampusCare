import { useState } from 'react';
import { FarePlaceSearch } from './FarePlaceSearch';

export function FareSubmitForm({
  initialFrom = null,
  initialTo = null,
  onSubmit,
  onCancel,
  isSubmitting = false
}) {
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [fareAmount, setFareAmount] = useState('');
  const [vehicleType, setVehicleType] = useState('auto');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const vehicles = [
    { id: 'auto', label: 'Reserved Auto', icon: '🛺', desc: 'Full auto for yourself/group' },
    { id: 'e-rickshaw', label: 'E-Rickshaw', icon: '⚡', desc: 'Shared or reserved battery rickshaw' },
    { id: 'cab', label: 'Cab / Taxi', icon: '🚗', desc: 'Uber, Ola, or local taxi' },
    { id: 'bus', label: 'City Bus', icon: '🚌', desc: 'UPSRTC / City public bus' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!fromLocation?.name) {
      setValidationError('Please select or specify the origin (starting point).');
      return;
    }

    if (!toLocation?.name) {
      setValidationError('Please select or specify the destination (drop point).');
      return;
    }

    const amount = parseInt(fareAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setValidationError('Please enter a valid fare amount in ₹.');
      return;
    }

    if (amount > 10000) {
      setValidationError('Fare amount exceeds maximum allowed limit (₹10,000).');
      return;
    }

    try {
      await onSubmit({
        fromPlaceName: fromLocation.name,
        fromLat: fromLocation.lat || 0,
        fromLng: fromLocation.lng || 0,
        toPlaceName: toLocation.name,
        toLat: toLocation.lat || 0,
        toLng: toLocation.lng || 0,
        fareAmount: amount,
        vehicleType,
        notes: notes.trim()
      });
    } catch (err) {
      setValidationError(err.message || 'Failed to submit fare.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-6 space-y-6 shadow-2xl border border-white/15">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span>🤝</span>
            <span>Contribute Route Fare</span>
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Share what you actually paid so others don&apos;t get overcharged.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-text-secondary hover:text-white text-lg font-bold px-2 py-1"
          >
            ✕
          </button>
        )}
      </div>

      {validationError && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Origin and Destination Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FarePlaceSearch
          label="From (Origin)"
          placeholder="Where did you start from?"
          selectedLocation={fromLocation}
          onSelectLocation={setFromLocation}
          badgeColor="emerald"
        />

        <FarePlaceSearch
          label="To (Destination)"
          placeholder="Where did you go?"
          selectedLocation={toLocation}
          onSelectLocation={setToLocation}
          badgeColor="rose"
        />
      </div>

      {/* Vehicle Type Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Mode of Transport
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {vehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVehicleType(v.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                vehicleType === v.id
                  ? 'bg-primary/20 border-primary/50 text-white shadow-lg shadow-primary/15 scale-[1.02]'
                  : 'bg-card/40 border-white/10 text-text-secondary hover:bg-card/80 hover:text-white'
              }`}
            >
              <span className="text-2xl block mb-1">{v.icon}</span>
              <p className="font-bold text-xs text-text-primary">{v.label}</p>
              <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{v.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fare Amount */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Fare Amount Paid (in ₹)
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary pointer-events-none">₹</span>
          <input
            type="number"
            min="1"
            max="10000"
            required
            value={fareAmount}
            onChange={(e) => setFareAmount(e.target.value)}
            placeholder="e.g. 80"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-white/15 text-text-primary text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            style={{
              backgroundColor: '#151c2c',
              color: '#f0f4ff',
            }}
          />
        </div>
      </div>

      {/* Senior Tips / Advice */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Tips & Negotiation Advice <span className="text-text-secondary/60 lowercase">(optional)</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Outside station they quote ₹150; walk 100m to the main gate or negotiate down to ₹80. Shared auto from Teliyarganj is ₹20."
          className="w-full px-4 py-2.5 rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          style={{
            backgroundColor: '#151c2c',
            color: '#f0f4ff',
          }}
        />
        <span className="text-[10px] text-text-secondary block text-right mt-1">
          {notes.length}/500 characters
        </span>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline text-xs px-5 py-2.5"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Submit Fare</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

