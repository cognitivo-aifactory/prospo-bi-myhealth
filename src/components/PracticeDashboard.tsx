import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ExternalLink, Search, ChevronRight } from 'lucide-react';

const revenueData = [
  { month: 'Jun', revenue: 265000, cost: 115000, expenses: 82000 },
  { month: 'Jul', revenue: 275000, cost: 118000, expenses: 84000 },
  { month: 'Aug', revenue: 285000, cost: 120000, expenses: 85000 },
  { month: 'Sep', revenue: 298000, cost: 125000, expenses: 88000 },
  { month: 'Oct', revenue: 312000, cost: 128000, expenses: 90000 },
  { month: 'Nov', revenue: 295000, cost: 122000, expenses: 87000 },
  { month: 'Dec', revenue: 335000, cost: 135000, expenses: 95000 },
  { month: 'Jan', revenue: 342000, cost: 138000, expenses: 92000 },
  { month: 'Feb', revenue: 358000, cost: 142000, expenses: 94000 },
];

const appointmentsData = [
  { month: 'Jun', booked: 1180, actual: 1098 },
  { month: 'Jul', booked: 1210, actual: 1132 },
  { month: 'Aug', booked: 1240, actual: 1156 },
  { month: 'Sep', booked: 1285, actual: 1198 },
  { month: 'Oct', booked: 1310, actual: 1228 },
  { month: 'Nov', booked: 1255, actual: 1175 },
  { month: 'Dec', booked: 1405, actual: 1298 },
  { month: 'Jan', booked: 1425, actual: 1342 },
  { month: 'Feb', booked: 1468, actual: 1385 },
];

const hoursData = [
  { month: 'Jun', rostered: 2750, worked: 2668 },
  { month: 'Jul', rostered: 2800, worked: 2715 },
  { month: 'Aug', rostered: 2850, worked: 2756 },
  { month: 'Sep', rostered: 2900, worked: 2812 },
  { month: 'Oct', rostered: 2950, worked: 2875 },
  { month: 'Nov', rostered: 2880, worked: 2798 },
  { month: 'Dec', rostered: 3100, worked: 2985 },
  { month: 'Jan', rostered: 3150, worked: 3042 },
  { month: 'Feb', rostered: 3180, worked: 3095 },
];

const appointmentDetails = [
  { date: '05/02/2026', time: '09:00', practitioner: 'Dr. Sarah Chen', type: 'Consultation', status: 'Completed', location: 'Burwood Plaza', payer: 'Medicare' },
  { date: '05/02/2026', time: '09:30', practitioner: 'Dr. James Wilson', type: 'Follow-up', status: 'Completed', location: 'Benova Village', payer: 'Private' },
  { date: '05/02/2026', time: '10:00', practitioner: 'Dr. Maria Rodriguez', type: 'Check-up', status: 'No-show', location: 'Blacktown Westpoint', payer: 'Insurance' },
  { date: '05/02/2026', time: '10:30', practitioner: 'Dr. Sarah Chen', type: 'Consultation', status: 'Completed', location: 'Castle Towers', payer: 'Medicare' },
  { date: '06/02/2026', time: '14:00', practitioner: 'Dr. James Wilson', type: 'Specialist', status: 'Completed', location: 'North Eltham', payer: 'Private' },
];

export function PracticeDashboard() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState('All Types');
  const [practitioner, setPractitioner] = useState('All Practitioners');

  const kpis = [
    { label: 'Appointments Booked', value: '1,468', change: 3.0, trend: 'up' },
    { label: 'Appointments Actual', value: '1,385', change: 3.2, trend: 'up' },
    { label: 'Worked Hours', value: '3,095', change: 1.7, trend: 'up' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setSelectedKPI(selectedKPI === kpi.label ? null : kpi.label)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selectedKPI === kpi.label
                ? 'border-[#FF7A00] bg-[#FF7A00] bg-opacity-5 shadow-md'
                : theme === 'dark'
                ? 'border-[#24324A] bg-[#111A2E] hover:shadow-md'
                : 'border-gray-200 bg-white hover:shadow-md'
            }`}
          >
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>{kpi.label}</div>
            <div className="text-2xl font-bold mb-2">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {kpi.change}% MoM
            </div>
          </button>
        ))}
      </div>

      {/* Active Filter Chip */}
      {selectedKPI && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Focus:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF7A00] bg-opacity-10 text-[#FF7A00] text-sm rounded-lg font-medium">
            {selectedKPI}
            <button onClick={() => setSelectedKPI(null)} className="hover:bg-[#FF7A00] hover:bg-opacity-20 rounded">
              ×
            </button>
          </span>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-[#111A2E] border-[#24324A]' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue vs Cost vs Expenses (Monthly)</h3>
            <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} name="Cost" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Chart */}
        <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-[#111A2E] border-[#24324A]' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Appointments (Monthly)</h3>
            <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className={`text-xs ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Type:</label>
            <select 
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className={`text-xs px-2 py-1 rounded border ${
                theme === 'dark'
                  ? 'border-[#24324A] bg-[#16223A] text-[#E6EDF7]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <option>All Types</option>
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Check-up</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Line type="monotone" dataKey="booked" stroke="#10b981" strokeWidth={2} name="Booked" />
              <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hours Chart */}
      <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-[#111A2E] border-[#24324A]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Hours (Monthly)</h3>
          <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <label className={`text-xs ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Practitioner:</label>
          <select 
            value={practitioner}
            onChange={(e) => setPractitioner(e.target.value)}
            className={`text-xs px-2 py-1 rounded border ${
              theme === 'dark'
                ? 'border-[#24324A] bg-[#16223A] text-[#E6EDF7]'
                : 'border-gray-300 bg-white'
            }`}
          >
            <option>All Practitioners</option>
            <option>Dr. Sarah Chen</option>
            <option>Dr. James Wilson</option>
            <option>Dr. Maria Rodriguez</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={hoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Line type="monotone" dataKey="rostered" stroke="#8b5cf6" strokeWidth={2} name="Rostered" />
            <Line type="monotone" dataKey="worked" stroke="#ec4899" strokeWidth={2} name="Worked" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detail Table (shown when KPI selected) */}
      {selectedKPI && (
        <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-[#111A2E] border-[#24324A]' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{selectedKPI} — Details</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-9 pr-3 py-1.5 border rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'border-[#24324A] bg-[#16223A] text-[#E6EDF7] placeholder-[#7F90AA]'
                      : 'border-gray-300 bg-white'
                  }`}
                />
              </div>
              <button className="text-sm text-[#FF7A00] hover:underline flex items-center gap-1">
                Open in Explore
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Date</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Time</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Practitioner</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Type</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Status</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Location</th>
                  <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Payer</th>
                </tr>
              </thead>
              <tbody>
                {appointmentDetails.map((apt, idx) => (
                  <tr key={idx} className={`border-b ${
                    theme === 'dark'
                      ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)]'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className="py-2 px-3">{apt.date}</td>
                    <td className="py-2 px-3">{apt.time}</td>
                    <td className="py-2 px-3">{apt.practitioner}</td>
                    <td className="py-2 px-3">{apt.type}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'No-show' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">{apt.location}</td>
                    <td className="py-2 px-3">{apt.payer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className={`text-xs ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>Showing 1-5 of 1,468 records</div>
            <div className="flex items-center gap-2">
              <button className={`px-3 py-1 border rounded text-xs ${
                theme === 'dark'
                  ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>Previous</button>
              <button className="px-3 py-1 bg-[#FF7A00] text-white rounded text-xs font-medium">1</button>
              <button className={`px-3 py-1 border rounded text-xs ${
                theme === 'dark'
                  ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>2</button>
              <button className={`px-3 py-1 border rounded text-xs ${
                theme === 'dark'
                  ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>3</button>
              <button className={`px-3 py-1 border rounded text-xs ${
                theme === 'dark'
                  ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}