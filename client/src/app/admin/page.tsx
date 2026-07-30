'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="animate-pulse bg-white h-96 rounded-lg border border-sand/50"></div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`Rs. ${stats.kpis.revenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" />
        <KPICard title="Total Orders" value={stats.kpis.orders} icon={ShoppingBag} trend="+5.2%" />
        <KPICard title="Total Customers" value={stats.kpis.customers} icon={Users} trend="+18.1%" />
        <KPICard title="Conversion Rate" value="3.2%" icon={TrendingUp} trend="-0.4%" isNegative />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 border border-sand/50 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-serif text-charcoal mb-6">Revenue Overview (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4E342E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4E342E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D7CCC8" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #D7CCC8', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4E342E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 border border-sand/50 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-serif text-charcoal mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {stats.topProducts.map((product: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#F5F5F3] flex items-center justify-center font-serif text-walnut-brown text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal line-clamp-1">{product._id}</p>
                    <p className="text-xs text-charcoal/50">{product.totalSold} units sold</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Rs. {(product.revenue / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Subcomponent for KPI Cards
function KPICard({ title, value, icon: Icon, trend, isNegative = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 border border-sand/50 rounded-xl shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-charcoal/60 mb-1">{title}</p>
          <h3 className="text-2xl font-serif text-charcoal">{value}</h3>
        </div>
        <div className="p-2 bg-sand/20 rounded-lg text-walnut-brown">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isNegative ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {trend}
        </span>
        <span className="text-xs text-charcoal/50 ml-2">vs last month</span>
      </div>
    </motion.div>
  );
}