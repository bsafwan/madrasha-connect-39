
import React from "react";
import { cn } from "@/lib/utils";
import { Bell, Menu, Search, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar?: () => void;
  showToggle?: boolean;
}

const Header = ({ toggleSidebar, showToggle = true }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6"
      )}
    >
      {/* Menu toggle button for mobile */}
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}

      <div className="flex flex-1 items-center justify-end gap-4">
        <form className="relative hidden sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="অনুসন্ধান করুন..."
            className="rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </form>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>

        {user && (
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
