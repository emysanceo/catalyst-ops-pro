import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';
import { isOnline, registerConnectivityListeners, getPendingSales } from '@/lib/offline';

export const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updatePendingCount = async () => {
      const pending = await getPendingSales();
      setPendingCount(pending.length);
    };

    updatePendingCount();
    
    const cleanup = registerConnectivityListeners(
      () => {
        setOnline(true);
        updatePendingCount();
      },
      () => {
        setOnline(false);
        updatePendingCount();
      }
    );

    // Check pending sales periodically
    const interval = setInterval(updatePendingCount, 10000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  if (online && pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {!online ? (
        <Alert className="bg-destructive/10 border-destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <span className="font-semibold">Offline Mode</span>
            <br />
            You're currently offline. Sales will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      ) : pendingCount > 0 ? (
        <Alert className="bg-primary/10 border-primary">
          <CloudOff className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <span className="font-semibold">Syncing...</span>
            <br />
            {pendingCount} sale{pendingCount > 1 ? 's' : ''} pending upload
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};
