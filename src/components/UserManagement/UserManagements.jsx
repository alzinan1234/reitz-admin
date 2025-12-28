// ============================================
// FILE 1: app/admin/user-management/page.jsx
// UserManagement Component with Toast
// ============================================

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import getAllUsers, { blockUser, transformUsersForTable } from '../lib/userApiClient';


const UserManagement = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 7;

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(filters);
      
      if (response) {
        const transformedUsers = transformUsersForTable(response.users || []);
        setCurrentUsers(transformedUsers);
        setTotalCount(response.count || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      toast.error(err.message || "Failed to fetch users");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search handler with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        fetchUsers({ search: searchTerm });
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    return currentUsers;
  }, [currentUsers]);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsersDisplayed = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const handleViewUser = (userId) => {
    router.push(`/admin/user-management/${userId}`);
  };

  const handleBlockUser = async (user) => {
    toast.loading(`Blocking ${user.name}...`, { id: 'block-user' });
    
    try {
      await blockUser(user.email);
      await fetchUsers();
      toast.success(`${user.name} blocked successfully!`, { id: 'block-user' });
    } catch (err) {
      toast.error(err.message || 'Failed to block user', { id: 'block-user' });
    }
  };

  // Helper for User Type Badge
  const getTypeBadge = (type, rawRole) => {
    const roleColors = {
      'Event Admin': 'bg-cyan-50 text-cyan-500',
      'Shop Admin': 'bg-purple-50 text-purple-500',
      'Shopper': 'bg-green-50 text-green-600',
      'Super Admin': 'bg-red-50 text-red-500',
      'User': 'bg-blue-50 text-blue-600',
    };

    const dotColors = {
      'Event Admin': 'bg-cyan-400',
      'Shop Admin': 'bg-purple-400',
      'Shopper': 'bg-green-500',
      'Super Admin': 'bg-red-400',
      'User': 'bg-blue-400',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleColors[type] || 'bg-gray-50 text-gray-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[type] || 'bg-gray-400'}`}></span>
        {type}
      </span>
    );
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 4;
    
    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
      pageNumbers.push(i);
    }
    
    if (totalPages > maxVisible + 1) {
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, index) => (
      <button
        key={index}
        onClick={() => typeof num === 'number' && handlePageChange(num)}
        disabled={num === '...'}
        className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
          currentPage === num 
            ? 'bg-[#4A6072] text-white' 
            : num === '...' 
            ? 'text-gray-400 cursor-default'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {num}
      </button>
    ));
  };

  // Loading state
  if (loading && currentUsers.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A6072]"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && currentUsers.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-[#4A6072] text-white rounded hover:bg-[#3d5060]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">Total Users: {totalCount}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rounded" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4A6072] text-white text-xs uppercase tracking-wider text-left">
              <th className="py-3 px-6 font-medium text-center">User ID</th>
              <th className="py-3 px-6 font-medium">Name</th>
              <th className="py-3 px-6 font-medium">Email</th>
              <th className="py-3 px-6 font-medium text-center">Registration Date</th>
              <th className="py-3 px-6 font-medium text-center">User Type</th>
              <th className="py-3 px-6 font-medium text-center">Status</th>
              <th className="py-3 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsersDisplayed.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsersDisplayed.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 text-sm text-gray-700">
                  <td className="py-4 px-6 text-center font-mono">#{user.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt="" 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6 text-center">{user.registrationDate}</td>
                  <td className="py-4 px-6 text-center">
                    {getTypeBadge(user.userType, user.rawRole)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {user.isBlocked ? (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        Blocked
                      </span>
                    ) : user.status === 'active' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Block/Delete Icon */}
                      <button 
                        onClick={() => handleBlockUser(user)}
                        disabled={user.isBlocked}
                        className={`group flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                          user.isBlocked 
                            ? 'border-gray-300 opacity-50 cursor-not-allowed'
                            : 'border-red-400 hover:bg-red-50'
                        }`}
                        title={user.isBlocked ? "User is blocked" : "Block user"}
                      >
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 13L13 1M1 1L13 13" stroke={user.isBlocked ? "#9CA3AF" : "#F87171"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {/* View Icon */}
                      <button 
                        onClick={() => handleViewUser(user.id)}
                        className="group flex items-center justify-center w-8 h-8 rounded-full border border-purple-400 hover:bg-purple-50 transition-colors"
                        title="View details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-8 gap-2">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;