import { useState, useMemo } from 'react';

export function FareSummaryCard({
  stats,
  fares = [],
  fromName = 'Origin',
  toName = 'Destination',
  distanceKm = null,
  fromLocation = null,
  toLocation = null,
  onOpenSubmit
}) {
  const [driverQuote, setDriverQuote] = useState('');
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'benchmarks' | 'tips'

  const overall = stats?.overall || {};
  const breakdown = stats?.breakdown || [];
  const totalReports = overall.total_count || 0;

  // Calculate effective road distance (km)
  const effectiveDistance = useMemo(() => {
    if (distanceKm && !isNaN(distanceKm) && distanceKm > 0) return parseFloat(distanceKm);
    if (fromLocation?.lat && fromLocation?.lng && toLocation?.lat && toLocation?.lng) {
      const R = 6371;
      const dLat = ((toLocation.lat - fromLocation.lat) * Math.PI) / 180;
      const dLon = ((toLocation.lng - fromLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((fromLocation.lat * Math.PI) / 180) *
          Math.cos((toLocation.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return parseFloat((R * c * 1.25).toFixed(1));
    }
    return 7.0; // fallback reasonable Prayagraj intra-city distance
  }, [distanceKm, fromLocation, toLocation]);

  // Market App Benchmarks based on real road distance
  const bikeBenchmark = Math.max(25, Math.round(25 + Math.max(0, effectiveDistance - 1.5) * 7.5));
  const appAutoBenchmark = Math.max(35, Math.round(35 + Math.max(0, effectiveDistance - 1.5) * 13));
  const cabBenchmark = Math.max(60, Math.round(60 + Math.max(0, effectiveDistance - 2.0) * 17));

  // Local Shared Auto & E-Rickshaw Estimate (The Core CampusCare Aim)
  const sharedAutoEstimate = useMemo(() => {
    if (effectiveDistance <= 3.5) return '10 - 15';
    if (effectiveDistance <= 7.0) return '15 - 20';
    if (effectiveDistance <= 12.0) return '20 - 30';
    return '30 - 45';
  }, [effectiveDistance]);

  // Senior-reported offline auto fare
  const autoBreakdown = breakdown.find(b => b.vehicle_type === 'auto');
  const communityAutoAvg = autoBreakdown ? Math.round(autoBreakdown.avg_fare) : (overall.avg_fare ? Math.round(overall.avg_fare) : null);
  const benchmarkBaseline = communityAutoAvg || Math.round(appAutoBenchmark * 0.7);

  // Anti-Overcharge Calculator
  const quoteNum = parseFloat(driverQuote);
  let overchargeStatus = null;
  if (!isNaN(quoteNum) && quoteNum > 0) {
    const ratio = quoteNum / benchmarkBaseline;
    if (ratio <= 1.05) {
      overchargeStatus = {
        type: 'fair',
        badge: '🟢 Fair Price',
        message: `Within normal offline range (₹${benchmarkBaseline}). Safe to board!`,
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      };
    } else if (ratio <= 1.3) {
      overchargeStatus = {
        type: 'moderate',
        badge: '🟡 Slightly High',
        message: `Seniors usually pay ~₹${benchmarkBaseline} (App auto is ~₹${appAutoBenchmark}). Counter with ₹${benchmarkBaseline} - ₹${Math.round(benchmarkBaseline * 1.15)}.`,
        bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      };
    } else {
      const excess = Math.round(quoteNum - benchmarkBaseline);
      overchargeStatus = {
        type: 'high',
        badge: '🔴 Overcharging Alert!',
        message: `Asking ₹${excess} more than fair price (₹${benchmarkBaseline}). App auto is only ~₹${appAutoBenchmark}, and shared auto is ~₹${sharedAutoEstimate.split('-')[0]}! Negotiate hard or look for another ride.`,
        bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      };
    }
  }

  const vehicleIcons = {
    auto: '🛺',
    cab: '🚗',
    'e-rickshaw': '⚡',
    bus: '🚌',
    other: '🛵'
  };

  const vehicleLabels = {
    auto: 'Reserved Auto',
    cab: 'Cab / Taxi',
    'e-rickshaw': 'E-Rickshaw (Shared/Private)',
    bus: 'City Bus',
    other: 'Other'
  };

  return (
    <div className="card-glass rounded-2xl p-5 md:p-6 space-y-5 shadow-2xl border border-white/10">
      {/* Route Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <span>Route Pricing Intelligence</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">~{effectiveDistance} km</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-text-primary mt-0.5">
            {fromName} <span className="text-primary font-normal">→</span> {toName}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {totalReports > 0
              ? `Backed by ${totalReports} community report${totalReports === 1 ? '' : 's'} & live distance rate benchmarks`
              : `Live distance benchmarks for ${effectiveDistance} km route`}
          </p>
        </div>

        {onOpenSubmit && (
          <button
            type="button"
            onClick={onOpenSubmit}
            className="btn-primary text-xs px-3.5 py-2 self-start sm:self-auto flex items-center gap-1.5 shadow-lg shadow-primary/20"
          >
            <span>+</span>
            <span>Add What You Paid</span>
          </button>
        )}
      </div>

      {/* Best Price / Most Economic Spotlight */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/10 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-inner">⚡</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-sm">
                  Best Price / Most Economic
                </span>
                <span className="text-xs font-bold text-emerald-300">Shared E-Rickshaw / Tempo</span>
              </div>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                Standard fixed-stage fare per student across this {effectiveDistance} km route.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-emerald-500/25 sm:pl-5 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 tracking-tight">
                ₹{sharedAutoEstimate}
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 whitespace-nowrap">
              Save up to 80% vs App Cab
            </span>
          </div>
        </div>
      </div>

      {/* Segment Tabs: Student Reports FIRST by default */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('breakdown')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'breakdown'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-text-secondary hover:text-white hover:bg-white/5'
          }`}
        >
          👥 Student Reports ({totalReports})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('benchmarks')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'benchmarks'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-text-secondary hover:text-white hover:bg-white/5'
          }`}
        >
          📊 Compare Online vs Offline
        </button>

        {fares.some(f => f.notes) && (
          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'tips'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            💡 Senior Tips
          </button>
        )}
      </div>

      {/* TAB 1: App Benchmarks (Rapido, Uber, Ola) vs. Offline */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Bike Taxi (Rapido / Uber Moto) */}
            <div className="p-3 bg-card/60 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-text-secondary text-xs">
                <span>🏍️ Bike Taxi</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Rapido/Moto</span>
              </div>
              <p className="text-xl font-black text-text-primary">~₹{bikeBenchmark}</p>
              <p className="text-[10px] text-text-secondary">Solo fast ride</p>
            </div>

            {/* Offline Negotiated Auto (Senior Reality) */}
            <div className="p-3 bg-primary/15 border-2 border-primary/40 rounded-xl space-y-1 shadow-lg shadow-primary/10">
              <div className="flex items-center justify-between text-primary text-xs font-bold">
                <span>🛺 Offline Auto</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary text-white font-bold">Senior Target</span>
              </div>
              <p className="text-xl font-black text-primary">
                {communityAutoAvg ? `₹${communityAutoAvg}` : `~₹${benchmarkBaseline}`}
              </p>
              <p className="text-[10px] text-text-secondary">Target negotiation</p>
            </div>

            {/* App Auto (Uber Auto / Ola Auto) */}
            <div className="p-3 bg-card/60 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-text-secondary text-xs">
                <span>📱 App Auto</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-semibold">Uber/Ola</span>
              </div>
              <p className="text-xl font-black text-text-primary">~₹{appAutoBenchmark}</p>
              <p className="text-[10px] text-text-secondary">Meter / App booking</p>
            </div>

            {/* App Cab (Uber Go / Ola Mini) */}
            <div className="p-3 bg-card/60 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-text-secondary text-xs">
                <span>🚗 App Cab</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-semibold">Uber Go</span>
              </div>
              <p className="text-xl font-black text-text-primary">~₹{cabBenchmark}</p>
              <p className="text-[10px] text-text-secondary">AC 4-seater cab</p>
            </div>
          </div>
          <p className="text-[10px] text-text-secondary/70 italic px-1">
            * App benchmarks are estimated using standard tier-2 city rate cards for {effectiveDistance} km. Local offline drivers often ask 30–50% more from newcomers—use the counter-offer below!
          </p>
        </div>
      )}

      {/* TAB 2: Student Reports Breakdown */}
      {activeTab === 'breakdown' && (
        <div className="space-y-3">
          {totalReports > 0 ? (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-card/60 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase tracking-wide text-emerald-400 font-semibold block">Lowest Paid</span>
                <span className="text-xl font-black text-text-primary mt-0.5 block">₹{overall.min_fare}</span>
                <span className="text-[10px] text-text-secondary">Best deal reported</span>
              </div>

              <div className="bg-primary/20 border border-primary/40 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase tracking-wide text-primary font-bold block">Community Avg</span>
                <span className="text-xl font-black text-primary mt-0.5 block">₹{Math.round(overall.avg_fare)}</span>
                <span className="text-[10px] text-text-secondary">Reported average</span>
              </div>

              <div className="bg-card/60 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase tracking-wide text-amber-400 font-semibold block">Highest Paid</span>
                <span className="text-xl font-black text-text-primary mt-0.5 block">₹{overall.max_fare}</span>
                <span className="text-[10px] text-text-secondary">Peak / late-night</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card/40 border border-dashed border-white/15 text-center text-xs text-text-secondary">
              No offline fares submitted by students for this exact route yet. Be the first to report!
            </div>
          )}

          {breakdown.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {breakdown.map((item) => (
                <div
                  key={item.vehicle_type}
                  className="p-2.5 bg-card/40 border border-white/5 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{vehicleIcons[item.vehicle_type] || '🚗'}</span>
                    <div>
                      <p className="font-semibold text-text-primary">{vehicleLabels[item.vehicle_type] || item.vehicle_type}</p>
                      <p className="text-[10px] text-text-secondary">{item.count} report{item.count === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-primary">₹{item.avg_fare}</span>
                    <span className="text-[9px] text-text-secondary block">avg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Senior Tips */}
      {activeTab === 'tips' && (
        <div className="space-y-2">
          {fares
            .filter(f => f.notes)
            .slice(0, 4)
            .map((fare) => (
              <div
                key={fare.fare_id}
                className="p-3 bg-card/40 rounded-xl border border-white/5 text-xs space-y-1"
              >
                <p className="text-text-primary leading-relaxed">&ldquo;{fare.notes}&rdquo;</p>
                <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1 border-t border-white/5">
                  <span>
                    {vehicleIcons[fare.vehicle_type] || '🚗'} Paid ₹{fare.fare_amount} ({fare.vehicle_type})
                  </span>
                  <span>
                    By {fare.first_name || 'Senior'} • {new Date(fare.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Anti-Overcharge Driver Quote Checker */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Driver Quote Verifier</h4>
              <p className="text-[11px] text-text-secondary">Enter what an offline auto/cab driver is demanding</p>
            </div>
          </div>
          <span className="text-[11px] text-primary font-bold">Target: ~₹{benchmarkBaseline}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">₹</span>
            <input
              type="number"
              placeholder={`e.g. ${benchmarkBaseline + 40}`}
              value={driverQuote}
              onChange={(e) => setDriverQuote(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {driverQuote && (
            <button
              type="button"
              onClick={() => setDriverQuote('')}
              className="text-xs text-text-secondary hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {overchargeStatus && (
          <div className={`p-3 rounded-xl border ${overchargeStatus.bgColor} animate-fadeIn`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
              <span>{overchargeStatus.badge}</span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-95">{overchargeStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
