import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent, TrendingUp, Gift, DollarSign } from 'lucide-react';

interface APYData {
  currentAPY: number;
  claimedAIR: number;
  totalEarned: number;
  pendingRewards: number;
  volumeMultiplier: number;
  nextResetIn: string;
}

export const APYStats = () => {
  const [apyData, setApyData] = useState<APYData>({
    currentAPY: 259.19,
    claimedAIR: 396250.92,
    totalEarned: 26283.84,
    pendingRewards: 1847.32,
    volumeMultiplier: 1.25,
    nextResetIn: '2d 14h'
  });

  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    // Simulate claim transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setApyData(prev => ({
      ...prev,
      claimedAIR: prev.claimedAIR + prev.pendingRewards,
      pendingRewards: 0
    }));
    setClaiming(false);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">APY & Claim Stats</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Current APY */}
        <Card className="data-panel animated-bg">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Percent className="h-6 w-6 text-neon animate-glow" />
              <h3 className="text-2xl font-bold text-gradient font-orbitron">Current APY</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-5xl font-bold text-neon font-orbitron animate-glow">
                {apyData.currentAPY}%
              </p>
              <p className="text-sm text-muted-foreground">
                Volume-adjusted yield rate
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+12.5% from last epoch</span>
            </div>
          </div>
        </Card>

        {/* Claim Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="data-panel">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-accent" />
                <h4 className="font-semibold font-orbitron">Claimed $AIR</h4>
              </div>
              <p className="text-2xl font-bold text-cyber font-orbitron">
                {formatNumber(apyData.claimedAIR)}
              </p>
              <p className="text-sm text-muted-foreground">Total tokens claimed</p>
            </div>
          </Card>

          <Card className="data-panel">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                <h4 className="font-semibold font-orbitron">Total Earned</h4>
              </div>
              <p className="text-2xl font-bold text-neon font-orbitron">
                ${formatNumber(apyData.totalEarned)}
              </p>
              <p className="text-sm text-muted-foreground">USD value earned</p>
            </div>
          </Card>
        </div>

        {/* Pending Rewards & Claim */}
        <Card className="data-panel bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-primary font-orbitron mb-2">Pending Rewards</h4>
              <p className="text-3xl font-bold text-neon font-orbitron">
                {formatNumber(apyData.pendingRewards)} $AIR
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ≈ ${formatNumber(apyData.pendingRewards * 0.00025)} USD
              </p>
            </div>
            
            <Button 
              onClick={handleClaim}
              disabled={claiming || apyData.pendingRewards === 0}
              className="btn-neon w-full font-orbitron"
            >
              {claiming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Claiming...
                </div>
              ) : (
                `Claim ${formatNumber(apyData.pendingRewards)} $AIR`
              )}
            </Button>
          </div>
        </Card>

        {/* Volume Multiplier */}
        <Card className="data-panel">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold font-orbitron">Volume Multiplier</h4>
              <span className="text-accent font-orbitron">{apyData.volumeMultiplier}x</span>
            </div>
            
            <div className="progress-neon h-3">
              <div 
                className="progress-fill"
                style={{ width: `${(apyData.volumeMultiplier - 1) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Base: 1.0x</span>
              <span>Max: 2.0x</span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Multiplier resets in: <span className="text-accent">{apyData.nextResetIn}</span>
            </p>
          </div>
        </Card>

        {/* Yield History Preview */}
        <Card className="data-panel">
          <div className="space-y-3">
            <h4 className="font-semibold font-orbitron">Recent Yield History</h4>
            <div className="space-y-2">
              {[
                { epoch: 7, apy: 259.19, status: 'current' },
                { epoch: 6, apy: 246.67, status: 'completed' },
                { epoch: 5, apy: 234.12, status: 'completed' },
                { epoch: 4, apy: 221.89, status: 'completed' }
              ].map((item) => (
                <div key={item.epoch} className="flex justify-between items-center p-2 rounded border border-border/50">
                  <span className="text-sm font-orbitron">Epoch {item.epoch}</span>
                  <span className="text-sm font-bold text-cyber">{item.apy}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'current' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};