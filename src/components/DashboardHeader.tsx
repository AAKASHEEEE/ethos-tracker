"use client";

import { useState } from "react";
import { Monitor, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTokenData } from "@/hooks/useTokenData";

export const DashboardHeader = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { lastUpdate, refreshData, tokenData, formatNumber } = useTokenData();

  const handleRefresh = () => {
    refreshData();
    window.dispatchEvent(new CustomEvent("refreshData"));
  };

  return (
    <div className="bg-black text-green-400 border border-green-600 rounded-2xl p-4 shadow-[0_0_10px_rgba(0,255,0,0.5)]">
      <div className="flex justify-between items-center border-b border-green-600 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-green-400 animate-pulse" />
          <h1 className="font-mono text-lg md:text-2xl">
            $AIR ECOSYSTEM Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-xs font-mono">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-xs font-mono">OFFLINE</span>
              </>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-900/20 font-mono"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-5xl md:text-6xl font-bold font-orbitron text-green-400 tracking-widest drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
          ETH OS
        </h1>
        <p className="font-mono text-sm md:text-base text-green-300 mt-1">
          Decentralized AI Dashboard
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-green-600 pt-4">
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-green-400">ETH</p>
          <p className="text-xs text-green-300">Network</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-green-400">Epoch 2</p>
          <p className="text-xs text-green-300">Current</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-green-400">
            ${tokenData?.price?.toFixed(6) ?? "—"}
          </p>
          <p className="text-xs text-green-300">Live Price</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-green-400">
            {formatNumber(tokenData?.volume24h ?? 0)}
          </p>
          <p className="text-xs text-green-300">24h Volume</p>
        </div>
      </div>

      <div className="text-right mt-4">
        <p className="text-xs text-green-300">Last Update</p>
        <p className="text-sm font-mono">{lastUpdate?.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};
