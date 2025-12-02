// components/MetricCard.js
"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

/**
 * A reusable card component to display a single metric.
 * @param {string} title - The title of the metric.
 * @param {number} value - The numerical value of the metric.
 * @param {number} percentageChange - The percentage change value.
 * @param {'up' | 'down'} percentageDirection - The direction of the change ('up' or 'down').
 * @param {string[]} timePeriodData - An array of strings for the dropdown options (e.g., ['January', 'February']).
 */
export default function MetricCard({ title, value, percentageChange, percentageDirection = 'up', timePeriodData = ['This Month', 'Last Month', 'Last 3 Months'] }) {
  // State to manage the selected time period from the dropdown
  const [selectedPeriod, setSelectedPeriod] = useState(timePeriodData[0]);
  // State to manage the dropdown's visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine the icon and colors based on the percentage direction (up or down)
  const ChangeIcon = percentageDirection === 'up' ? ChevronUpIcon : ChevronDownIcon;
  const changeColor = percentageDirection === 'up' ? 'text-green-600' : 'text-red-600';
  const changeBg = percentageDirection === 'up' ? 'bg-green-100' : 'bg-red-100';

  return (
    // Main container: Set to a solid white background with a light border and shadow for depth.
    <div style={{ boxShadow: '0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)' }} className="w-full h-full bg-white p-6 border border-gray-200/80 rounded-xl flex flex-col justify-between shadow-sm">
      {/* Header: Contains the title and the time period selector dropdown. */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 text-base font-medium font-['Roboto']">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            // Dropdown button: Styled for a clean, light theme.
            className="flex items-center space-x-2 px-3 py-1 bg-[#4B697F] border border-gray-300 rounded-full text-white text-sm font-semibold font-['DM Sans']  "
          >
            <span>{selectedPeriod}</span>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-white" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-white" />
            )}
          </button>
          {/* Dropdown Menu: Appears when the button is clicked. */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              {timePeriodData.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                    // In a real app, you would likely trigger a data refetch here.
                    // e.g., onPeriodChange(period);
                  }}
                  // Dropdown item: Styled for a light theme with a hover effect.
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Value: Changed text to black for high contrast. */}
      <div className="text-black text-4xl font-bold font-['Roboto'] mb-2">
        {value.toLocaleString()}
      </div>

      {/* Percentage Change Indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-0.5 ${changeBg} rounded-full`}>
          <ChangeIcon className={`w-3 h-3 ${changeColor}`} />
          <div className={`text-sm font-semibold font-['DM Sans'] ${changeColor}`}>
            {percentageChange}%
          </div>
        </div>
        <span className="text-gray-500 text-sm font-normal font-['Roboto']">From the last month</span>
      </div>
    </div>
  );
}
