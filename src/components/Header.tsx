
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar?: () => void;
  showToggle?: boolean;
}

export default function Header({ toggleSidebar, showToggle = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-sm border-b border-border/50">
      <div className="mx-auto w-full px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Menu button & title */}
          <div className="flex items-center">
            {showToggle && (
              <button
                type="button"
                className="text-gray-500 md:hidden mr-3 focus:outline-none"
                onClick={toggleSidebar}
              >
                <span className="sr-only">সাইডবার খুলুন</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
            <h1 className="text-lg font-medium text-gray-800 md:text-xl">
              মাদরাসা ম্যানেজমেন্ট সিস্টেম
            </h1>
          </div>

          {/* Right side - User menu & notifications */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 transition-all hover:scale-105">
                        <AvatarFallback className="bg-primary text-white">
                          {user ? getInitials(user.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 animate-fadeIn"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>লগ আউট</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
