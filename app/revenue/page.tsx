"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

// Icons
import { GrOverview } from "react-icons/gr";
import { FaDollarSign, FaRegCalendarAlt } from "react-icons/fa";
import { BsGraphUpArrow, BsArrowUpRight } from "react-icons/bs";
import { MdOutlineMenu, MdOutlineInventory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IconType } from "react-icons"; // Added for typing

// --- Types ---
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
}

interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

// --- Mock Data ---
const revenueData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 5900 },
  { month: "Jun", revenue: 7200 },
];

const navItems: NavItem[] = [
  { href: "/", icon: GrOverview, label: "Overview" },
  { href: "/sales", icon: BsGraphUpArrow, label: "Sales" },
  { href: "/revenue", icon: FaDollarSign, label: "Revenue" },
  { href: "/orders", icon: MdOutlineMenu, label: "Orders" },
  { href: "/inventory", icon: MdOutlineInventory, label: "Inventory" },
];

export default function RevenuePage() {
  const [mounted, setMounted] = useState(false);

  // Fixes the "width/height -1" error by ensuring client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Revenue Analytics</h1>
            <p className="text-slate-500">Real-time financial performance</p>
          </header>

          {/* Metric Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
              title="Total Revenue (YTD)" 
              value={`$${totalRevenue.toLocaleString()}`}
              change="+14.2%" 
              icon={<FaDollarSign className="text-emerald-600" />}
            />
            <MetricCard 
              title="Avg. Monthly Revenue" 
              value={`$${(totalRevenue / 6).toFixed(0)}`}
              change="+5.4%" 
              icon={<FaRegCalendarAlt className="text-blue-600" />}
            />
            <MetricCard 
              title="Peak Revenue" 
              value="$7,200"
              change="June" 
              icon={<BsGraphUpArrow className="text-purple-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Area Chart */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">Revenue Flow</h2>
              <div className="h-72 w-full"> {/* Ensure width is available */}
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* Monthly Histogram (Bar Chart) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">Monthly Comparison</h2>
              <div className="h-72 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%" debounce={100}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
        <div className="flex items-center text-emerald-600 text-sm font-semibold mt-2">
          <BsArrowUpRight className="mr-1" />
          <span>{change}</span>
          <span className="text-slate-400 font-normal ml-2 text-xs">vs last period</span>
        </div>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg text-xl">
        {icon}
      </div>
    </div>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`flex flex-col bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 ease-out ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-20">
        {!collapsed && <span className="text-lg font-bold text-white tracking-tight">FINANCE</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 mx-auto"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 mt-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 text-white transition-colors"
          >
            <Icon className="text-xl shrink-0" />
            {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <IoMdSettings className="text-xl shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}