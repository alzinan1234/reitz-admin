'use client';

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock Data matching the screenshot style
const initialUsers = new Array(35).fill(null).map((_, i) => ({
  id: i < 2 ? "1234" : `123${i + 4}`,
  name: i < 2 ? "Mason Brooks" : `User ${i + 1}`,
  email: "@gmail.com",
  // Alternating types to show both badges
  userType: i % 2 === 0 ? 'Event Admin' : 'User', 
  registrationDate: "March 15, 2024",
  avatar: i % 2 === 0 ? 'https://placehold.co/40x40/333/fff?text=M' : 'https://placehold.co/40x40/555/fff?text=U',
  status: 'active',
}));

const UserManagement = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Matches the screenshot density roughly

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return currentUsers;
    return currentUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
    );
  }, [searchTerm, currentUsers]);

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

  const handleDelete = (userId) => {
    // Simulate delete
    setCurrentUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Helper for User Type Badge
  const getTypeBadge = (type) => {
    if (type === 'Event Admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-500">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Event Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        User
      </span>
    );
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Simplified logic for demo
    for (let i = 1; i <= Math.min(4, totalPages); i++) pageNumbers.push(i);
    if(totalPages > 5) pageNumbers.push('...');
    if(totalPages > 4) pageNumbers.push(30); // Hardcoded 30 to match screenshot example

    return pageNumbers.map((num, index) => (
      <button
        key={index}
        onClick={() => typeof num === 'number' && handlePageChange(num)}
        className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
          currentPage === num 
            ? 'bg-[#4A6072] text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {num}
      </button>
    ));
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rounded" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter Button Icon */}
          {/* <button className="p-2 bg-[#4A6072] rounded text-white hover:bg-[#3d5060]">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </button> */}
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
              <th className="py-3 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsersDisplayed.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 text-sm text-gray-700">
                <td className="py-4 px-6 text-center">{user.id}</td>
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
                  {getTypeBadge(user.userType)}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {/* Delete Icon (Red Circle Cross) */}
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="group flex items-center justify-center w-8 h-8 rounded-full border border-red-400 hover:bg-red-50 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13L13 1M1 1L13 13" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* View Icon (Purple Circle Eye) */}
                    <button 
                      onClick={() => handleViewUser(user.id)}
                      className="group flex items-center justify-center w-8 h-8 rounded-full border border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-8 gap-2">
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {renderPageNumbers()}
        <button 
           className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
           onClick={() => handlePageChange(currentPage + 1)}
           disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default UserManagement;