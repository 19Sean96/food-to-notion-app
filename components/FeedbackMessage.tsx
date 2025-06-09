import React from 'react';
import { AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FeedbackMessage as FeedbackMessageType } from '@/types';

interface FeedbackMessageProps {
  feedback: FeedbackMessageType;
  onDismiss?: () => void;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  feedback,
  onDismiss,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[feedback.type];

  return (
    <div
      className={cn(
        'mb-6 p-4 rounded-md border flex items-start',
        bgColor[feedback.type]
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 mr-3', iconColor[feedback.type])} />
      <div className="flex-1">
        <p className={cn('font-medium', textColor[feedback.type])}>
          {feedback.message}
        </p>
        {feedback.details && (
          <>
            <div
              className={cn(
                'mt-2 text-sm cursor-pointer flex items-center',
                textColor[feedback.type],
                'opacity-80'
              )}
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? 'Hide details' : 'Show details'}</span>
              {expanded ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </div>
            {expanded && (
              <p className={cn('mt-2 text-sm whitespace-pre-wrap', textColor[feedback.type])}>
                {feedback.details}
              </p>
            )}
          </>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'ml-3 h-5 w-5 rounded-full flex items-center justify-center',
            textColor[feedback.type],
            'opacity-70 hover:opacity-100'
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}; 