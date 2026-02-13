import { Outlet, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { FilterDrawer } from './FilterDrawer';

export function Root() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const location = useLocation();
  const isGenieAI = location.pathname.includes('genie-ai');

  // Close filter drawer when navigating to Genie AI
  useEffect(() => {
    if (isGenieAI) {
      setFilterDrawerOpen(false);
    }
  }, [isGenieAI]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0B1220] text-[#E6EDF7]' : 'bg-white text-gray-900'}`}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar theme={theme} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar 
            theme={theme}
            onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            onFilterToggle={() => setFilterDrawerOpen(!filterDrawerOpen)}
            filterDrawerOpen={filterDrawerOpen}
          />
          
          <div className="flex flex-1 overflow-hidden relative">
            {!isGenieAI && (
              <FilterDrawer 
                isOpen={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                theme={theme}
              />
            )}
            
            <main className={`flex-1 overflow-auto ${theme === 'dark' ? 'bg-[#0B1220]' : 'bg-gray-50'} transition-all ${!isGenieAI && filterDrawerOpen ? 'ml-80' : ''}`}>
              <div className="pb-12">
                <Outlet context={{ theme }} />
              </div>
              
              {/* Compliance Footer */}
              <div className={`fixed bottom-0 right-0 left-48 px-6 py-2 text-xs text-center border-t ${
                theme === 'dark' 
                  ? 'bg-[#0B1220] border-[#24324A] text-[#7F90AA]' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              } ${!isGenieAI && filterDrawerOpen ? 'ml-80' : ''} transition-all`}>
                Patient-identifiable data is not displayed in dashboards. All data shown is aggregated or de-identified for compliance.
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}