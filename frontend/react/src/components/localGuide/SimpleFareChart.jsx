import { useState, useEffect } from 'react';
import { useFareAggregation } from '../../hooks/useFareAggregation';

// Simple Fare Chart Component (No external dependencies)
// Visualizes fare distribution using pure CSS/SVG
export function SimpleFareChart({ placeKey, placeName }) {
  const { aggregationData, loading, error, getInsights } = useFareAggregation(placeKey);

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

  // Calculate chart dimensions
  const maxUsers = Math.max(...chartData.map(d => d.users));
  const minFare = Math.min(...chartData.map(d => d.fare));
  const maxFare = Math.max(...chartData.map(d => d.fare));
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  // Generate SVG path for smooth curve
  const generatePath = (data) => {
    if (data.length === 0) return '';
    
    const xScale = (fare) => padding + ((fare - minFare) / (maxFare - minFare)) * (chartWidth - 2 * padding);
    const yScale = (users) => chartHeight - padding - (users / maxUsers) * (chartHeight - 2 * padding);
    
    let path = `M ${xScale(data[0].fare)} ${yScale(data[0].users)}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = xScale(data[i].fare);
      const y = yScale(data[i].users);
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const pathData = generatePath(chartData);

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
      <div className="mb-6 overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={`h-${percent}`}
              x1={padding}
              y1={chartHeight - padding - (percent / 100) * (chartHeight - 2 * padding)}
              x2={chartWidth - padding}
              y2={chartHeight - padding - (percent / 100) * (chartHeight - 2 * padding)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#6B7280" strokeWidth="2" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#6B7280" strokeWidth="2" />
          
          {/* Distribution curve */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Filled area under curve */}
          <path
            d={`${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
            fill="#93C5FD"
            fillOpacity="0.3"
          />
          
          {/* Data points */}
          {chartData.map((point, index) => {
            const x = padding + ((point.fare - minFare) / (maxFare - minFare)) * (chartWidth - 2 * padding);
            const y = chartHeight - padding - (point.users / maxUsers) * (chartHeight - 2 * padding);
            
            if (!point.isInterpolated) {
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3B82F6"
                  stroke="#1E40AF"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
          
          {/* Peak indicator */}
          <line
            x1={padding + ((aggregationData.modeFare - minFare) / (maxFare - minFare)) * (chartWidth - 2 * padding)}
            y1={padding}
            x2={padding + ((aggregationData.modeFare - minFare) / (maxFare - minFare)) * (chartWidth - 2 * padding)}
            y2={chartHeight - padding}
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          
          {/* Labels */}
          <text x={chartWidth / 2} y={chartHeight - 10} textAnchor="middle" fontSize="12" fill="#6B7280">
            Fare Amount (₹)
          </text>
          <text x={15} y={chartHeight / 2} textAnchor="middle" fontSize="12" fill="#6B7280" transform={`rotate(-90 15 ${chartHeight / 2})`}>
            Users
          </text>
          
          {/* Peak label */}
          <text
            x={padding + ((aggregationData.modeFare - minFare) / (maxFare - minFare)) * (chartWidth - 2 * padding)}
            y={padding - 5}
            textAnchor="middle"
            fontSize="12"
            fill="#EF4444"
            fontWeight="bold"
          >
            Most Common: ₹{aggregationData.modeFare}
          </text>
        </svg>
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
