import { NavLink } from 'react-router';
import { Building2, UserRound, BarChart3, Sparkles, LineChart } from 'lucide-react';

interface SidebarProps {
  theme: 'light' | 'dark';
}

export function Sidebar({ theme }: SidebarProps) {
  const navItems = [
    { path: '/genie-ai', label: 'Genie AI', icon: Sparkles },
    { path: '/management', label: 'Management', icon: BarChart3 },
    { path: '/practice', label: 'Practice', icon: Building2 },
    { path: '/practitioner', label: 'Practitioner', icon: UserRound },
    // { path: '/chart-builder', label: 'Chart Builder', icon: LineChart },
  ];

  return (
    <aside className={`w-48 border-r flex-shrink-0 ${
      theme === 'dark' 
        ? 'bg-[#111A2E] border-[#24324A]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
        <h1 className="text-xl font-bold">
          <span className="text-[#ff7800]">my</span>
          <span className="text-[#fe4110]">dashboard</span>
        </h1>
      </div>
      
      <nav className="p-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-[rgba(255,122,0,0.18)] text-[#FF7A00] font-medium'
                    : 'bg-[#ff7800] text-white font-medium'
                  : theme === 'dark'
                  ? 'text-[#A9B6CC] hover:bg-[rgba(255,122,0,0.10)]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}