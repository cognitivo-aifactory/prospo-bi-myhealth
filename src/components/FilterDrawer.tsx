import { useLocation } from 'react-router';
import { X } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function FilterDrawer({ isOpen, onClose, theme }: FilterDrawerProps) {
  const location = useLocation();

  const getFiltersForPage = () => {
    if (location.pathname.includes('practice')) {
      return (
        <>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Dept/Role</label>
            <select className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}>
              <option>All Roles</option>
              <option>General Practitioner</option>
              <option>Specialist</option>
              <option>Nurse</option>
            </select>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Payer/Account Type</label>
            <select className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}>
              <option>All Types</option>
              <option>Private</option>
              <option>Medicare</option>
              <option>Insurance</option>
            </select>
          </div>
        </>
      );
    } else if (location.pathname.includes('practitioner')) {
      return (
        <>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Practitioner</label>
            <select className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}>
              <option>All Practitioners</option>
              <option>Dr. Sarah Chen</option>
              <option>Dr. James Wilson</option>
              <option>Dr. Maria Rodriguez</option>
            </select>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Appointment Type</label>
            <select className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}>
              <option>All Types</option>
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Check-up</option>
              <option>Specialist</option>
            </select>
          </div>
        </>
      );
    } else if (location.pathname.includes('management')) {
      return (
        <>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Company</label>
            <input
              type="text"
              placeholder="Search companies..."
              className={`w-full px-3 py-2 rounded-lg border mb-2 ${
                theme === 'dark'
                  ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7] placeholder-[#7F90AA]'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {['MyHealth Burwood Plaza', 'MyHealth Benova Village', 'MyHealth Blacktown Westpoint', 'MyHealth Castle Towers', 'MyHealth North Eltham'].map(company => (
                <label key={company} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>
                  <input type="checkbox" className="rounded" />
                  <span>{company}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Main Account</label>
            <input
              type="text"
              placeholder="Search accounts..."
              className={`w-full px-3 py-2 rounded-lg border mb-2 ${
                theme === 'dark'
                  ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7] placeholder-[#7F90AA]'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {['Revenue', 'Expenses', 'Assets', 'Liabilities'].map(account => (
                <label key={account} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>
                  <input type="checkbox" className="rounded" />
                  <span>{account}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>Cost Centre</label>
            <input
              type="text"
              placeholder="Search cost centres..."
              className={`w-full px-3 py-2 rounded-lg border mb-2 ${
                theme === 'dark'
                  ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7] placeholder-[#7F90AA]'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {['Clinical Services', 'Administration', 'Marketing', 'IT'].map(centre => (
                <label key={centre} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-[#A9B6CC]' : ''}`}>
                  <input type="checkbox" className="rounded" />
                  <span>{centre}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed left-48 top-0 bottom-0 w-80 shadow-xl z-50 border-r ${
      theme === 'dark'
        ? 'bg-[#111A2E] border-[#24324A]'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
          <h2 className="text-lg font-semibold">Native Filters</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[rgba(255,122,0,0.10)]' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
          <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>Active Filters</div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A00] rounded">
              <span className="text-white text-xs font-medium">Location: Burwood Plaza</span>
              <X className="w-3 h-3 cursor-pointer text-white" />
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A00] rounded">
              <span className="text-white text-xs font-medium">Date: Jun 2025-Feb 2026</span>
              <X className="w-3 h-3 cursor-pointer text-white" />
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A00] rounded">
              <span className="text-white text-xs font-medium">Account: Revenue</span>
              <X className="w-3 h-3 cursor-pointer text-white" />
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {getFiltersForPage()}
        </div>

        <div className={`p-4 border-t flex gap-2 ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
          <button className="flex-1 px-4 py-2 bg-[#FF7A00] text-white rounded-lg font-medium hover:bg-[#FF8F2B] transition-colors">
            Apply
          </button>
          <button className={`flex-1 px-4 py-2 rounded-lg font-medium border transition-colors ${
            theme === 'dark'
              ? 'border-[#24324A] text-[#A9B6CC] hover:bg-[rgba(255,122,0,0.10)]'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}