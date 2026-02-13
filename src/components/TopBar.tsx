import { useState } from 'react';
import { useLocation } from 'react-router';
import { SlidersHorizontal, Sun, Moon, ChevronDown } from 'lucide-react';

interface TopBarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onFilterToggle: () => void;
  filterDrawerOpen: boolean;
}

export function TopBar({ theme, onThemeToggle, onFilterToggle, filterDrawerOpen }: TopBarProps) {
  const location = useLocation();
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [dateRange, setDateRange] = useState({ from: 'Jun 2025', to: 'Feb 2026' });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const activeFiltersCount = 3; // Mock count
  const showLocationFilter = !location.pathname.includes('practitioner');
  const isGenieAI = location.pathname.includes('genie-ai');

  return (
    <header className={`border-b flex-shrink-0 ${
      theme === 'dark' 
        ? 'bg-[#111A2E] border-[#24324A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-6 py-3">
        {!isGenieAI ? (
          <div className="flex items-center gap-4">
            <button
              onClick={onFilterToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                filterDrawerOpen
                  ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                  : theme === 'dark'
                  ? 'border-[#24324A] text-[#A9B6CC] hover:bg-[rgba(255,122,0,0.10)]'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#FF7A00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {showLocationFilter && (
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`appearance-none px-3 py-1.5 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00] ${
                    theme === 'dark'
                      ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  <option>All Locations</option>
                  <option>Burwood Plaza</option>
                  <option>Benova Village</option>
                  <option>Blacktown Westpoint</option>
                  <option>Castle Towers</option>
                  <option>North Eltham</option>
                </select>
                <ChevronDown className={`w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                placeholder="From month"
                className={`px-3 py-1.5 rounded-lg border text-sm w-28 ${
                  theme === 'dark'
                    ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>to</span>
              <input
                type="text"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                placeholder="To month"
                className={`px-3 py-1.5 rounded-lg border text-sm w-28 ${
                  theme === 'dark'
                    ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7]'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              />
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>AEST</span>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-[#A9B6CC] hover:bg-[rgba(255,122,0,0.10)]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-[#A9B6CC] hover:bg-[rgba(255,122,0,0.10)]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FF7A00] flex items-center justify-center text-white font-medium text-sm">
                AM
              </div>
              <span className="text-sm font-medium">Dr. A. Mitchell</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {userMenuOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                theme === 'dark'
                  ? 'bg-[#16223A] border-[#24324A]'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`p-3 border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
                  <div className="text-sm font-medium">Dr. Alex Mitchell</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>Role: Management</div>
                </div>
                <div className="p-2">
                  <button className={`w-full text-left px-3 py-2 text-sm rounded ${
                    theme === 'dark' ? 'hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]' : 'hover:bg-gray-100'
                  }`}>
                    Profile Settings
                  </button>
                  <button className={`w-full text-left px-3 py-2 text-sm rounded ${
                    theme === 'dark' ? 'hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]' : 'hover:bg-gray-100'
                  }`}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}