"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth.store";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger Placeholder */}
        <button className="md:hidden p-2 hover:bg-white/10 rounded-full text-white">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search - Hidden on small mobile */}
        <div className="hidden sm:block w-64">
           <div className="h-10">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
             </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block text-white">
            <p className="text-sm font-medium">{user?.firstName || "User"} {user?.lastName || ""}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || user?.userType || "Guest"}</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-purple-500/20">
            <AvatarImage src={user?.profilePictureUrl} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
