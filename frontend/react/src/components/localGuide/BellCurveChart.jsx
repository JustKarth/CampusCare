import { useState, useEffect } from 'react';
import { useFareAggregation } from '../../hooks/useFareAggregation';

// Bell Curve Chart Component
// Fare as Y-axis with bell curve visualization
export function BellCurveChart({ placeKey, placeName }) {
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
  const rawDistribution = aggregationData.distribution;

  // Calculate chart dimensions
  const maxUsers = Math.max(...rawDistribution.map(d => d.users));
  const minFare = Math.min(...rawDistribution.map(d => d.fare));
  const maxFare = Math.max(...rawDistribution.map(d => d.fare));
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = 80;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Scaling functions
  const xScale = (users) => {
    if (maxUsers === 0) return padding + plotWidth / 2;
    return padding + ((users - 0) / (maxUsers - 0)) * plotWidth;
  };

  const yScale = (fare) => {
    if (maxFare === minFare) return chartHeight - padding;
    return chartHeight - padding - ((fare - minFare) / (maxFare - minFare)) * plotHeight;
  };

  // Generate bell curve using Gaussian distribution
  const generateBellCurve = (data) => {
    if (data.length === 0) return [];
    
    const bellCurve = [];
    const step = (maxFare - minFare) / 100; // 100 points for smooth curve
    
    for (let i = 0; i <= 100; i++) {
      const fare = minFare + (i * step);
      
      // Find closest data point
      let closestUsers = 0;
      let closestDistance = Infinity;
      
      data.forEach(point => {
        const distance = Math.abs(point.fare - fare);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestUsers = point.users;
        }
      });
      
      // Apply Gaussian smoothing
      const sigma = 5; // Standard deviation for smoothing
      let weightedSum = 0;
      let weightSum = 0;
      
      data.forEach(point => {
        const distance = Math.abs(point.fare - fare);
        const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
        weightedSum += point.users * weight;
        weightSum += weight;
      });
      
      const smoothedUsers = weightSum > 0 ? weightedSum / weightSum : closestUsers;
      
      bellCurve.push({
        users: smoothedUsers,
        fare: fare,
        isInterpolated: true
      });
    }
    
    return bellCurve;
  };

  const bellCurveData = generateBellCurve(rawDistribution);

  // Generate smooth path for bell curve
  const generateBellPath = (data) => {
    if (data.length === 0) return '';
    
    let path = `M ${xScale(data[0].users)} ${yScale(data[0].fare)}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = xScale(data[i].users);
      const y = yScale(data[i].fare);
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  const bellPath = generateBellPath(bellCurveData);

  // Generate axis labels
  const generateXAxisLabels = () => {
    const labels = [];
    const step = Math.ceil((maxUsers - 0) / 8);
    
    for (let users = 0; users <= maxUsers; users += step) {
      labels.push({
        users,
        x: xScale(users),
        label: users.toString()
      });
    }
    
    return labels;
  };

  const generateYAxisLabels = () => {
    const labels = [];
    const step = Math.ceil((maxFare - minFare) / 5);
    
    for (let fare = Math.floor(minFare); fare <= maxFare; fare += step) {
      labels.push({
        fare,
        y: yScale(fare),
        label: `₹${fare}`
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
          Fare Distribution (Bell Curve)
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {placeName} - Based on {aggregationData.totalFares} fare submission{aggregationData.totalFares !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          📊 Fare as Y-axis with Gaussian smoothing for bell curve visualization
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
          
          {xAxisLabels.map((label) => (
            <line
              key={`grid-v-${label.fare}`}
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
              key={`x-label-${label.users}`}
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
              key={`y-label-${label.fare}`}
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
            Number of Users
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
            Fare Amount (₹)
          </text>
          
          {/* Filled area under bell curve */}
          <path
            d={`${bellPath} L ${xScale(bellCurveData[bellCurveData.length - 1]?.users || maxUsers)} ${chartHeight - padding} L ${xScale(bellCurveData[0]?.users || minUsers)} ${chartHeight - padding} Z`}
            fill="url(#bellGradient)"
            fillOpacity="0.6"
          />
          
          {/* Bell curve line */}
          <path
            d={bellPath}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Actual data points */}
          {rawDistribution.map((point, index) => (
            <g key={`point-${index}`}>
              <circle
                cx={xScale(point.users)}
                cy={yScale(point.fare)}
                r="6"
                fill="#EF4444"
                stroke="#DC2626"
                strokeWidth="2"
              />
              {/* Tooltip */}
              <title>
                Actual Data:\nFare: ₹{point.fare}\nUsers: {point.users}
              </title>
            </g>
          ))}
          
          {/* Peak indicator line */}
          <line
            x1={xScale(rawDistribution.find(d => d.fare === aggregationData.modeFare)?.users || 0)}
            y1={padding}
            x2={xScale(rawDistribution.find(d => d.fare === aggregationData.modeFare)?.users || 0)}
            y2={chartHeight - padding}
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Peak label */}
          <text
            x={xScale(rawDistribution.find(d => d.fare === aggregationData.modeFare)?.users || 0)}
            y={padding - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#10B981"
            fontWeight="bold"
          >
            Peak: ₹{aggregationData.modeFare}
          </text>
        </svg>
        
        {/* Gradient Definition */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="bellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2" />
            </linearGradient>
          </defs>
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

      {/* Bell Curve Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Bell Curve Information</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>Y-Axis:</strong> Fare amount in rupees</p>
          <p><strong>X-Axis:</strong> Number of users who submitted that fare</p>
          <p><strong>Bell Curve:</strong> Gaussian smoothing creates a natural distribution pattern</p>
          <p><strong>Red Dots:</strong> Actual data points from user submissions</p>
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
                insights.consensus === 'Medium' ? 'border-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {insights.consensus}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Data Reliability:</span>
              <span className={`ml-2 px-2 py-1 rounded-full ${
                insights.reliability === 'High' ? 'bg-green-100 text-green-800' :
                insights.reliability === 'Medium' ? 'border-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {insights.reliability}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 The bell curve shows the probability distribution of fares. Higher peaks indicate more common fare amounts.
          </p>
        </div>
      )}
    </div>
  );
}
