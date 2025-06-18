'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Database, 
  Settings, 
  Home,
  BarChart3,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const NavigationSidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    toggleSearchModal,
    toggleNotionModal,
    databaseInfo,
  } = useAppStore();
  
  const pathname = usePathname();
  const notionConnected = !!databaseInfo;

  const navigationItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      href: '/saved-items',
      icon: Save,
      label: 'Saved Items',
    },
    {
      icon: Search,
      label: 'Search Foods',
      onClick: () => toggleSearchModal(true),
    },
    {
      icon: Database,
      label: 'Notion Setup',
      onClick: () => toggleNotionModal(true),
      badge: notionConnected ? 'Connected' : 'Setup Required',
      badgeColor: notionConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      disabled: true,
    },
    {
      icon: FileText,
      label: 'Reports',
      disabled: true,
    },
  ];

  const bottomItems = [
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => {},
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {},
    },
  ];

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = item.href && pathname === item.href;

    const buttonContent = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-10",
          sidebarCollapsed ? "px-2" : "px-3",
          item.disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={item.disabled ? undefined : item.onClick}
        disabled={item.disabled}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="ml-3 truncate">{item.label}</span>
            {item.badge && (
              <span className={cn(
                "ml-auto px-2 py-0.5 text-xs rounded-full font-medium",
                item.badgeColor
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Button>
    );

    if (item.href) {
      return <Link href={item.href}>{buttonContent}</Link>;
    }

    return buttonContent;
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Nutrition Hub</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item, index) => (
          <div key={index}>
            {renderNavItem(item)}
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="p-2 border-t border-border space-y-1">
        {bottomItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start h-10",
                sidebarCollapsed ? "px-2" : "px-3"
              )}
              onClick={item.onClick}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}; 