'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getEventProposals, processEventAction } from '../lib/eventApiClient';

const EventProposals = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // সার্চের জন্য আলাদা স্টেট
  const [searchTerm, setSearchTerm] = useState(""); // সার্চ ইনপুট স্টেট
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEventProposals();
      // API থেকে আসা ডাটা সেভ করা
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // সার্চ ফাংশনালিটি হ্যান্ডেল করার জন্য useEffect
  useEffect(() => {
    const results = events.filter(event =>
      event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.contactNumber?.includes(searchTerm)
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  const handleAction = async (id, action) => {
    if (confirm(`Are you sure you want to ${action} this event?`)) {
      try {
        await processEventAction(id, action);
        fetchEvents(); // লিস্ট রিফ্রেশ করা
      } catch (err) { alert("Failed to update status"); }
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Loading Proposals...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Proposals</h1>
        
        {/* সার্চ ইনপুট সেকশন */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // বর্ডার গ্রে এবং টেক্সট ব্ল্যাক করা হয়েছে
            className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm w-64 text-black focus:outline-none focus:border-gray-500" 
          />
        </div>
      </div>

      <div className="w-full overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4A6072] text-white text-sm">
              <th className="py-4 px-6">Event Name</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Contact Number</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 text-sm">
                  <td className="py-4 px-6 font-medium text-gray-600">{event.eventName}</td>
                  <td className="py-4 px-6 text-gray-600">{event.location}</td>
                  <td className="py-4 px-6 text-gray-600">{event.contactNumber}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${event.status === 'Pending' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-3">
                    <button onClick={() => handleAction(event.id, 'approve')} className="p-2 bg-green-500 text-white rounded-full transition-transform hover:scale-110"><CheckIcon /></button>
                    <button onClick={() => handleAction(event.id, 'reject')} className="p-2 bg-red-500 text-white rounded-full transition-transform hover:scale-110"><CrossIcon /></button>
                    <button onClick={() => router.push(`/admin/event-proposals/${event.id}`)} className="p-2 bg-purple-500 text-white rounded-full transition-transform hover:scale-110"><EyeIcon /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">No events found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper Icons
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const CrossIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default EventProposals;