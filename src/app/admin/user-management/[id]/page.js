
"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { blockUser, getUserDetails, transformUserDetails, unblockUser } from '@/components/lib/userApiClient';


const UserDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = use(params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUserDetails(id);
            
            if (response) {
                const transformedUser = transformUserDetails(response);
                setUser(transformedUser);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch user details");
            toast.error(err.message || "Failed to fetch user details");
            console.error("Fetch user details error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    const handleBanUser = async () => {
        if (!user) return;

        const action = user.isBlocked ? "unblock" : "block";
        const actionVerb = user.isBlocked ? "Unblocking" : "Blocking";

        const actionPromise = user.isBlocked 
            ? unblockUser(user.email).then(async () => {
                await fetchUserDetails();
              })
            : blockUser(user.email).then(async () => {
                await fetchUserDetails();
              });

        toast.promise(
            actionPromise,
            {
                loading: `${actionVerb} ${user.name}...`,
                success: user.isBlocked 
                    ? `${user.name} has been unblocked successfully! ✅`
                    : `${user.name} has been blocked successfully! 🚫`,
                error: (err) => err.message || `Failed to ${action} user`,
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 3000,
                },
                error: {
                    duration: 4000,
                },
            }
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A6072]"></div>
                    <p className="mt-4 text-gray-600">Loading user details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => fetchUserDetails()}
                        className="px-4 py-2 bg-[#4A6072] text-white rounded hover:bg-[#3d5060] mr-2"
                    >
                        Retry
                    </button>
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-gray-500">User not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-gray-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-8 relative">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 mb-4 relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="rounded-2xl object-cover shadow-sm w-full h-full"
                        />
                        {/* Status indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                            user.isBlocked ? 'bg-red-500' : user.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    {/* User ID */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">User ID</p>
                        <p className="text-base font-medium text-gray-700">{user.displayId}</p>
                    </div>

                    {/* Email */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Email address</p>
                        <p className="text-base font-medium text-gray-700 break-words text-xs">{user.email}</p>
                    </div>

                    {/* User Type */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">User Type</p>
                        <p className="text-base font-medium text-gray-700">{user.userType}</p>
                    </div>

                    {/* Joined Date */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Joined Date</p>
                        <p className="text-base font-medium text-gray-700">{user.joinedDate}</p>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                        <p className="text-base font-medium text-gray-700">{user.phone}</p>
                    </div>
                    
                    {/* Last Login */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Last Login</p>
                        <p className="text-base font-medium text-gray-700">{user.lastLogin}</p>
                    </div>

                    {/* Account Status */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Account Status</p>
                        <div className="flex gap-1">
                            {user.isBlocked && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                    Blocked
                                </span>
                            )}
                            {user.isActive ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                    Active
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    Inactive
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Ongoing Events - Only for Event Admin */}
                    {user.ongoingEvents !== null && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Ongoing Events</p>
                            <p className="text-base font-medium text-gray-700">{user.ongoingEvents}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Ban/Unban Button */}
                    <button 
                        onClick={handleBanUser}
                        className={`w-full font-semibold py-3 rounded-lg transition-all text-sm hover:scale-[1.02] active:scale-[0.98] ${
                            user.isBlocked
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 hover:shadow-md'
                                : 'bg-[#FFE5E5] text-[#FF4D4D] hover:bg-[#ffcccc] hover:shadow-md'
                        }`}
                    >
                        {user.isBlocked ? '✅ Unblock User' : '🚫 Block User'}
                    </button>

                    {/* Back Button */}
                    <button 
                        onClick={handleClose}
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all text-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        ← Back to List
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserDetailsPage;