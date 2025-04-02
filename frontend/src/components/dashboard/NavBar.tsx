'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { api } from '@/lib/axios';
import { CreditCard, Bug, ArrowLeftToBracket, Infinity } from '../../../public/icons/SvgIcons';
import Logo from '../landing/logo';
import { useUserInfo } from '@/lib/queries';

const NavBar = () => {
  const { data, isLoading } = useUserInfo();

  const monthlyCredits =    data?.monthlyCredits ?? 0;
  const creditsUsed = data?.creditsUsed ?? 0;
  const remainingCredits = monthlyCredits - creditsUsed;
  const isUnlimited = (data?.plan === "Pro" || data?.plan === "Growth") ? true : false;
  const handleSignout = async () => {
    try {
      await api.post('/auth/signout');
      // window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  const handleReportBug = () => {
    try {
      console.log('Bug report button clicked');
      const subject = encodeURIComponent('Bug Report');
      const body = encodeURIComponent('Please describe the bug you encountered:\n\n');
      const mailtoLink = `mailto:ouchen606@gmail.com?subject=${subject}&body=${body}`;
      console.log('Opening mailto link:', mailtoLink);
      
      // Try opening in current window
      window.location.href = mailtoLink;
      
      // Alternative approach - try opening in a new window as backup
      setTimeout(() => {
        window.open(mailtoLink, '_blank');
      }, 300);
    } catch (error) {
      console.error('Error opening mail client:', error);
      alert('Could not open email client. Please send an email manually to ouchen606@gmail.com');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Logo  size={40} textClass=" text-lg lg:text-2xl" />

          {/* Credits Display */}
          <div className="flex items-center space-x-6">
            {!isLoading && data && (
              <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <CreditCard className="w-4 h-4 text-slate-600 " />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm h-6 flex items-center justify-center font-medium text-slate-600">
                      {isUnlimited ? <Infinity className="w-4 h-4" /> : remainingCredits}
                    </span>
                    <span className="text-sm h-6 text-slate-500 flex gap-1">
                      credits <p className='hidden md:flex'>remaining</p>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-1">
                    <div 
                      className="bg-slate-600 h-1 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(creditsUsed / monthlyCredits) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 ring-2 ring-white transition duration-200 hover:ring-slate-200">
                  {data?.avatar && (
                    <AvatarImage 
                      src={data.avatar} 
                      alt={data.displayName || 'User'} 
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                    {data?.displayName ? data.displayName.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  onClick={handleReportBug}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Bug className="w-4 h-4" />
                  <span>Report Bug</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignout}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <ArrowLeftToBracket className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;