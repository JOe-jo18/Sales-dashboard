"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

// Icons
import { GrOverview } from "react-icons/gr";
import { FaDollarSign } from "react-icons/fa";
import { BsGraphUpArrow, BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { MdOutlineMenu, MdOutlineInventory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IconType } from "react-icons"; // Added for typing

// --- Types ---
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

// --- Mock Data ---
const monthlyData = [
  { month: "Jan", sales: 4200, rate: 4.2 },
  { month: "Feb", sales: 3800, rate: 3.8 },
  { month: "Mar", sales: 5100, rate: 5.1 },
  { month: "Apr", sales: 4600, rate: 4.5 },
  { month: "May", sales: 5900, rate: 5.8 },
  { month: "Jun", sales: 6300, rate: 6.2 },
];

const navItems: NavItem[] = [
  { href: "/", icon: GrOverview, label: "Overview" },
  { href: "/sales", icon: BsGraphUpArrow, label: "Sales" },
  { href: "/revenue", icon: FaDollarSign, label: "Revenue" },
  { href: "/orders", icon: MdOutlineMenu, label: "Orders" },
  { href: "/inventory", icon: MdOutlineInventory, label: "Inventory" },
];

export default function SalesPage() {
  const [mounted, setMounted] = useState(false);

  // Prevents Recharts from rendering on the server (Fixes width -1 error)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Sales Analytics</h1>
            <p className="text-slate-500 font-medium">Monthly performance overview</p>
          </header>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricCard 
              title="Total Sales" 
              value="$29,900" 
              change="+12.5%" 
              isPositive={true}
              icon={<FaDollarSign className="text-blue-600" />}
            />
            <MetricCard 
              title="Avg. Sales Rate" 
              value="4.93%" 
              change="+0.4%" 
              isPositive={true}
              icon={<BsGraphUpArrow className="text-indigo-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Histogram (Bar Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-700">Monthly Sales Volume</h3>
              <div className="h-64 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      />
                      <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Sales Rate Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-700">Sales Rate Trend</h3>
              <div className="h-64 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%" debounce={100}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#8b5cf6' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, change, isPositive, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">{value}</h2>
        <div className={`flex items-center mt-2 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <BsArrowUpRight className="mr-1" /> : <BsArrowDownRight className="mr-1" />}
          <span>{change}</span>
          <span className="text-slate-400 ml-2 font-normal">vs last month</span>
        </div>
      </div>
      <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`flex flex-col bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 h-20 border-b border-slate-800">
        {!collapsed && <span className="text-white font-bold tracking-tight">CORE CRM</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 hover:bg-slate-800 rounded-md transition-colors mx-auto"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 px-3 mt-6 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <Icon className="text-xl shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all"
        >
          <IoMdSettings className="text-xl shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}