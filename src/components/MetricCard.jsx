// components/MetricCard.js
"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import getEarningsOverview from './lib/dashboardApiClient';


/**
 * A reusable card component to display a single metric with real-time data.
 * @param {string} title - The title of the metric.
 * @param {string} dataKey - The key to fetch from API response (e.g., 'total_revenue', 'total_transactions').
 * @param {string} format - Format type: 'currency', 'number', or 'percentage'
 * @param {string[]} timePeriodData - Dropdown options.
 */
export default function MetricCard({ 
  title, 
  dataKey, 
  format = 'number',
  timePeriodData = ['This Month', 'Last Month', 'Last 3 Months'] 
}) {
  const [selectedPeriod, setSelectedPeriod] = useState(timePeriodData[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [value, setValue] = useState('--');
  const [percentageChange, setPercentageChange] = useState(0);
  const [percentageDirection, setPercentageDirection] = useState('up');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    setIsHydrated(true);
    fetchMetricData();
  }, [dataKey, selectedPeriod]);

  const fetchMetricData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEarningsOverview();

      if (response) {
        // Get the value from API response
        let metricValue = response[dataKey];

        // Format the value based on format type
        let formattedValue;
        if (format === 'currency') {
          formattedValue = `$${parseFloat(metricValue || 0).toFixed(2)}`;
        } else if (format === 'percentage') {
          formattedValue = `${parseFloat(metricValue || 0).toFixed(2)}%`;
        } else {
          formattedValue = parseInt(metricValue || 0).toLocaleString();
        }

        setValue(formattedValue);

        // Set percentage change (using revenue_growth_percentage as default)
        const growth = parseFloat(response.revenue_growth_percentage || 0);
        setPercentageChange(Math.abs(growth).toFixed(2));
        setPercentageDirection(growth >= 0 ? 'up' : 'down');
      }
    } catch (err) {
      console.error(`Error fetching ${dataKey}:`, err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Determine icon and colors based on percentage direction
  const ChangeIcon = percentageDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
  const changeColor = percentageDirection === 'up' ? 'text-green-600' : 'text-red-600';
  const changeBg = percentageDirection === 'up' ? 'bg-green-100' : 'bg-red-100';

  if (!isHydrated) {
    return null;
  }

  return (
    <div style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)' }} className="w-full h-full bg-white p-6 border border-gray-200/80 rounded-xl flex flex-col justify-between shadow-sm">
      {/* Header: Title and Time Period Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 text-base font-medium font-['Roboto']">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1 bg-[#4B697F] border border-gray-300 rounded-full text-white text-sm font-semibold font-['DM Sans']"
          >
            <span>{selectedPeriod}</span>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-white" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-white" />
            )}
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              {timePeriodData.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Value */}
      <div className="text-black text-4xl font-bold font-['Roboto'] mb-2">
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : error ? (
          <span className="text-red-500 text-sm">{error}</span>
        ) : (
          value
        )}
      </div>

      {/* Percentage Change Indicator */}
      {!loading && !error && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 ${changeBg} rounded-full`}>
            <ChangeIcon className={`w-3 h-3 ${changeColor}`} />
            <div className={`text-sm font-semibold font-['DM Sans'] ${changeColor}`}>
              {percentageChange}%
            </div>
          </div>
          <span className="text-gray-500 text-sm font-normal font-['Roboto']">From the last month</span>
        </div>
      )}
    </div>
  );
}