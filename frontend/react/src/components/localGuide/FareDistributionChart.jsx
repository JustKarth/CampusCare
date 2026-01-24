import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import { useFareAggregation } from '../../hooks/useFareAggregation';

// Fare Distribution Chart Component
// Visualizes fare distribution as a smooth bell-shaped curve
export function FareDistributionChart({ placeKey, placeName }) {
  const { aggregationData, loading, error, getInsights } = useFareAggregation(placeKey);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            Fare: ₹{label}
          </p>
          <p className="text-sm text-gray-600">
            Users: {data.users}
          </p>
          {data.isInterpolated && (
            <p className="text-xs text-gray-500 italic">
              *Estimated value
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot for actual data points
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.isInterpolated) return null;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#3B82F6"
        stroke="#1E40AF"
        strokeWidth={2}
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          <span className="ml-3 text-gray-600">Processing fare data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-red-600">
          <span className="text-2xl">⚠️</span>
          <p className="mt-2">Error loading fare data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!aggregationData || aggregationData.totalFares === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-gray-500">
          <span className="text-2xl">📊</span>
          <p className="mt-2">No fare data available</p>
          <p className="text-sm">Be the first to submit a fare for this place!</p>
        </div>
      </div>
    );
  }

  const insights = getInsights();
  const chartData = aggregationData.processedDistribution;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Fare Distribution
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {placeName} - Based on {aggregationData.totalFares} fare submission{aggregationData.totalFares !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="fare" 
              tickFormatter={(value) => `₹${value}`}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => value}
              label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }}
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Main distribution curve */}
            <Area
              type="monotone"
              dataKey="users"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="#93C5FD"
              fillOpacity={0.3}
              dot={<CustomDot />}
            />
            
            {/* Peak indicator line */}
            <ReferenceLine
              x={aggregationData.modeFare}
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `Most Common: ₹${aggregationData.modeFare}`,
                position: "top",
                fill: "#EF4444",
                fontSize: 12
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-medium">Average</p>
          <p className="text-lg font-bold text-blue-900">₹{aggregationData.averageFare.toFixed(1)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 font-medium">Most Common</p>
          <p className="text-lg font-bold text-green-900">₹{aggregationData.modeFare}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 font-medium">Median</p>
          <p className="text-lg font-bold text-purple-900">₹{aggregationData.medianFare.toFixed(1)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-orange-600 font-medium">Range</p>
          <p className="text-lg font-bold text-orange-900">₹{aggregationData.minFare}-{aggregationData.maxFare}</p>
        </div>
      </div>

      {/* Insights */}
      {insights && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">📊 Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium text-gray-700">Consensus:</span>
              <span className={`ml-2 px-2 py-1 rounded-full ${
                insights.consensus === 'High' ? 'bg-green-100 text-green-800' :
                insights.consensus === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {insights.consensus}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Data Reliability:</span>
              <span className={`ml-2 px-2 py-1 rounded-full ${
                insights.reliability === 'High' ? 'bg-green-100 text-green-800' :
                insights.reliability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {insights.reliability}
              </span>
            </div>
          </div>
          {insights.consensus === 'Low' && (
            <p className="text-xs text-gray-600 mt-2">
              💡 Fares vary significantly. Consider checking route details or time of travel.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
