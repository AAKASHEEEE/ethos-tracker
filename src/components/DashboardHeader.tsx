import { useState } from 'react';
import { Monitor, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTokenData } from '@/hooks/useTokenData';

export const DashboardHeader = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { lastUpdate, refreshData, tokenData, formatNumber } = useTokenData();

  const handleRefresh = () => {
    refreshData();
    // Trigger data refresh across components
    window.dispatchEvent(new CustomEvent('refreshData'));
  };

  return (
    <div className="eth-window mb-8">
      <div className="window-header">
        <div className="window-indicator" />
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-foreground" />
          <h1 className="window-title">ETH OS Dashboard - LIVE</h1>
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-r from-secondary/20 to-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-orbitron tracking-tight">
              ETH OS
            </h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">
              Decentralized AI Infrastructure Dashboard
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-orbitron text-green-400">LIVE API</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-orbitron text-red-400">OFFLINE</span>
                </>
              )}
            </div>
            
            {/* Last Update */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last Update</p>
              <p className="text-sm font-mono">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            
            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="neon-button"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-primary font-orbitron">ETH</p>
            <p className="text-xs text-muted-foreground">Network</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent font-orbitron">Epoch 2</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary font-orbitron">${tokenData.price.toFixed(6)}</p>
            <p className="text-xs text-muted-foreground">Live Price</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent font-orbitron">{formatNumber(tokenData.volume24h)}</p>
            <p className="text-xs text-muted-foreground">24h Volume</p>
          </div>
        </div>
      </div>
    </div>
  );
};