"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Centralized dummy user data
const allUsers = new Array(35).fill(null).map((_, i) => ({
    id: `user-${i + 1}`,
    displayId: "rpt_001", // Matches screenshot
    name: i % 2 === 0 ? "Jane Cooper" : "AlexTV",
    email: "alex@example.com",
    userType: i % 2 === 0 ? "Shopper" : "Event Admin",
    phone: "+1 212-555-1984",
    joinedDate: "12 Jan 2024",
    ongoingEvents: i % 2 !== 0 ? "2" : null, // Only for Admin
    avatar: i % 2 === 0 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' 
        : 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
}));

const UserDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = use(params);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) {
            // Simulate fetch
            const foundUser = allUsers.find(u => u.id === id) || allUsers[0];
            setUser(foundUser);
        }
    }, [id]);

    const handleClose = () => {
        router.back();
    };

    if (!user) return <div className="min-h-screen  flex items-center justify-center">Loading...</div>;

    return (
        // Overlay background to simulate modal focus (grey background)
        <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
            
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-8 relative">
                
                {/* Close Button (Top Right X) */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="rounded-2xl object-cover shadow-sm w-full h-full"
                        />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    {/* Row 1 */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">User ID</p>
                        <p className="text-base font-medium text-gray-700">{user.displayId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Email adress</p>
                        <p className="text-base font-medium text-gray-700 break-words">{user.email}</p>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">User Type</p>
                        <p className="text-base font-medium text-gray-700">{user.userType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Joined Date</p>
                        <p className="text-base font-medium text-gray-700">{user.joinedDate}</p>
                    </div>

                    {/* Row 3 */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                        <p className="text-base font-medium text-gray-700">{user.phone}</p>
                    </div>
                    
                    {/* Conditionally render Ongoing Events if it exists (like image 3) */}
                    {user.ongoingEvents && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Ongoing Events</p>
                            <p className="text-base font-medium text-gray-700">{user.ongoingEvents}</p>
                        </div>
                    )}
                </div>

                {/* Ban Button */}
                <button className="w-full bg-[#FFE5E5] text-[#FF4D4D] font-semibold py-3 rounded-lg hover:bg-[#ffcccc] transition-colors text-sm">
                    Ban User
                </button>

            </div>
        </div>
    );
};

export default UserDetailsPage;