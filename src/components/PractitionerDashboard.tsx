import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ExternalLink, Clock } from 'lucide-react';

// De-identified monthly appointment data
const monthlyTrendData = [
  { month: 'Jun', booked: 1180, actual: 1098, noShow: 82 },
  { month: 'Jul', booked: 1210, actual: 1132, noShow: 78 },
  { month: 'Aug', booked: 1240, actual: 1156, noShow: 84 },
  { month: 'Sep', booked: 1285, actual: 1198, noShow: 87 },
  { month: 'Oct', booked: 1310, actual: 1228, noShow: 82 },
  { month: 'Nov', booked: 1255, actual: 1175, noShow: 80 },
  { month: 'Dec', booked: 1405, actual: 1298, noShow: 107 },
  { month: 'Jan', booked: 1425, actual: 1342, noShow: 83 },
  { month: 'Feb', booked: 1468, actual: 1385, noShow: 83 },
];

// Appointment mix by type (aggregated)
const appointmentMixData = [
  { type: 'Consultation', count: 542 },
  { type: 'Follow-up', count: 385 },
  { type: 'Check-up', count: 298 },
  { type: 'Specialist', count: 160 },
];

// Visit volume by time of day (aggregated)
const timeOfDayData = [
  { timeSlot: '8-10 AM', visits: 285 },
  { timeSlot: '10-12 PM', visits: 342 },
  { timeSlot: '12-2 PM', visits: 198 },
  { timeSlot: '2-4 PM', visits: 325 },
  { timeSlot: '4-6 PM', visits: 235 },
];

// De-identified appointment records
const deidentifiedAppointments = [
  { date: '08/02/2026', time: '09:00', location: 'Burwood Plaza', practitioner: 'Dr. Sarah Chen', type: 'Consultation', status: 'Completed', duration: 25 },
  { date: '08/02/2026', time: '09:30', location: 'Burwood Plaza', practitioner: 'Dr. James Wilson', type: 'Follow-up', status: 'Completed', duration: 15 },
  { date: '08/02/2026', time: '10:00', location: 'Burwood Plaza', practitioner: 'Dr. Maria Rodriguez', type: 'Check-up', status: 'No-show', duration: 0 },
  { date: '08/02/2026', time: '10:30', location: 'Burwood Plaza', practitioner: 'Dr. Sarah Chen', type: 'Consultation', status: 'Completed', duration: 30 },
  { date: '08/02/2026', time: '11:00', location: 'Burwood Plaza', practitioner: 'Dr. James Wilson', type: 'Specialist', status: 'Completed', duration: 45 },
  { date: '08/02/2026', time: '14:00', location: 'Burwood Plaza', practitioner: 'Dr. Sarah Chen', type: 'Follow-up', status: 'Completed', duration: 20 },
  { date: '08/02/2026', time: '14:30', location: 'Burwood Plaza', practitioner: 'Dr. James Wilson', type: 'Consultation', status: 'Completed', duration: 28 },
  { date: '08/02/2026', time: '15:00', location: 'Burwood Plaza', practitioner: 'Dr. Maria Rodriguez', type: 'Check-up', status: 'Cancelled', duration: 0 },
  { date: '09/02/2026', time: '09:00', location: 'Burwood Plaza', practitioner: 'Dr. Sarah Chen', type: 'Consultation', status: 'Completed', duration: 22 },
  { date: '09/02/2026', time: '10:00', location: 'Burwood Plaza', practitioner: 'Dr. James Wilson', type: 'Follow-up', status: 'Completed', duration: 18 },
];

const COLORS = ['#FF7A00', '#3b82f6', '#10b981', '#8b5cf6'];

export function PractitionerDashboard() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [practitionerFilter, setPractitionerFilter] = useState('All Practitioners');

  const kpis = [
    { label: 'Total Appointments', value: '1,468', change: 3.0, trend: 'up' as const },
    { label: 'Actual Attended', value: '1,385', change: 3.2, trend: 'up' as const },
    { label: 'No-shows', value: '83', change: -5.7, trend: 'down' as const },
    { label: 'Avg Consultation Time', value: '24 min', change: 2.1, trend: 'up' as const },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#111A2E] border-[#24324A]'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>{kpi.label}</div>
            <div className="text-2xl font-bold mb-2">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(kpi.change)}% MoM
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trend Chart - Full Width */}
      <div className={`p-5 rounded-lg border ${
        theme === 'dark'
          ? 'bg-[#111A2E] border-[#24324A]'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Booked Appointments vs Actual Appointments (Monthly)</h3>
          <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Line type="monotone" dataKey="booked" stroke="#3b82f6" strokeWidth={2} name="Booked" />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Appointment Mix Chart */}
        <div className={`p-5 rounded-lg border ${
          theme === 'dark'
            ? 'bg-[#111A2E] border-[#24324A]'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Appointment Mix by Type</h3>
            <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={appointmentMixData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
              <XAxis dataKey="type" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
              <Bar dataKey="count" fill="#FF7A00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time of Day Chart */}
        <div className={`p-5 rounded-lg border ${
          theme === 'dark'
            ? 'bg-[#111A2E] border-[#24324A]'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Visit Volume by Time of Day</h3>
            <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={timeOfDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
              <XAxis dataKey="timeSlot" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
              <Bar dataKey="visits" fill="#FF7A00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* De-identified Appointment Table */}
      <div className={`p-5 rounded-lg border ${
        theme === 'dark'
          ? 'bg-[#111A2E] border-[#24324A]'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Appointments</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className={`text-xs ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Practitioner:</label>
              <select 
                value={practitionerFilter}
                onChange={(e) => setPractitionerFilter(e.target.value)}
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
                <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Location</th>
                <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Practitioner</th>
                <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Type</th>
                <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Status</th>
                <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Duration (min)
                </th>
              </tr>
            </thead>
            <tbody>
              {deidentifiedAppointments.map((apt, idx) => (
                <tr key={idx} className={`border-b ${
                  theme === 'dark'
                    ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)]'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <td className="py-2 px-3">{apt.date}</td>
                  <td className="py-2 px-3">{apt.time}</td>
                  <td className="py-2 px-3">{apt.location}</td>
                  <td className="py-2 px-3">{apt.practitioner}</td>
                  <td className="py-2 px-3">{apt.type}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      apt.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      apt.status === 'No-show' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">{apt.duration || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className={`text-xs ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>Showing 1-10 of 1,385 records</div>
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
    </div>
  );
}
