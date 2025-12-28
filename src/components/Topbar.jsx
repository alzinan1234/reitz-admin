'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userApiClient } from './lib/userProfileApiClient';


export default function Topbar() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApiClient.getProfile();
        if (res.success) setUserData(res.data); //
      } catch (err) { console.error(err); }
    };
    fetchUser();
    // রিয়েল টাইম আপডেটের জন্য ইভেন্ট লিসেনার (অপশনাল)
    window.addEventListener('profileUpdated', fetchUser);
    return () => window.removeEventListener('profileUpdated', fetchUser);
  }, []);

  return (
    <header className="flex items-center justify-end bg-white p-[17px] border-b border-[#D6D6D6]">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/admin/profile')}>
        <span className="font-semibold text-sm">{userData?.name || 'Admin'}</span>
        <div className="relative rounded-full overflow-hidden w-10 h-10 border border-gray-200">
          <Image 
            src={userData?.profile_picture || "/image/userImage.png"} 
            alt="User" 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        </div>
      </div>
    </header>
  );
}