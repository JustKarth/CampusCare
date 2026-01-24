import { useState, useEffect } from 'react';
import { useFareAggregation } from '../../hooks/useFareAggregation';

// Corrected Fare Chart Component
// Properly plots fare distribution points with correct scaling
export function CorrectedFareChart({ placeKey, placeName }) {
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
  const rawDistribution = aggregationData.distribution;

  // Calculate chart dimensions
  const maxUsers = Math.max(...rawDistribution.map(d => d.users));
  const minFare = Math.min(...rawDistribution.map(d => d.fare));
  const maxFare = Math.max(...rawDistribution.map(d => d.fare));
  const chartWidth = 700;
  const chartHeight = 350;
  const padding = 60;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Scaling functions
  const xScale = (fare) => {
    if (maxFare === minFare) return padding + plotWidth / 2;
    return padding + ((fare - minFare) / (maxFare - minFare)) * plotWidth;
  };

  const yScale = (users) => {
    if (maxUsers === 0) return chartHeight - padding;
    return chartHeight - padding - (users / maxUsers) * plotHeight;
  };

  // Generate smooth curve path using actual data points
  const generateSmoothPath = (data) => {
    if (data.length === 0) return '';
    
    let path = `M ${xScale(data[0].fare)} ${yScale(data[0].users)}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = xScale(data[i].fare);
      const y = yScale(data[i].users);
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const pathData = generateSmoothPath(chartData);

  // Generate axis labels
  const generateXAxisLabels = () => {
    const labels = [];
    const step = Math.ceil((maxFare - minFare) / 5);
    
    for (let fare = Math.floor(minFare); fare <= maxFare; fare += step) {
      labels.push({
        fare,
        x: xScale(fare),
        label: `₹${fare}`
      });
    }
    
    return labels;
  };

  const generateYAxisLabels = () => {
    const labels = [];
    const step = Math.ceil(maxUsers / 5);
    
    for (let users = 0; users <= maxUsers; users += step) {
      labels.push({
        users,
        y: yScale(users),
        label: users.toString()
      });
    }
    
    return labels;
  };

  const xAxisLabels = generateXAxisLabels();
  const yAxisLabels = generateYAxisLabels();

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
        <p className="text-xs text-gray-500 mt-1">
          Range: ₹{minFare} - ₹{maxFare} | Peak: ₹{aggregationData.modeFare} ({aggregationData.distribution.find(d => d.fare === aggregationData.modeFare)?.users} users)
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6 overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto border border-gray-200 rounded">
          {/* Background */}
          <rect width={chartWidth} height={chartHeight} fill="#FAFAFA" />
          
          {/* Grid lines */}
          {yAxisLabels.map((label, index) => (
            <line
              key={`grid-h-${index}`}
              x1={padding}
              y1={label.y}
              x2={chartWidth - padding}
              y2={label.y}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {xAxisLabels.map((label, index) => (
            <line
              key={`grid-v-${index}`}
              x1={label.x}
              y1={padding}
              x2={label.x}
              y2={chartHeight - padding}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#374151" strokeWidth="2" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#374151" strokeWidth="2" />
          
          {/* X-axis labels */}
          {xAxisLabels.map((label) => (
            <text
              key={`x-label-${label.fare}`}
              x={label.x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {label.label}
            </text>
          ))}
          
          {/* Y-axis labels */}
          {yAxisLabels.map((label) => (
            <text
              key={`y-label-${label.users}`}
              x={padding - 10}
              y={label.y + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6B7280"
            >
              {label.label}
            </text>
          ))}
          
          {/* Axis titles */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 5}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="bold"
          >
            Fare Amount (₹)
          </text>
          
          <text
            x={15}
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="bold"
            transform={`rotate(-90 15 ${chartHeight / 2})`}
          >
            Number of Users
          </text>
          
          {/* Filled area under curve */}
          <path
            d={`${pathData} L ${xScale(rawDistribution[rawDistribution.length - 1]?.fare || maxFare)} ${chartHeight - padding} L ${xScale(rawDistribution[0]?.fare || minFare)} ${chartHeight - padding} Z`}
            fill="#93C5FD"
            fillOpacity="0.3"
          />
          
          {/* Distribution curve */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Data points */}
          {rawDistribution.map((point, index) => (
            <g key={`point-${index}`}>
              <circle
                cx={xScale(point.fare)}
                cy={yScale(point.users)}
                r="5"
                fill="#3B82F6"
                stroke="#1E40AF"
                strokeWidth="2"
              />
              {/* Tooltip */}
              <title>
                Fare: ₹{point.fare}\nUsers: {point.users}
              </title>
            </g>
          ))}
          
          {/* Peak indicator line */}
          <line
            x1={xScale(aggregationData.modeFare)}
            y1={padding}
            x2={xScale(aggregationData.modeFare)}
            y2={chartHeight - padding}
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Peak label */}
          <text
            x={xScale(aggregationData.modeFare)}
            y={padding - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#EF4444"
            fontWeight="bold"
          >
            Peak: ₹{aggregationData.modeFare}
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
