"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

// Icons
import { GrOverview } from "react-icons/gr";
import { FaDollarSign } from "react-icons/fa";
import { BsGraphUpArrow, BsExclamationTriangle } from "react-icons/bs";
import { MdOutlineMenu, MdOutlineInventory, MdOutlineCategory } from "react-icons/md";
import { IoMdSettings, IoMdAdd } from "react-icons/io";
import { IconType } from "react-icons";

// --- Types ---
interface MetricCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: React.ReactNode;
  isAlert?: boolean;
}

interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

// --- Mock Data ---
const initialInventory = [
  { category: "Electronics", stock: 120, color: "#6366f1" },
  { category: "Furniture", stock: 45, color: "#8b5cf6" },
  { category: "Apparel", stock: 210, color: "#ec4899" },
  { category: "Kitchen", stock: 85, color: "#f59e0b" },
];

const stockDistribution = [
  { range: "0-10", count: 5 },
  { range: "11-50", count: 12 },
  { range: "51-100", count: 8 },
  { range: "101+", count: 15 },
];

const lowStockItems = [
  { id: "SKU-001", name: "Ergonomic Chair", stock: 3, unit: "pcs" },
  { id: "SKU-042", name: "USB-C Cable", stock: 8, unit: "pcs" },
  { id: "SKU-099", name: "Desk Lamp", stock: 2, unit: "pcs" },
];

const navItems: NavItem[] = [
  { href: "/", icon: GrOverview, label: "Overview" },
  { href: "/sales", icon: BsGraphUpArrow, label: "Sales" },
  { href: "/revenue", icon: FaDollarSign, label: "Revenue" },
  { href: "/orders", icon: MdOutlineMenu, label: "Orders" },
  { href: "/inventory", icon: MdOutlineInventory, label: "Inventory" },
];

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false);
  
  // Fixes the "width/height -1" hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalStock = initialInventory.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-slate-500 font-medium">Monitor stock levels and warehouse distribution.</p>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Total Inventory" value={totalStock.toLocaleString()} label="Total Units" icon={<MdOutlineInventory className="text-blue-600" />} />
            <MetricCard title="Categories" value={initialInventory.length} label="Active Segments" icon={<MdOutlineCategory className="text-purple-600" />} />
            <MetricCard title="Low Stock Alerts" value={lowStockItems.length} label="Requires Attention" icon={<BsExclamationTriangle className="text-rose-600" />} isAlert />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-6">Stock Distribution</h2>
              <div className="h-64 w-full"> {/* Ensure defined height */}
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-6">Inventory by Category</h2>
              <div className="h-64 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%" debounce={100}>
                    <PieChart>
                      <Pie data={initialInventory} dataKey="stock" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {initialInventory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>

          {/* New Inline Form Section */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <IoMdAdd className="text-2xl text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
                <p className="text-sm text-slate-500">Quickly add a new item to the warehouse stock.</p>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                <input type="text" placeholder="e.g. Wireless Mouse" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKU Number</label>
                <input type="text" placeholder="SKU-XXXX" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Stock</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all active:scale-[0.98]">
                Create Item
              </button>
            </form>
          </section>

          {/* Low Stock List */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800">Critical Low Stock Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">SKU</th>
                    <th className="px-6 py-3 font-semibold">Product Name</th>
                    <th className="px-6 py-3 font-semibold">Stock Level</th>
                    <th className="px-6 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded">
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Restock</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, label, icon, isAlert }: MetricCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-6 ${isAlert ? 'border-rose-200' : 'border-slate-200'}`}>
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${isAlert ? 'bg-rose-50' : 'bg-slate-50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-tighter">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <aside className={`flex flex-col bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 h-20 border-b border-slate-800">
        {!collapsed && <span className="text-white font-bold text-lg tracking-tight">INV SYSTEM</span>}
        <button onClick={() => setCollapsed((prev) => !prev)} className="p-2 hover:bg-slate-800 rounded-lg mx-auto transition-colors">
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Icon className="text-xl shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="font-medium text-sm">{label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link href="/settings" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors">
          <IoMdSettings className="text-xl shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}