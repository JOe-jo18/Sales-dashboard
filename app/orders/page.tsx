"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

// Icons
import { GrOverview } from "react-icons/gr";
import { FaDollarSign, FaBoxOpen } from "react-icons/fa";
import { BsGraphUpArrow, BsClockHistory } from "react-icons/bs";
import { MdOutlineMenu, MdOutlineInventory } from "react-icons/md";
import { IoMdSettings, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IconType } from "react-icons"; // Added for typing

// --- Types ---
interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

// --- Mock Data ---
const orderHistory = [
  { month: "Jan", orders: 120, rate: 3.2 },
  { month: "Feb", orders: 150, rate: 3.8 },
  { month: "Mar", orders: 180, rate: 4.1 },
  { month: "Apr", orders: 140, rate: 3.5 },
  { month: "May", orders: 210, rate: 4.8 },
  { month: "Jun", orders: 250, rate: 5.2 },
];

const recentOrders = [
  { id: "#ORD-7721", customer: "Alex Rivera", status: "Processing", amount: "$124.00" },
  { id: "#ORD-7722", customer: "Sarah Chen", status: "Shipped", amount: "$89.50" },
  { id: "#ORD-7723", customer: "Mike Ross", status: "Pending", amount: "$210.00" },
  { id: "#ORD-7724", customer: "Elena Gilbert", status: "Processing", amount: "$45.00" },
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

  // Fixes hydration/size errors for charts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
              Today: <span className="text-blue-600">24 New Orders</span>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricCard 
              title="Total Orders (Monthly)" 
              value="1,050" 
              description="+18% from last month"
              icon={<FaBoxOpen className="text-blue-600" />}
            />
            <MetricCard 
              title="Avg. Order Rate" 
              value="4.1%" 
              description="Conversion per visitor"
              icon={<BsGraphUpArrow className="text-emerald-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Volume Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-6">Order Volume over Time</h2>
                <div className="h-72 w-full"> {/* Container with explicit height */}
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                      <BarChart data={orderHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}} 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                        />
                        <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <BsClockHistory /> Recent Orders
                </h2>
                <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-slate-900">{order.id}</span>
                      <span className="text-sm font-semibold text-slate-700">{order.amount}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{order.customer}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                      order.status === "Shipped" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-sm font-medium text-slate-600 flex items-center justify-center gap-2 w-full">
                  <IoMdCheckmarkCircleOutline className="text-lg" /> Refresh Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6">
      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">{description}</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`flex flex-col bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 h-20 border-b border-slate-800">
        {!collapsed && <span className="text-white font-black text-xl tracking-tighter">OMS PRO</span>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 hover:bg-slate-800 rounded-lg mx-auto transition-colors"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
          >
            <Icon className="text-xl shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="font-medium text-sm">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="/settings" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800">
          <IoMdSettings className="text-xl shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}