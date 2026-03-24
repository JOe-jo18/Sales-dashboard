"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from "recharts";

// Icons
import { GrOverview } from "react-icons/gr";
import { FaDollarSign } from "react-icons/fa";
import { BsGraphUpArrow, BsCartCheck } from "react-icons/bs";
import { MdOutlineMenu, MdOutlineInventory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IconType } from "react-icons"; // Added for typing

// --- Types ---
interface StatCardProps {
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
const salesData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 5000, orders: 300 },
  { name: "Apr", sales: 2780, orders: 190 },
  { name: "May", sales: 1890, orders: 150 },
  { name: "Jun", sales: 2390, orders: 210 },
  { name: "Jul", sales: 3490, orders: 250 },
];

const navItems: NavItem[] = [
  { href: "/", icon: GrOverview, label: "Overview" },
  { href: "/sales", icon: BsGraphUpArrow, label: "Sales" },
  { href: "/revenue", icon: FaDollarSign, label: "Revenue" },
  { href: "/orders", icon: MdOutlineMenu, label: "Orders" },
  { href: "/inventory", icon: MdOutlineInventory, label: "Inventory" },
];

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);

  // Guard against hydration mismatch for charts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500">Here's what's happening today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value="$45,231.89" 
            change="+20.1%" 
            icon={<FaDollarSign className="text-emerald-500 text-xl" />} 
          />
          <StatCard 
            title="Total Orders" 
            value="1,205" 
            change="+12.2%" 
            icon={<BsCartCheck className="text-blue-500 text-xl" />} 
          />
          <StatCard 
            title="Order Rate" 
            value="4.35%" 
            change="-1.4%" 
            icon={<BsGraphUpArrow className="text-purple-500 text-xl" />} 
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-6 text-slate-800">Sales Analytics</h2>
          <div className="h-[350px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change} <span className="text-slate-400 font-normal ml-1">from last month</span>
        </p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`flex flex-col bg-slate-900 text-white h-screen sticky top-0 transition-all duration-300 ease-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-20">
        {!collapsed && <span className="text-xl font-bold tracking-tight">DASHBOARD</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 mx-auto transition-colors"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-all"
          >
            <Icon className="text-xl shrink-0" />
            {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/settings"
          className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-all"
        >
          <IoMdSettings className="text-xl shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}