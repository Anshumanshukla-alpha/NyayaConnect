import React, { useState } from 'react';
import { User, Notification } from '../types';
import {
  Scale,
  Menu,
  X,
  Bell,
  Briefcase,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Search,
  LayoutDashboard,
  ShieldCheck,
  Users,
  ClipboardList,
  UserCircle2,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'CLIENT' | 'LAWYER' | 'ADMIN';
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
}

const NAV_BY_ROLE = {
  CLIENT: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage', label: 'Legal Help', icon: Sparkles },
    { id: 'lawyers', label: 'Find an Advocate', icon: Scale },
    { id: 'appointments', label: 'Appointments', icon: Briefcase },
    { id: 'cases', label: 'My Cases', icon: FileCheck2 },
    { id: 'vault', label: 'Documents', icon: ClipboardList },
    { id: 'legal-aid', label: 'Legal Aid', icon: HelpCircle },
    { id: 'tracking', label: 'Case Tracking', icon: Search },
  ],
  LAWYER: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Briefcase },
    { id: 'cases', label: 'My Cases', icon: FileCheck2 },
    { id: 'vault', label: 'Documents', icon: ClipboardList },
    { id: 'profile', label: 'Profile', icon: UserCircle2 },
  ],
  ADMIN: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
    { id: 'appointments', label: 'Appointments', icon: Briefcase },
    { id: 'cases', label: 'Cases', icon: FileCheck2 },
    { id: 'lawyers', label: 'Advocates', icon: Users },
    { id: 'audit', label: 'Security Logs', icon: ShieldCheck },
  ],
} as const;

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
  notifications,
  onMarkNotificationRead,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const navLinks = NAV_BY_ROLE[currentRole];
  const isClient = currentRole === 'CLIENT';

  const primaryLinks = isClient
    ? navLinks.filter(
        (link) => link.id !== 'legal-aid' && link.id !== 'tracking'
      )
    : navLinks;

  const moreLinks = isClient
    ? navLinks.filter(
        (link) => link.id === 'legal-aid' || link.id === 'tracking'
      )
    : [];

  const handleNavigation = (tab: string) => {
    onTabChange(tab);
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigation('dashboard')}
            className="group flex shrink-0 items-center gap-2.5 pr-4 text-left"
            aria-label="Go to dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#172033] text-[#d6b56d] shadow-sm transition-colors group-hover:bg-[#202b40]">
              <Scale className="h-5 w-5" />
            </div>
            <span className="whitespace-nowrap font-serif text-[1.25rem] font-semibold tracking-[-0.02em] text-[#172033]">
              NyayaConnect
            </span>
          </button>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-start gap-0.5 overflow-hidden text-sm font-medium xl:flex"
            aria-label="Primary navigation"
          >
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavigation(link.id)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-2 py-5 transition-colors 2xl:px-2.5 ${
                    isActive
                      ? 'border-[#9a6a18] font-semibold text-[#172033]'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-[#172033]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#9a6a18]' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {moreLinks.length > 0 && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen((previous) => !previous)}
                  className={`flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-2 py-5 text-sm transition-colors 2xl:px-2.5 ${
                    moreLinks.some((link) => activeTab === link.id)
                      ? 'font-semibold text-[#172033]'
                      : 'text-slate-500 hover:border-slate-300 hover:text-[#172033]'
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={moreDropdownOpen}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      moreDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {moreDropdownOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
                    role="menu"
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = activeTab === link.id;

                      return (
                        <button
                          key={link.id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleNavigation(link.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                            isActive
                              ? 'bg-slate-50 font-semibold text-[#172033]'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-[#172033]'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? 'text-[#9a6a18]' : 'text-slate-400'
                            }`}
                          />
                          <span>{link.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen((previous) => !previous)}
                className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Notifications"
                aria-expanded={notifDropdownOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Notifications
                    </span>
                    <span className="text-xs text-slate-500">
                      {unreadCount} unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">
                        You're all caught up.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => {
                            onMarkNotificationRead(notification.id);
                            if (notification.link) {
                              onTabChange(notification.link);
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`w-full p-3 text-left text-xs transition-colors hover:bg-slate-50 ${
                            !notification.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800">
                              {notification.title}
                            </span>
                            <span className="whitespace-nowrap text-[10px] text-slate-400">
                              {notification.createdAt}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-slate-600">
                            {notification.message}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavigation('profile')}
              className="hidden items-center gap-2 rounded-lg border-l border-slate-200 py-1.5 pl-3 pr-1.5 text-left transition-colors hover:bg-slate-50 md:flex"
              title="Account profile"
            >
              <div className="hidden text-right lg:block">
                <div className="max-w-[110px] truncate text-xs font-semibold leading-tight text-slate-900">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400">My account</div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold uppercase text-white shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="hidden whitespace-nowrap px-2 py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-[#172033] sm:inline-flex"
            >
              Sign out
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 xl:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pb-4 pt-2 shadow-sm xl:hidden">
          <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                {currentUser.name}
              </div>
              <div>Account</div>
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavigation(link.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-[#d6b56d]' : 'text-slate-400'
                  }`}
                />
                <span>{link.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};
