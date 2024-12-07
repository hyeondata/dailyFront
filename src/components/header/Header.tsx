"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold text-gray-900">Logo</div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="profile"
                      className="rounded-full"
                      width={36}
                      height={36}
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium text-gray-900">
                    {session.user?.name || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.user?.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-gray-700 hover:text-gray-900">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign/in">
              <Button 
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              >
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;