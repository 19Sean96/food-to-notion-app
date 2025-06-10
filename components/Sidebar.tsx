import React from 'react';
import { NotionSettings, NotionSettingsProps } from './NotionSettings';
import { FoodSearchForm, FoodSearchFormProps } from './FoodSearchForm';
import { CollapsibleSection } from './ui/Collapsible';
import { cn } from '@/utils/cn';

interface SidebarProps {
  notionSettingsProps: NotionSettingsProps;
  foodSearchFormProps: FoodSearchFormProps;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ notionSettingsProps, foodSearchFormProps, isCollapsed }) => {
  return (
    <aside className={cn(
        "flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-0 lg:w-0" : "w-full lg:w-[380px] lg:mr-8"
    )}>
        <div className={cn(
            "lg:sticky lg:top-8 bg-white p-6 rounded-lg shadow-sm border transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
        )}>
            <CollapsibleSection title="Notion Integration" defaultOpen>
                <NotionSettings {...notionSettingsProps} />
            </CollapsibleSection>
            <CollapsibleSection title="Search for Foods" defaultOpen>
                <FoodSearchForm {...foodSearchFormProps} />
            </CollapsibleSection>
        </div>
    </aside>
  );
}; 