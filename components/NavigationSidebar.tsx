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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
  onOpenNotionSetup: () => void;
  notionConnected: boolean;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onOpenSearch,
  onOpenNotionSetup,
  notionConnected
}) => {
  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      active: true,
      onClick: () => {},
    },
    {
      icon: Search,
      label: 'Search Foods',
      active: false,
      onClick: onOpenSearch,
    },
    {
      icon: Database,
      label: 'Notion Setup',
      active: false,
      onClick: onOpenNotionSetup,
      badge: notionConnected ? 'Connected' : 'Setup Required',
      badgeColor: notionConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      active: false,
      onClick: () => {},
      disabled: true,
    },
    {
      icon: FileText,
      label: 'Reports',
      active: false,
      onClick: () => {},
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

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
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
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2 space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                isCollapsed ? "px-2" : "px-3",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={item.disabled ? undefined : item.onClick}
              disabled={item.disabled}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
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
        })}
      </div>

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
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={item.onClick}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}; 