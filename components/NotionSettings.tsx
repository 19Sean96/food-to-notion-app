import React, { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getNotionDatabaseInfo } from '@/services/notionApi';
import { NotionDatabaseInfo } from '@/types';

export interface NotionSettingsProps {
  databaseId: string;
  onDatabaseIdChange: (id: string) => void;
  disabled?: boolean;
}

export const NotionSettings: React.FC<NotionSettingsProps> = ({
  databaseId,
  onDatabaseIdChange,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [dbInfo, setDbInfo] = useState<NotionDatabaseInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadDatabase = async () => {
    if (!databaseId.trim()) {
      setError('Please enter a database ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const info = await getNotionDatabaseInfo(databaseId);
      setDbInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load database');
      setDbInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <p className="text-sm text-gray-600">
            Enter your Notion database ID to save nutrition data.
        </p>
        <div className="flex items-center gap-2">
        <input
            type="text"
            value={databaseId}
            onChange={(e) => onDatabaseIdChange(e.target.value)}
            placeholder="Enter Notion database ID..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled || loading}
        />
        <Button
            onClick={handleLoadDatabase}
            disabled={disabled || loading || !databaseId.trim()}
            variant="primary"
            size="md"
        >
            {loading ? (
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
            </>
            ) : (
            'Load DB'
            )}
        </Button>
        </div>

        {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md">
            {error}
        </div>
        )}

        {dbInfo && (
        <div className="p-4 bg-gray-50 rounded-md space-y-3">
            <div>
            <h4 className="font-medium text-gray-900">Database Info</h4>
            <p className="text-sm text-gray-600">Name: {dbInfo.title}</p>
            <p className="text-sm text-gray-600">Total Pages: {dbInfo.propertyCount}</p>
            </div>
            
            <div>
            <h4 className="font-medium text-gray-900">Properties</h4>
            <ul className="mt-1 space-y-1">
                {dbInfo.properties.map((prop, index) => (
                <li key={index} className="text-sm text-gray-600">
                    {prop.name} ({prop.type})
                </li>
                ))}
            </ul>
            </div>
        </div>
        )}
    </div>
  );
}; 