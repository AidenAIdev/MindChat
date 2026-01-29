'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  Users
} from 'lucide-react';

const patientNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Find Psychologists', href: '/dashboard', icon: Users },
  { name: 'My Sessions', href: '/dashboard', icon: MessageSquare },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
];

const psychologistNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pending Requests', href: '/dashboard', icon: MessageSquare },
  { name: 'My Patients', href: '/my-patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // Fallback to patient navigation if user role is not explicitly 'Psychologist'
  const navigation = (user?.role === 'Psychologist' || user?.userType === 'psychologist')
    ? psychologistNavigation
    : patientNavigation;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-black/40 border-r border-white/20">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          MindChat
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`
                flex items-center gap-3 w-full px-3 py-2 rounded-lg
                transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-white/20 p-4">
        <div className="mb-3 px-3">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold text-white truncate">{user?.email}</p>
          <p className="text-xs text-purple-400">{user?.role || user?.userType}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
