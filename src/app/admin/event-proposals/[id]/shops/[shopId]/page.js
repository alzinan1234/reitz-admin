'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const ShopDetailsPage = ({ params }) => {
  const router = useRouter();
  
  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-500/40 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1 bg-white/50 hover:bg-white rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Header Image Carousel */}
        <div className="relative h-56 w-full">
           <Image 
             src="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop" 
             alt="Fabric Pattern"
             fill
             className="object-cover"
           />
           {/* Carousel Controls */}
           <div className="absolute inset-0 flex items-center justify-between px-4">
             <button className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50">
                <ArrowLeft size={18}/>
             </button>
             <button className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50">
                <ArrowRight size={18}/>
             </button>
           </div>
           {/* Pagination Dots */}
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
           </div>
        </div>

        {/* Logo Overlay */}
        <div className="relative px-8">
            <div className="absolute -top-12 left-8 w-24 h-24 rounded-full border-4 border-pink-200 bg-[#2D2B4A] flex items-center justify-center overflow-hidden shadow-lg z-20">
                {/* Simulated Logo text */}
                <div className="text-center">
                    <div className="text-white font-black text-sm leading-none">Fabric</div>
                    <div className="text-white font-black text-sm leading-none">Frolic</div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-8 pb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-6">Shop Details :</h2>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Shop Name:</p>
                    <p className="text-sm font-semibold text-gray-800">Fabric Frolic</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Email:</p>
                    <p className="text-sm font-semibold text-gray-800">@gmail.com</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Contact Person Name:</p>
                    <p className="text-sm font-semibold text-gray-800">Lukas Wagner</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Contact Number:</p>
                    <p className="text-sm font-semibold text-gray-800">+1 212-555-1984</p>
                </div>
            </div>

            {/* About Section */}
            <div>
                <p className="text-xs text-gray-500 mb-1">About the Shop:</p>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Welcome to Fabric Frolic, where creativity meets quality! We offer a vibrant collection of fabrics, threads, and sewing essentials — from soft cottons and elegant silks to bold prints and eco-friendly materials. Whether you're a designer, DIY enthusiast, or just love crafting, Fabric Frolic is your destination for inspiration and premium fabrics.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ShopDetailsPage;