'use client';

import React, { useState } from 'react';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { Button } from '@/components/ui/Button';
import { Search, Database, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const notionConnected = false;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <NavigationSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          notionConnected={notionConnected}
        />
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nutrition Hub</h1>
                <p className="text-muted-foreground mt-1">Professional nutrition data management</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button>
                <Search className="w-4 h-4" />
                Search Foods
              </Button>
              <Button variant="outline">
                <Database className="w-4 h-4" />
                Setup Notion
              </Button>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
