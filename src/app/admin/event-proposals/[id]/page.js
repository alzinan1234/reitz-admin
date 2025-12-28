// admin/event-proposals/[id]/page.jsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getEventDetails, processEventAction } from '@/components/lib/eventApiClient';

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (id) getEventDetails(id).then(setEvent).catch(console.error);
  }, [id]);

  const handleAction = async (action) => {
    toast.loading(`Processing ${action}...`, { id: 'event-action' });
    
    try {
      await processEventAction(id, action);
      toast.success(`Event ${action}ed successfully!`, { id: 'event-action' });
      setTimeout(() => router.push('/admin/event-proposals'), 1500);
    } catch (err) { (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A6072] mb-4"></div>
        <p className="text-gray-600 font-semibold">Loading event details...</p>
      </div>
    </div>
  )
      toast.error(err.message || `Failed to ${action} event`, { id: 'event-action' });
    }
  };

  if (!event) return <div className="p-10 text-center">Loading details...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        {/* Real Dynamic Slider */}
        <div className="relative h-64 w-full bg-gray-200">
          {event.images?.length > 0 && (
            <Image 
              src={event.images[currentImg].image} 
              alt="Event" fill className="object-cover transition-all"
            />
          )}
          {/* Slider Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
             <button onClick={() => setCurrentImg((c) => (c > 0 ? c - 1 : event.images.length - 1))} className="p-2 bg-black/30 rounded-full text-white">←</button>
             <button onClick={() => setCurrentImg((c) => (c + 1) % event.images.length)} className="p-2 bg-black/30 rounded-full text-white">→</button>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Event Proposal Details</h2>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
            <div><p className="text-xs text-gray-600">Event Name</p><p className="font-bold text-gray-600">{event.name}</p></div>
            <div><p className="text-xs text-gray-600">Location</p><p className="font-bold text-gray-600">{event.location}</p></div>
            <div><p className="text-xs text-gray-600">Admin Email</p><p className="font-bold text-gray-600">{event.admin_email}</p></div>
            <div><p className="text-xs text-gray-600">Status</p><p className="font-bold uppercase text-orange-600">{event.status}</p></div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-1">Description</p>
            <p className="text-sm border p-3 rounded bg-white text-gray-600">{event.about_the_event}</p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => handleAction('approve')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">Approve</button>
            <button onClick={() => handleAction('reject')} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;