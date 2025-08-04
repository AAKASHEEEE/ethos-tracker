import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Percent, TrendingUp } from 'lucide-react';

interface EpochAPYData {
  epoch: number;
  apy: number;
  rewards: number;
  isActive: boolean;
}

export const APYStats = () => {
  const [currentEpoch] = useState(2); // Current epoch from the dashboard
  
  // Calculate APY for each epoch: starts at base APY and increases by 3% each epoch
  const baseAPY = 6.6; // Starting APY for epoch 1
  const apyIncrease = 3; // 3% increase per epoch
  
  // Calculate rewards: starts at 200k and decreases by (107k/11) per epoch  
  const baseRewards = 200000; // Early rewards (2x)
  const rewardDecrease = 107000 / 11; // Total decrease divided by 11 epochs
  
  const epochsData: EpochAPYData[] = Array.from({ length: 11 }, (_, i) => {
    const epochNumber = i + 1;
    const epochAPY = baseAPY + (epochNumber - 1) * apyIncrease;
    const epochRewards = Math.max(baseRewards - (epochNumber - 1) * rewardDecrease, 25000);
    
    return {
      epoch: epochNumber,
      apy: epochAPY,
      rewards: Math.round(epochRewards),
      isActive: epochNumber === currentEpoch,
    };
  });

  const currentAPY = epochsData.find(e => e.isActive)?.apy || baseAPY;

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">APY Progression</h2>
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
                {currentAPY.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Epoch {currentEpoch} daily yield rate
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+3% each epoch</span>
            </div>
          </div>
        </Card>

        {/* Epoch APY Progression */}
        <Card className="data-panel">
          <div className="space-y-3">
            <h4 className="font-semibold font-orbitron">Epoch APY Progression</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {epochsData.map((epoch) => (
                <div 
                  key={epoch.epoch} 
                  className={`flex justify-between items-center p-3 rounded border ${
                    epoch.isActive 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-orbitron ${
                      epoch.isActive ? 'text-primary font-bold' : 'text-foreground'
                    }`}>
                      Epoch {epoch.epoch}
                    </span>
                    {epoch.isActive && (
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        CURRENT
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold font-orbitron ${
                      epoch.isActive ? 'text-neon' : 'text-cyber'
                    }`}>
                      {epoch.apy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(epoch.rewards / 1000).toFixed(0)}K $AIR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* APY Logic Explanation */}
        <Card className="data-panel bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
          <div className="space-y-3">
            <h4 className="font-semibold font-orbitron text-accent">Early Visionaries Win</h4>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                The airdrop is divided into 11 epochs, each lasting 3 days.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="p-3 rounded bg-background/50 border border-border">
                  <div className="font-semibold text-neon mb-1">Early (Epoch 1-3)</div>
                  <div className="text-xs text-muted-foreground">2x Rewards (200,000 $AIR)</div>
                </div>
                <div className="p-3 rounded bg-background/50 border border-border">
                  <div className="font-semibold text-orange-400 mb-1">Late (Epoch 9-11)</div>
                  <div className="text-xs text-muted-foreground">0.25x Rewards (25,000 $AIR)</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                                Each epoch increases APY by 3% and reduces rewards. More $AIR = more rewards.

              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};