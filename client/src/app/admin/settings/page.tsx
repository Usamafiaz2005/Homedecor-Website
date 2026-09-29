'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Save, Store, Truck, Shield, Bell } from 'lucide-react';
import { SHIPPING_POLICY } from '@/constants/pakistan';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [storeName, setStoreName] = useState('Homedecor Flagship');
  const [supportEmail, setSupportEmail] = useState('concierge@homedecor.pk');
  const [supportPhone, setSupportPhone] = useState('+92 (42) 111-466333');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(SHIPPING_POLICY.FREE_SHIPPING_THRESHOLD_PKR);
  const [lahoreRate, setLahoreRate] = useState(SHIPPING_POLICY.LOCAL_LAHORE_RATE_PKR);
  const [majorRate, setMajorRate] = useState(SHIPPING_POLICY.MAJOR_CITIES_RATE_PKR);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Store parameters successfully synchronized.');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif text-charcoal">System Settings</h1>
        <p className="text-xs text-charcoal/60 mt-1">Configure storefront operational rules, logistics thresholds, and contact concierges.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Store Profile */}
        <div className="bg-white p-6 border border-sand/40 rounded-xl space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-sand/30 pb-4">
            <Store className="w-5 h-5 text-walnut-brown" />
            <h2 className="font-serif text-base text-charcoal">Store Identity</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Store Name</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Concierge Email</label>
              <input 
                type="email" 
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Support Helpline</label>
              <input 
                type="text" 
                value={supportPhone} 
                onChange={(e) => setSupportPhone(e.target.value)} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Authenticated Operator</label>
              <input 
                type="text" 
                disabled 
                value={`${user?.name || 'Administrator'} (${user?.email || 'admin@homedecor.pk'})`} 
                className="w-full bg-sand/10 border border-sand/30 p-2.5 text-xs rounded-md text-charcoal/60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-white p-6 border border-sand/40 rounded-xl space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-sand/30 pb-4">
            <Truck className="w-5 h-5 text-walnut-brown" />
            <h2 className="font-serif text-base text-charcoal">Pakistan Logistics Pricing Matrix</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Lahore Local Delivery (PKR)</label>
              <input 
                type="number" 
                value={lahoreRate} 
                onChange={(e) => setLahoreRate(Number(e.target.value))} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Major Cities Freight (PKR)</label>
              <input 
                type="number" 
                value={majorRate} 
                onChange={(e) => setMajorRate(Number(e.target.value))} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Free Delivery Minimum (PKR)</label>
              <input 
                type="number" 
                value={freeShippingThreshold} 
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} 
                className="w-full bg-luxury-white border border-sand/50 p-2.5 text-xs rounded-md outline-none focus:border-walnut-brown"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="bg-walnut-brown text-luxury-white px-6 py-3 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-charcoal transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
