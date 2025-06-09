import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-xl shadow-md p-6 overflow-hidden', className)}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export const CardHeader = ({ className, children }: CardHeaderProps) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export const CardTitle = ({ className, children }: CardTitleProps) => {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-800 leading-tight', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export const CardDescription = ({ className, children }: CardDescriptionProps) => {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent = ({ className, children }: CardContentProps) => {
  return <div className={cn('', className)}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div className={cn('mt-4 flex items-center justify-end space-x-2', className)}>
      {children}
    </div>
  );
}; 