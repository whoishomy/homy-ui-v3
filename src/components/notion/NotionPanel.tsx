import React, { useEffect, useState } from 'react';
import { LenaEngine } from '@/lena/core/LenaEngine';
import { LenaState, NotionPage } from '@/lena/core/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader2, RefreshCw, Check, X } from 'lucide-react';

interface NotionPanelProps {
  className?: string;
}

export const NotionPanel: React.FC<NotionPanelProps> = ({ className }) => {
  const [state, setState] = useState<LenaState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lena = LenaEngine.getInstance();
    setState(lena.getState());

    const handleStateChange = (newState: LenaState) => {
      setState(newState);
    };

    lena.on('stateChange', handleStateChange);
    return () => {
      lena.off('stateChange', handleStateChange);
    };
  }, []);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const lena = LenaEngine.getInstance();
      await lena.sync();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: LenaState['syncStatus']) => {
    switch (status) {
      case 'syncing':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'idle':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!state) {
    return null;
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Notion Integration</h2>
          <Badge
            variant="outline"
            className={
              state.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }
          >
            {state.isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <Button
          onClick={handleSync}
          disabled={isLoading || !state.isConnected}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Sync Now
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Status</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(state.syncStatus)}`} />
            {state.syncStatus.charAt(0).toUpperCase() + state.syncStatus.slice(1)}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Last Sync</span>
          <span>{state.lastSync ? new Date(state.lastSync).toLocaleString() : 'Never'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Pages Synced</span>
          <span>{state.notionPages.length}</span>
        </div>

        {state.errorCount > 0 && (
          <div className="flex items-center justify-between text-sm text-red-500">
            <span>Errors</span>
            <span>{state.errorCount}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
