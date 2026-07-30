'use client';
import { useEffect, useState } from 'react';
import { Users, Search, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/users');
      if (res.data?.data?.users) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change user role to ${newRole}?`)) return;

    try {
      setUpdatingId(userId);
      const res = await api.put(`/auth/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      alert('Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Customer & User Accounts</h1>
          <p className="text-sm text-gray-500">Manage registered customers and administrative staff accounts.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand/50 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-sand/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">No users found</p>
            <p className="text-xs text-gray-400 mt-1">Try refining your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-sand/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-walnut-brown text-white font-semibold flex items-center justify-center text-xs">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-charcoal">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{user.email}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-purple-50 text-purple-800 border border-purple-200">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                          <UserCheck className="w-3.5 h-3.5" /> Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(user._id, user.role)}
                        disabled={updatingId === user._id}
                        className="px-3 py-1.5 bg-sand/30 hover:bg-sand/60 text-charcoal text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        {updatingId === user._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          `Make ${user.role === 'admin' ? 'Customer' : 'Admin'}`
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
