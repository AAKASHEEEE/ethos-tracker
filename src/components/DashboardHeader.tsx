"use client";

import { useState } from "react";
import { Monitor, Wifi, WifiOff, RefreshCw, ThumbsUp, ThumbsDown, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTokenData } from "@/hooks/useTokenData";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  const [isOnline, setIsOnline] = useState(true);
  const { lastUpdate, refreshData, tokenData, formatNumber } = useTokenData();
  const [bullishVotes, setBullishVotes] = useState(0);
  const [bearishVotes, setBearishVotes] = useState(0);

  const handleRefresh = () => {
    refreshData();
    window.dispatchEvent(new CustomEvent("refreshData"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="eth-window mb-8 rounded-2xl border border-accent/30 shadow-[0_0_30px_#0ff] bg-black/90 backdrop-blur">
        {/* Header */}
        <div className="window-header flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-accent" />
            <h1 className="font-orbitron tracking-widest text-accent text-lg">$AIR ECOSYSTEM Dashboard - LIVE</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border">
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
              <p className="text-sm font-mono">{lastUpdate.toLocaleTimeString()}</p>
            </div>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="neon-button"
            >
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-orbitron tracking-widest">
              ETH OS
            </h1>
            <p className="text-base text-accent/70 italic tracking-wide mt-2">
              Autonomous AI Infrastructure
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-black/40 rounded-xl p-4 border border-border shadow-[0_0_10px_#0ff] text-center">
              <p className="text-xl font-orbitron text-primary">ETH</p>
              <p className="text-xs text-muted-foreground">Network</p>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-border shadow-[0_0_10px_#0ff] text-center">
              <p className="text-xl font-orbitron text-accent">Epoch 2</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-border shadow-[0_0_10px_#0ff] text-center">
              <p className="text-xl font-orbitron text-primary">${tokenData.price.toFixed(6)}</p>
              <p className="text-xs text-muted-foreground">Live Price</p>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-border shadow-[0_0_10px_#0ff] text-center">
              <p className="text-xl font-orbitron text-accent">{formatNumber(tokenData.volume24h)}</p>
              <p className="text-xs text-muted-foreground">24h Volume</p>
            </div>
          </div>

          {/* Community Sentiment */}
          <div className="mt-10 text-center">
            <h2 className="text-lg font-orbitron text-primary mb-4 flex items-center justify-center gap-2">
              <BarChart2 className="h-5 w-5" /> Community Sentiment
            </h2>
            <div className="flex justify-center gap-8">
              <Button
                onClick={() => setBullishVotes(bullishVotes + 1)}
                variant="outline"
                size="sm"
                className="neon-button flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" /> Bullish ({bullishVotes})
              </Button>
              <Button
                onClick={() => setBearishVotes(bearishVotes + 1)}
                variant="outline"
                size="sm"
                className="neon-button flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" /> Bearish ({bearishVotes})
              </Button>
            </div>
          </div>

          {/* Dex Screener Embed */}
          <div className="mt-10">
            <style>{`
              #dexscreener-embed {
                position: relative; width: 100%; padding-bottom: 125%;
              }
              @media (min-width: 1400px) {
                #dexscreener-embed { padding-bottom: 65%; }
              }
              #dexscreener-embed iframe {
                position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: 0;
              }
            `}</style>
            <div id="dexscreener-embed">
              <iframe
                src="https://dexscreener.com/ethereum/0xD277B8Bef27Af6c2dC0A8aEdDD23A57637892270?embed=1&loadChartSettings=0&tabs=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                title="Dex Screener"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
