"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';

// --- Mock Icon Components (Replacing Lucide Imports) ---
const X = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>);
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>);
const ArrowRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>);

// --- Mock Data ---
// In a real application, these would be fetched from an API using the event ID.
const MOCK_EVENT_ID = 'evt-12345';
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop", // Bar/Shop Front
  "https://images.unsplash.com/photo-1522205408450-ed44c4e97a46?q=80&w=1200&auto=format&fit=crop", // Interior View
  "https://images.unsplash.com/photo-1555545229-373e72895513?q=80&w=1200&auto=format&fit=crop", // Detail Shot
  "https://images.unsplash.com/photo-1533758376918-052a38622c7b?q=80&w=1200&auto=format&fit=crop" // Crowd View
];
const MOCK_SHOP_LIST = Array.from({ length: 8 }, (_, i) => ({
    id: `shop-${i + 1}`,
    name: `Fabric Frolic ${i % 2 === 0 ? 'Classic' : 'Premium'}`,
    logoPlaceholder: `https://placehold.co/40x40/${i % 2 === 0 ? 'FF0080' : '00A8FF'}/FFFFFF/png?text=S${i+1}`
}));


const EventDetailsPage = () => {
  // Mock 'params' value for event ID

  const router = useRouter();
  const id = MOCK_EVENT_ID; 

  // State for the Image Slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock navigation functions (since we don't have Next.js router)
  const handleClose = () => {
    console.log("Closing modal/navigating back (Mock action)");
    // In a real app, this would be router.back() or closing the modal.
    router.back();
  };

  const handleShopClick = useCallback((shopId) => {
    console.log(`Navigating to shop details for Event ${id} and Shop ${shopId}`);
    router.push(`/admin/event-proposals/${id}/shops/${shopId}`);
  }, [id]);
  
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % MOCK_IMAGES.length
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + MOCK_IMAGES.length) % MOCK_IMAGES.length
    );
  };

  const currentImageUrl = MOCK_IMAGES[currentImageIndex];

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-md"
          aria-label="Close event details"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header Image Area (Slider) */}
        <div className="relative h-64 w-full bg-gray-200">
            {/* Image using standard img tag with key to force re-render on index change */}
            <img
              key={currentImageUrl}
              src={currentImageUrl}
              alt={`Event Image ${currentImageIndex + 1}`}
              className="object-cover w-full h-full transition-opacity duration-500 ease-in-out"
              // Fallback on error, though not strictly necessary for placeholders
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/AAAAAA/FFFFFF?text=Image+Not+Found"; }}
            />
            
            {/* Carousel Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button 
                onClick={handlePrev} 
                className="p-3 bg-black/30 rounded-full text-white hover:bg-black/70 transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ArrowLeft className="w-5 h-5"/>
              </button>
              <button 
                onClick={handleNext} 
                className="p-3 bg-black/30 rounded-full text-white hover:bg-black/70 transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ArrowRight className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {MOCK_IMAGES.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></div>
              ))}
            </div>
        </div>

        {/* Content Container */}
        <div className="p-8">
            
            {/* Status Badge */}
            <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FF6B00] text-white shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Pending Approval
                </span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">Event Proposal Details</h2>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mb-8 p-4 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Event Name:</p>
                    <p className="text-sm font-bold text-gray-800">The Great Shop Hop</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Location:</p>
                    <p className="text-sm font-bold text-gray-800 leading-snug">
                        123 Main Street, Berlin, Germany, 10115
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Contact Person:</p>
                    <p className="text-sm font-bold text-gray-800">Lukas Wagner</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Contact Number:</p>
                    <p className="text-sm font-bold text-gray-800">+1 212-555-1984</p>
                </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
                <p className="text-sm text-gray-500 mb-2 font-medium">Proposal Description:</p>
                <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-inner">
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">
                        Welcome to Fabric Frolic, where creativity meets quality! We offer a vibrant collection of fabrics, threads, and sewing essentials — from soft cottons and elegant silks to bold prints and eco-friendly materials. This event proposal outlines a four-day festival celebrating local craft businesses. Our aim is to drive foot traffic, foster community engagement, and provide a platform for small-scale merchants.
                    </p>
                </div>
            </div>

            {/* Shops List Section */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Proposed Shops ({MOCK_SHOP_LIST.length})</h3>
                <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                    {/* Shop Cards */}
                    {MOCK_SHOP_LIST.map((shop) => (
                        <div
                            key={shop.id}
                            onClick={() => handleShopClick(shop.id)}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-lg transition-all duration-200 group transform hover:scale-[1.02]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center overflow-hidden border">
                                    {/* Mock Logo */}
                                    <img src={shop.logoPlaceholder} width={40} height={40} alt="logo" className="object-cover" />
                                </div>
                                <span className="text-sm font-semibold text-gray-800 truncate">{shop.name}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B00] transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-4 border-t">
                <button className="flex-1 bg-[#34C759] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-200/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Approve Proposal
                </button>
                <button className="flex-1 bg-[#D91B1B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Reject Proposal
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;