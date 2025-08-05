import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useTokenData } from '@/hooks/useTokenData';

export const DexscreenerWidget = () => {
  const { tokenData, formatNumber } = useTokenData();
  const [biggestTransactions, setBiggestTransactions] = useState({
    biggestBuy: { amount: 15420.67, usd: 52.34 },
    biggestSell: { amount: 8753.22, usd: 29.78 }
  });

  useEffect(() => {
    // Simulate real-time transaction updates
    const interval = setInterval(() => {
      setBiggestTransactions({
        biggestBuy: { 
          amount: Math.random() * 20000 + 5000, 
          usd: Math.random() * 100 + 20 
        },
        biggestSell: { 
          amount: Math.random() * 15000 + 3000, 
          usd: Math.random() * 80 + 15 
        }
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">Live Trading Data</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Live Price Chart */}
        <Card className="data-panel animated-bg">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-6 w-6 text-neon animate-glow" />
              <h3 className="text-2xl font-bold text-gradient font-orbitron">Live Price</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-5xl font-bold text-neon font-orbitron animate-glow">
                ${tokenData.price.toFixed(6)}
              </p>
              <p className="text-sm text-muted-foreground">
                Current AIR Token Price
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-cyber font-orbitron">
                  {tokenData.priceChange24h > 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">24h Change</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-neon font-orbitron">
                  ${formatNumber(tokenData.volume24h)}
                </p>
                <p className="text-xs text-muted-foreground">24h Volume</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary font-orbitron">
                  ${formatNumber(tokenData.marketCap)}
                </p>
                <p className="text-xs text-muted-foreground">Market Cap</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="data-panel">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-lg font-bold font-orbitron text-green-400">
                  {biggestTransactions.biggestBuy.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} AIR
                </p>
                <p className="text-sm text-muted-foreground">
                  Biggest Buy (${biggestTransactions.biggestBuy.usd.toFixed(2)})
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="data-panel">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-lg font-bold font-orbitron text-red-400">
                  {biggestTransactions.biggestSell.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} AIR
                </p>
                <p className="text-sm text-muted-foreground">
                  Biggest Sell (${biggestTransactions.biggestSell.usd.toFixed(2)})
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dexscreener Embed */}
        <div className="relative">
          <style dangerouslySetInnerHTML={{
            __html: `
              #dexscreener-embed {
                position: relative;
                width: 100%;
                padding-bottom: 125%;
                border-radius: calc(var(--radius) - 2px);
                overflow: hidden;
                border: 1px solid hsl(var(--border));
              }
              @media(min-width: 1400px) {
                #dexscreener-embed {
                  padding-bottom: 65%;
                }
              }
              #dexscreener-embed iframe {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                border: 0;
                border-radius: calc(var(--radius) - 2px);
              }
            `
          }} />
          
          <div id="dexscreener-embed">
            <iframe 
              src="https://dexscreener.com/ethereum/0xD277B8Bef27Af6c2dC0A8aEdDD23A57637892270?embed=1&loadChartSettings=0&tabs=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
              title="AIR Token Trading Chart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};