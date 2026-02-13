import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ExternalLink, Search, ChevronRight, ChevronDown, Download, X } from 'lucide-react';
import React from 'react';

const revenueData = [
  { month: 'Jun', revenue: 265000, netProfit: 72000 },
  { month: 'Jul', revenue: 275000, netProfit: 73000 },
  { month: 'Aug', revenue: 285000, netProfit: 80000 },
  { month: 'Sep', revenue: 298000, netProfit: 85000 },
  { month: 'Oct', revenue: 312000, netProfit: 94000 },
  { month: 'Nov', revenue: 295000, netProfit: 86000 },
  { month: 'Dec', revenue: 335000, netProfit: 105000 },
  { month: 'Jan', revenue: 342000, netProfit: 112000 },
  { month: 'Feb', revenue: 358000, netProfit: 122000 },
];

const plData = [
  { 
    category: 'Revenue', 
    amount: 358000, 
    percentOfRevenue: 100, 
    isExpanded: true,
    children: [
      { name: 'Consultation Fees', amount: 245000, percentOfRevenue: 68.4 },
      { name: 'Specialist Services', amount: 85000, percentOfRevenue: 23.7 },
      { name: 'Diagnostic Services', amount: 28000, percentOfRevenue: 7.8 },
    ]
  },
  { 
    category: 'Expenses', 
    amount: 236000, 
    percentOfRevenue: 65.9, 
    isExpanded: true,
    children: [
      { name: 'Staff Salaries', amount: 142000, percentOfRevenue: 39.7 },
      { name: 'Medical Supplies', amount: 48000, percentOfRevenue: 13.4 },
      { name: 'Facility Costs', amount: 32000, percentOfRevenue: 8.9 },
      { name: 'Administrative', amount: 14000, percentOfRevenue: 3.9 },
    ]
  },
  { 
    category: 'Net Profit', 
    amount: 122000, 
    percentOfRevenue: 34.1, 
    isExpanded: false,
    children: []
  },
];

const ledgerData = [
  { date: '05/02/2026', company: 'MyHealth Burwood Plaza', account: 'Revenue', costCentre: 'Clinical Services', debit: 0, credit: 12500, description: 'Consultation fees - batch 045' },
  { date: '05/02/2026', company: 'MyHealth Benova Village', account: 'Expenses', costCentre: 'Administration', debit: 3200, credit: 0, description: 'Office supplies purchase' },
  { date: '04/02/2026', company: 'MyHealth Burwood Plaza', account: 'Revenue', costCentre: 'Specialist Services', debit: 0, credit: 8500, description: 'Specialist consultation fees' },
  { date: '04/02/2026', company: 'MyHealth Blacktown Westpoint', account: 'Expenses', costCentre: 'Clinical Services', debit: 15600, credit: 0, description: 'Medical supplies - monthly stock' },
  { date: '03/02/2026', company: 'MyHealth Castle Towers', account: 'Revenue', costCentre: 'Diagnostic Services', debit: 0, credit: 4200, description: 'Lab test fees' },
  { date: '03/02/2026', company: 'MyHealth Burwood Plaza', account: 'Expenses', costCentre: 'Marketing', debit: 2800, credit: 0, description: 'Digital advertising campaign' },
  { date: '02/02/2026', company: 'MyHealth Benova Village', account: 'Revenue', costCentre: 'Clinical Services', debit: 0, credit: 9800, description: 'Consultation fees - batch 044' },
  { date: '02/02/2026', company: 'MyHealth North Eltham', account: 'Expenses', costCentre: 'IT', debit: 5400, credit: 0, description: 'Software licenses renewal' },
];

export function ManagementDashboard() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['Revenue', 'Expenses']));
  const [ledgerSearch, setLedgerSearch] = useState('');

  const toggleRow = (category: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedRows(newExpanded);
  };

  const kpis = [
    { label: 'Revenue', value: '$358,000', change: 4.7, trend: 'up' },
    { label: 'Expenses', value: '$236,000', change: 2.2, trend: 'up' },
    { label: 'Net Profit', value: '$122,000', change: 8.9, trend: 'up' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Management Dashboard</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#FF7A00] text-white rounded-lg text-sm font-medium hover:bg-[#FF8F2B] transition-colors">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
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
              {kpi.change}% MoM
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Net Profit Chart */}
      <div className={`p-5 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#111A2E] border-[#24324A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Revenue & Net Profit (Monthly)</h3>
          <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2B3A57' : '#e5e7eb'} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#16223A' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#24324A' : '#e5e7eb'}`, color: theme === 'dark' ? '#E6EDF7' : '#111827' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#A9B6CC' : '#6b7280' }} />
            <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="netProfit" stroke="#2ED47A" strokeWidth={2} name="Net Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* P&L Hierarchical Table */}
      <div className={`p-5 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#111A2E] border-[#24324A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Profit & Loss Statement</h3>
          <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        <table className="w-full text-sm">
          <thead className={`border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
            <tr>
              <th className={`text-left py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Category</th>
              <th className={`text-right py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Amount</th>
              <th className={`text-right py-2 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>% of Revenue</th>
            </tr>
          </thead>
          <tbody>
            {plData.flatMap((item) => {
              const rows = [
                <tr 
                  key={item.category}
                  className={`border-b cursor-pointer ${
                    theme === 'dark'
                      ? `border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] ${item.category === 'Net Profit' ? 'font-bold bg-green-900 bg-opacity-20' : ''}`
                      : `border-gray-100 hover:bg-gray-50 ${item.category === 'Net Profit' ? 'font-bold bg-green-50' : ''}`
                  }`}
                  onClick={() => item.children.length > 0 && toggleRow(item.category)}
                >
                  <td className="py-2 px-3 flex items-center gap-2">
                    {item.children.length > 0 && (
                      expandedRows.has(item.category) 
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    )}
                    {item.category}
                  </td>
                  <td className="text-right py-2 px-3">${item.amount.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">{item.percentOfRevenue.toFixed(1)}%</td>
                </tr>
              ];
              
              if (expandedRows.has(item.category)) {
                item.children.forEach((child) => {
                  rows.push(
                    <tr 
                      key={`${item.category}-${child.name}`}
                      className={`border-b ${
                        theme === 'dark'
                          ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)] text-[#A9B6CC]'
                          : 'border-gray-100 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <td className="py-2 px-3 pl-10">{child.name}</td>
                      <td className="text-right py-2 px-3">${child.amount.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{child.percentOfRevenue.toFixed(1)}%</td>
                    </tr>
                  );
                });
              }
              
              return rows;
            })}
          </tbody>
        </table>
      </div>

      {/* Ledger Transactions Table */}
      <div className={`p-5 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#111A2E] border-[#24324A]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Ledger Transactions</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#FF7A00] text-white rounded-lg text-sm font-medium hover:bg-[#FF8F2B] transition-colors">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className={`hover:text-[#FF7A00] transition-colors ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} title="Open in Explore">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search voucher / description..."
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm ${
                theme === 'dark'
                  ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7] placeholder-[#7F90AA]'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A00] rounded">
              <span className="text-white text-xs font-medium">Revenue</span>
              <X className="w-3 h-3 cursor-pointer text-white" />
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A00] rounded">
              <span className="text-white text-xs font-medium">Clinical Services</span>
              <X className="w-3 h-3 cursor-pointer text-white" />
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={theme === 'dark' ? 'bg-[#0B1220]' : 'bg-gray-50'}>
              <tr className={`border-b ${theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Date</th>
                <th className={`text-left py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Company</th>
                <th className={`text-left py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Main Account</th>
                <th className={`text-left py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Cost Centre</th>
                <th className={`text-right py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Debit</th>
                <th className={`text-right py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Credit</th>
                <th className={`text-left py-3 px-3 font-medium ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>Description</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.map((ledger, idx) => (
                <tr key={idx} className={`border-b ${
                  theme === 'dark'
                    ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)]'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <td className="py-2 px-3">{ledger.date}</td>
                  <td className="py-2 px-3">{ledger.company}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      ledger.account === 'Revenue' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {ledger.account}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs">{ledger.costCentre}</td>
                  <td className="text-right py-2 px-3 font-medium">
                    {ledger.debit > 0 ? `$${ledger.debit.toLocaleString()}` : '—'}
                  </td>
                  <td className="text-right py-2 px-3 font-medium">
                    {ledger.credit > 0 ? `$${ledger.credit.toLocaleString()}` : '—'}
                  </td>
                  <td className={`py-2 px-3 text-xs ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>{ledger.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className={`text-xs ${theme === 'dark' ? 'text-[#7F90AA]' : 'text-gray-500'}`}>Showing 1-8 of 247 transactions</div>
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