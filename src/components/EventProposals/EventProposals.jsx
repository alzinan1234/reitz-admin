'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Mock Data
const initialEvents = new Array(8).fill(null).map((_, i) => ({
  id: `evt-${i + 1}`,
  eventName: i === 0 ? "Jane Cooper" : `Event ${i + 1}`, // Matches screenshot text
  location: "123 Main Street, Berlin, Germany",
  contactNumber: "+1 212-555-1984",
  status: "Pending",
}));

const EventProposals = () => {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);

  const handleViewEvent = (eventId) => {
    // Navigate to the dynamic event details page
    router.push(`/admin/event-proposals/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Proposals</h1>
        
        <div className="flex items-center gap-2">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
            </div>
            <button className="p-2 bg-[#4A6072] rounded text-white hover:bg-[#3d5060]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4A6072] text-white text-sm">
              <th className="py-4 px-6 font-semibold">Event Name</th>
              <th className="py-4 px-6 font-semibold">Location</th>
              <th className="py-4 px-6 font-semibold">Contact Number</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="py-4 px-6 font-medium text-gray-700">{event.eventName}</td>
                <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]">{event.location}</td>
                <td className="py-4 px-6 text-gray-600">{event.contactNumber}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    {event.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-3">
                    {/* Approve (Green Check) */}
                    <button className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    {/* Reject (Red Cross) */}
                    <button className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {/* View (Purple Eye) */}
                    <button 
                        onClick={() => handleViewEvent(event.id)}
                        className="w-8 h-8 rounded-full bg-[#A855F7] flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
      {/* Pagination */}
      <div className="flex justify-end items-center mt-12 gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded bg-[#4A6072] text-white shadow-sm">1</button>
        <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">2</button>
        <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">3</button>
        <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">4</button>
        <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
        <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">30</button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  )
}

export default EventProposals
