import { useState, useEffect } from 'react';
import { useFareStorage } from './useFareStorage';

// Fare Aggregation Hook
// Processes fare data for distribution visualization
export function useFareAggregation(placeKey) {
  const { getAggregatedFares, getFaresForPlace } = useFareStorage();
  const [aggregationData, setAggregationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processData = () => {
      setLoading(true);
      setError(null);

      try {
        const data = getAggregatedFares(placeKey);
        
        if (data.totalFares === 0) {
          setAggregationData(null);
          return;
        }

        // Process data for smooth distribution curve
        const processedData = processDistributionData(data.distribution);
        
        setAggregationData({
          ...data,
          processedDistribution: processedData,
          // Additional statistics
          medianFare: calculateMedian(data.distribution),
          modeFare: calculateMode(data.distribution),
          standardDeviation: calculateStandardDeviation(data.distribution)
        });
      } catch (err) {
        setError(err.message || 'Failed to process fare data');
      } finally {
        setLoading(false);
      }
    };

    if (placeKey) {
      processData();
    }
  }, [placeKey, getAggregatedFares]);

  // Process distribution data for smooth curve visualization
  const processDistributionData = (distribution) => {
    if (!distribution || distribution.length === 0) {
      return [];
    }

    // Sort by fare amount
    const sorted = [...distribution].sort((a, b) => a.fare - b.fare);
    
    // Find min and max for range
    const minFare = sorted[0].fare;
    const maxFare = sorted[sorted.length - 1].fare;
    
    // Create interpolated points for smooth curve
    const interpolatedPoints = [];
    const step = Math.max(1, (maxFare - minFare) / 20); // 20 points max
    
    for (let fare = minFare; fare <= maxFare; fare += step) {
      const interpolatedUsers = interpolateUsers(sorted, fare);
      if (interpolatedUsers > 0) {
        interpolatedPoints.push({
          fare: Math.round(fare * 100) / 100, // Round to 2 decimal places
          users: interpolatedUsers,
          isInterpolated: !sorted.find(point => Math.abs(point.fare - fare) < 0.5)
        });
      }
    }

    return interpolatedPoints;
  };

  // Interpolate user count for smooth curve
  const interpolateUsers = (dataPoints, targetFare) => {
    // Find surrounding data points
    let lowerPoint = null;
    let upperPoint = null;

    for (const point of dataPoints) {
      if (point.fare <= targetFare) {
        lowerPoint = point;
      }
      if (point.fare >= targetFare && !upperPoint) {
        upperPoint = point;
        break;
      }
    }

    // Exact match
    if (lowerPoint && Math.abs(lowerPoint.fare - targetFare) < 0.5) {
      return lowerPoint.users;
    }

    // Linear interpolation
    if (lowerPoint && upperPoint && lowerPoint.fare !== upperPoint.fare) {
      const ratio = (targetFare - lowerPoint.fare) / (upperPoint.fare - lowerPoint.fare);
      return Math.round(lowerPoint.users + ratio * (upperPoint.users - lowerPoint.users));
    }

    // Extrapolation or single point
    return lowerPoint ? lowerPoint.users : (upperPoint ? upperPoint.users : 0);
  };

  // Calculate median fare
  const calculateMedian = (distribution) => {
    if (!distribution || distribution.length === 0) return 0;
    
    const allFares = [];
    distribution.forEach(item => {
      for (let i = 0; i < item.users; i++) {
        allFares.push(item.fare);
      }
    });

    allFares.sort((a, b) => a - b);
    const mid = Math.floor(allFares.length / 2);
    
    return allFares.length % 2 === 0
      ? (allFares[mid - 1] + allFares[mid]) / 2
      : allFares[mid];
  };

  // Calculate mode (most common fare)
  const calculateMode = (distribution) => {
    if (!distribution || distribution.length === 0) return 0;
    
    let maxUsers = 0;
    let modeFare = 0;
    
    distribution.forEach(item => {
      if (item.users > maxUsers) {
        maxUsers = item.users;
        modeFare = item.fare;
      }
    });

    return modeFare;
  };

  // Calculate standard deviation
  const calculateStandardDeviation = (distribution) => {
    if (!distribution || distribution.length === 0) return 0;
    
    const allFares = [];
    distribution.forEach(item => {
      for (let i = 0; i < item.users; i++) {
        allFares.push(item.fare);
      }
    });

    const mean = allFares.reduce((sum, fare) => sum + fare, 0) / allFares.length;
    const squaredDiffs = allFares.map(fare => Math.pow(fare - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / allFares.length;
    
    return Math.sqrt(avgSquaredDiff);
  };

  // Get distribution insights
  const getInsights = () => {
    if (!aggregationData || aggregationData.totalFares === 0) {
      return null;
    }

    const { averageFare, medianFare, modeFare, standardDeviation, totalFares } = aggregationData;
    
    return {
      consensus: standardDeviation < averageFare * 0.3 ? 'High' : 
                standardDeviation < averageFare * 0.5 ? 'Medium' : 'Low',
      range: aggregationData.maxFare - aggregationData.minFare,
      variability: standardDeviation / averageFare,
      reliability: totalFares >= 5 ? 'High' : totalFares >= 3 ? 'Medium' : 'Low'
    };
  };

  return {
    aggregationData,
    loading,
    error,
    getInsights,
    processDistributionData
  };
}
