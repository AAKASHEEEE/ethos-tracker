import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';

interface TokenData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  totalTransactions: number;
  volume24h: number;
}

export const TokenStats = () => {
  const [tokenData, setTokenData] = useState<TokenData>({
    price: 0.00025,
    priceChange24h: 12.5,
    marketCap: 925821,
    holders: 12823,
    totalTransactions: 1247,
    volume24h: 87432
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Simulate API call - replace with real API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setLoading(false);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">$AIR Token Stats</h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Live Price */}
        <Card className="data-panel animated-bg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Live Price</h3>
            {tokenData.priceChange24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-neon font-orbitron">
              {loading ? '...' : `$${tokenData.price.toFixed(6)}`}
            </p>
            <p className={`text-sm ${tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {loading ? '...' : `${tokenData.priceChange24h >= 0 ? '+' : ''}${tokenData.priceChange24h.toFixed(2)}%`}
            </p>
          </div>
        </Card>

        {/* Market Cap */}
        <Card className="data-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Market Cap</h3>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-cyber font-orbitron">
              {loading ? '...' : formatNumber(tokenData.marketCap)}
            </p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
        </Card>

        {/* Holders */}
        <Card className="data-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Holders</h3>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-neon font-orbitron">
              {loading ? '...' : formatLargeNumber(tokenData.holders)}
            </p>
            <p className="text-sm text-muted-foreground">Unique Wallets</p>
          </div>
        </Card>

        {/* 24h Volume */}
        <Card className="data-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">24h Volume</h3>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-cyber font-orbitron">
              {loading ? '...' : formatNumber(tokenData.volume24h)}
            </p>
            <p className="text-sm text-muted-foreground">Trading Volume</p>
          </div>
        </Card>

        {/* Total Transactions */}
        <Card className="data-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Transactions</h3>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-neon font-orbitron">
              {loading ? '...' : formatLargeNumber(tokenData.totalTransactions)}
            </p>
            <p className="text-sm text-muted-foreground">Total Count</p>
          </div>
        </Card>

        {/* Contract Info */}
        <Card className="data-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Contract</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-mono text-cyber break-all">
              0x8164b4...d8b288
            </p>
            <p className="text-sm text-muted-foreground">Base Network</p>
          </div>
        </Card>
      </div>
    </div>
  );
};