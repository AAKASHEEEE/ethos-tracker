"use client";

import { useState } from "react";
import { Monitor, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTokenData } from "@/hooks/useTokenData";

export default function DashboardHeader() {
  const [isOnline, setIsOnline] = useState(true);
  const { lastUpdate, refreshData, tokenData, formatNumber } = useTokenData();

  const handleRefresh = () => {
    refreshData();
    window.dispatchEvent(new CustomEvent("refreshData"));
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl border border-accent/30 bg-black/90 shadow-[0_0_30px_#0ff] backdrop-blur">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-accent" />
            <h1 className="font-orbitron tracking-widest text-accent text-sm md:text-base">
              ETH OS DASHBOARD — LIVE
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-black/50">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400 animate-pulse" />
                  <span className="text-xs font-orbitron text-green-400">LIVE API</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-orbitron text-red-400">OFFLINE</span>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last Update</p>
              <p className="text-xs font-mono">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="neon-button"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Core Stats */}
        <div className="text-center py-10">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-orbitron tracking-wider">
            ETH OS
          </h1>
          <p className="text-sm md:text-lg text-accent/70 font-medium mt-2">
            Decentralized AI Dashboard
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="rounded-xl p-4 border border-border bg-black/50 shadow-[0_0_10px_#0ff]">
              <p className="text-xl font-orbitron text-primary">ETH</p>
              <p className="text-xs text-muted-foreground">Network</p>
            </div>
            <div className="rounded-xl p-4 border border-border bg-black/50 shadow-[0_0_10px_#0ff]">
              <p className="text-xl font-orbitron text-accent">Epoch 2</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="rounded-xl p-4 border border-border bg-black/50 shadow-[0_0_10px_#0ff]">
              <p className="text-xl font-orbitron text-primary">${tokenData.price.toFixed(6)}</p>
              <p className="text-xs text-muted-foreground">Live Price</p>
            </div>
            <div className="rounded-xl p-4 border border-border bg-black/50 shadow-[0_0_10px_#0ff]">
              <p className="text-xl font-orbitron text-accent">{formatNumber(tokenData.volume24h)}</p>
              <p className="text-xs text-muted-foreground">24h Volume</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
