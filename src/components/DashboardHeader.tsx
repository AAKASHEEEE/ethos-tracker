import { useState } from 'react';
import { Monitor, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardHeader = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Trigger data refresh across components
    window.dispatchEvent(new CustomEvent('refreshData'));
  };

  return (
    <div className="retro-window mb-6">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Monitor className="h-4 w-4 text-black" />
          <h1 className="font-orbitron font-bold text-sm text-black">Ethereum OS Dashboard</h1>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-secondary to-muted">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient font-orbitron">
              $AIR Ecosystem Tracker
            </h1>
            <p className="text-muted-foreground">
              Real-time DePIN network analytics and rewards dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-orbitron text-green-400">ONLINE</span>
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
              className="btn-cyber"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-neon font-orbitron">Base</p>
            <p className="text-xs text-muted-foreground">Network</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-cyber font-orbitron">Epoch 7</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-neon font-orbitron">259.19%</p>
            <p className="text-xs text-muted-foreground">Live APY</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-cyber font-orbitron">2d 14h</p>
            <p className="text-xs text-muted-foreground">Time Left</p>
          </div>
        </div>
      </div>
    </div>
  );
};