'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection = ({ title, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('transform transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
          size={20}
        />
      </button>
      {isOpen && <div className="pb-4 pt-2">{children}</div>}
    </div>
  );
}; 