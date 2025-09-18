import { useEffect, useState } from 'react';
import type { Lead } from '../api';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

const statusOptions: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Converted', 'Disqualified'];

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const LeadDetailPanel = ({ lead, isOpen, onClose, onSave }: LeadDetailPanelProps) => {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setEditedLead(lead);
    setEmailError(null); // Reset error when lead changes
  }, [lead]);

  if (!isOpen || !editedLead) {
    return null;
  }

  const handleSave = () => {
    if (!validateEmail(editedLead.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    onSave(editedLead);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedLead(prev => prev ? { ...prev, [name]: value } : null);
    if (name === 'email') {
      setEmailError(null); // Clear error on change
    }
  };

  return (
    <div className={`fixed inset-0 z-10 overflow-hidden transition-opacity ${isOpen ? 'bg-gray-500 bg-opacity-75' : 'bg-opacity-0 pointer-events-none'}`}>
      <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col divide-y divide-gray-200 bg-white dark:bg-grey-1000 shadow-xl">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Lead Details</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button type="button" className="rounded-md bg-white dark:bg-grey-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={onClose}>
                      <span className="sr-only">Close panel</span>
                      &times;
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative mt-6 flex-1 px-4 sm:px-6">
                {/* Form Content */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                    <div className="mt-1">
                      <input type="email" name="email" id="email" value={editedLead.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:bg-grey-900 dark:border-grey-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <div className="mt-1">
                      <select id="status" name="status" value={editedLead.status} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:bg-grey-900 dark:border-grey-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        {statusOptions.map(option => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 justify-end px-4 py-4">
              <button type="button" className="rounded-md border border-gray-300 bg-white dark:bg-grey-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={onClose}>Cancel</button>
              <button type="button" className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
