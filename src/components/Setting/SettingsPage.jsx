'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { settingApiClient } from '../lib/settingApiClient';


const JoditEditor = dynamic(() => import('jodit-react'), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg" />
});

const SettingsPage = ({ onBackClick }) => {
  const editor = useRef(null);
  const tabs = [
    { id: 'privacy_policy', label: 'Privacy Policy' },
    { id: 'terms_conditions', label: 'Terms & Conditions' },
    { id: 'about_us', label: 'About Us' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [editableContent, setEditableContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabContents, setTabContents] = useState({});

  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing content...',
    height: 500,
    toolbarAdaptive: false,
    useSearch: false,
    spellcheck: false,
  }), []);

  // ডাটা লোড করার মেইন ফাংশন
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await settingApiClient.getAllSettings();

      if (Array.isArray(response)) {
        const mappedData = {};
        response.forEach(item => {
          mappedData[item.setting_type] = {
            content: item.content,
            last_updated: item.last_updated
          };
        });
        setTabContents(mappedData);

        setEditableContent(mappedData[activeTab]?.content || '');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);


  useEffect(() => {
    if (tabContents[activeTab]) {
      setEditableContent(tabContents[activeTab].content || '');
    }
  }, [activeTab, tabContents]);

  const handleSave = async () => {
    if (!editableContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const response = await settingApiClient.updateSetting(activeTab, editableContent);
     
      if (response && response.id) {
        setTabContents(prev => ({
          ...prev,
          [activeTab]: {
            content: response.content,
            last_updated: response.last_updated
          }
        }));
        toast.success(`${tabs.find(t => t.id === activeTab).label} Updated Successfully!`);
      }
    } catch (error) {
      toast.error("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#557F9E]"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl min-h-screen p-6 font-inter text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBackClick} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Legal Settings</h1>
        </div>
        <button onClick={fetchAllData} className="text-sm px-4 py-2 bg-gray-50 rounded-md">
          Refresh Data
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-[#557F9E] text-[#557F9E]' : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">{tabs.find(t => t.id === activeTab).label}</h2>
        <p className="text-xs text-gray-500">
          Last Updated: {tabContents[activeTab]?.last_updated 
            ? new Date(tabContents[activeTab].last_updated).toLocaleString() 
            : 'Never'}
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <JoditEditor
          ref={editor}
          value={editableContent}
          config={joditConfig}
          onBlur={newContent => setEditableContent(newContent)}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[140px] px-8 py-3 bg-[#557F9E] text-white rounded-lg disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;