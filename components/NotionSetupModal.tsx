'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Database, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export const NotionSetupModal: React.FC = () => {
  const {
    notionModalOpen,
    toggleNotionModal,
    notionDatabaseId,
    setNotionDatabaseId,
    loadDatabaseInfo,
    databaseLoading,
    databaseInfo
  } = useAppStore();

  const connected = !!databaseInfo;

  return (
    <Modal
      isOpen={notionModalOpen}
      onClose={() => toggleNotionModal(false)}
      title="Notion Database Setup"
      description="Connect your Notion database to save nutrition data"
      size="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Connection Status */}
        {connected && databaseInfo && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-medium text-emerald-900">Connected Successfully</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  Database: {databaseInfo.title} • {databaseInfo.pageCount} pages
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Database ID Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notion Database ID
            </label>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="Enter your Notion database ID..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">How to find your Database ID:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Notion database page</li>
              <li>Copy the URL from your browser</li>
              <li>The database ID is the 32-character string after the last slash</li>
              <li>Example: notion.so/myworkspace/DatabaseName-<strong>abc123def456...</strong></li>
            </ol>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto mt-2"
              onClick={() => window.open('https://developers.notion.com/docs/working-with-databases', '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Learn more about Notion databases
            </Button>
          </div>
        </div>

        {/* Database Properties */}
        {databaseInfo && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Database Properties</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{databaseInfo.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Pages:</span>
                <span className="ml-2 font-medium">{databaseInfo.pageCount}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Available Properties:</span>
              <div className="flex flex-wrap gap-2">
                {databaseInfo.properties?.map((prop: any, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {prop.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => toggleNotionModal(false)}
          >
            {connected ? 'Close' : 'Cancel'}
          </Button>
          <Button
            onClick={loadDatabaseInfo}
            disabled={databaseLoading || !notionDatabaseId.trim()}
            className="min-w-32"
          >
            {databaseLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                {connected ? 'Reconnect' : 'Connect Database'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 