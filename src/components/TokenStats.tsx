import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity, ExternalLink, Copy } from 'lucide-react';
import { useTokenData } from '@/hooks/useTokenData';
import { Button } from '@/components/ui/button';

export const TokenStats = () => {
  const { tokenData, loading, error, lastUpdate, formatNumber, formatLargeNumber } = useTokenData();

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openPoolOnGecko = () => {
    window.open(
      'https://www.geckoterminal.com/eth/pools/0xd277b8bef27af6c2dc0a8aeddd23a57637892270',
      '_blank'
    );
  };

  if (error) {
    return (
      <div className="retro-window">
        <div className="window-titlebar">
          <div className="window-controls">
            <div className="window-control control-close"></div>
            <div className="window-control control-minimize"></div>
            <div className="window-control control-maximize"></div>
          </div>
          <h2 className="font-orbitron font-bold text-sm text-black ml-2">
            $AIR Token Stats - Error
          </h2>
        </div>

        <div className="p-6">
          <Card className="data-panel bg-red-500/10 border-red-500/30">
            <div className="text-center space-y-2">
              <p className="text-red-400 font-orbitron">Failed to load live data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="btn-cyber">
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">
          ${tokenData.symbol} Token Stats - Live
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* LIVE BAR */}
        <Card className="data-panel bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-orbitron text-green-400">LIVE DATA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button onClick={openPoolOnGecko} variant="outline" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                {loading ? '...' : `$${tokenData.price.toFixed(8)}`}
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
                {loading ? '...' : `$${formatNumber(tokenData.marketCap)}`}
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
                {loading ? '...' : `$${formatNumber(tokenData.volume24h)}`}
              </p>
              <p className="text-sm text-muted-foreground">Trading Volume</p>
            </div>
          </Card>

          {/* Contract */}
          <Card className="data-panel">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground font-orbitron">Contract</h3>
              <Copy
                className="h-4 w-4 text-primary cursor-pointer"
                onClick={() => copyToClipboard(tokenData.address)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-mono text-cyber break-all">
                {formatAddress(tokenData.address)}
              </p>
              <p className="text-sm text-muted-foreground">Ethereum Network</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

