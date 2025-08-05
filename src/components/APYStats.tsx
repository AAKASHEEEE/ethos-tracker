import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Percent, TrendingUp, Clock } from 'lucide-react';

interface EpochAPYData {
  epoch: number;
  apy: number;
  rewards: number;
  isActive: boolean;
}

interface EpochData {
  currentEpoch: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  progressPercentage: number;
}

export const APYStats = () => {
  const [epochData, setEpochData] = useState<EpochData>({
    currentEpoch: 2,
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    progressPercentage: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Epoch 2 starts: August 1, 2025, 10:45 PM IST == 17:15 UTC
      const epoch2StartUTC = new Date('2025-08-01T17:15:00Z').getTime();
      const epochDuration = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

      const nowUTC = Date.now();
      const elapsed = nowUTC - epoch2StartUTC;

      const epochsElapsed = Math.floor(elapsed / epochDuration);
      const currentEpoch = Math.min(2 + epochsElapsed, 11);

      const currentStart = epoch2StartUTC + epochsElapsed * epochDuration;
      const currentEnd = currentStart + epochDuration;

      const timeLeft = currentEnd - nowUTC;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const progress = Math.max(0, ((epochDuration - timeLeft) / epochDuration) * 100);

      setEpochData({
        currentEpoch,
        timeLeft: { days, hours, minutes, seconds },
        progressPercentage: Math.round(progress),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);
  
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
      isActive: epochNumber === epochData.currentEpoch,
    };
  });

  const currentAPY = epochsData.find(e => e.isActive)?.apy || baseAPY;
  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">APY & Epoch Status</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Current Epoch & Time Status */}
        <Card className="data-panel animated-bg">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 text-neon animate-glow" />
              <h3 className="text-2xl font-bold text-gradient font-orbitron">
                Epoch {epochData.currentEpoch} / 11
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {['DAYS', 'HRS', 'MIN', 'SEC'].map((label, i) => (
                  <div key={label} className="text-center">
                    <div className="neon-button p-2">
                      <p className="text-lg font-bold font-orbitron text-neon">
                        {formatTime(Object.values(epochData.timeLeft)[i])}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-orbitron">{label}</p>
                  </div>
                ))}
              </div>
              
              <div className="progress-neon h-4">
                <div
                  className="progress-fill flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${epochData.progressPercentage}%` }}
                >
                  {epochData.progressPercentage}%
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Current APY */}
        <Card className="data-panel animated-bg border-2 border-neon/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Percent className="h-8 w-8 text-neon animate-glow" />
              <h3 className="text-3xl font-bold text-gradient font-orbitron">Current APY</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-6xl font-bold text-neon font-orbitron animate-glow">
                {currentAPY.toFixed(1)}%
              </p>
              <p className="text-lg text-muted-foreground font-orbitron">
                Epoch {epochData.currentEpoch} Yield Rate
              </p>
              
              <div className="flex items-center justify-center gap-2 text-lg bg-green-500/10 rounded-lg py-2 px-4 border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-orbitron font-semibold">+3% Per Epoch</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Epoch APY Progression */}
        <Card className="data-panel border-2 border-cyber/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyber" />
              <h4 className="font-semibold font-orbitron text-cyber text-lg">All Epochs Overview</h4>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {epochsData.map((epoch) => (
                <div 
                  key={epoch.epoch} 
                  className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${
                    epoch.isActive 
                      ? 'border-2 border-neon bg-neon/10 shadow-lg shadow-neon/25' 
                      : 'border border-border/50 hover:border-border bg-background/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-orbitron ${
                      epoch.isActive 
                        ? 'bg-neon text-black' 
                        : 'bg-border text-foreground'
                    }`}>
                      {epoch.epoch}
                    </div>
                    <div>
                      <span className={`text-lg font-orbitron font-bold ${
                        epoch.isActive ? 'text-neon' : 'text-foreground'
                      }`}>
                        Epoch {epoch.epoch}
                      </span>
                      {epoch.isActive && (
                        <div className="text-xs px-2 py-1 rounded bg-neon/20 text-neon font-semibold mt-1">
                          ACTIVE NOW
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold font-orbitron ${
                      epoch.isActive ? 'text-neon' : 'text-cyber'
                    }`}>
                      {epoch.apy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground font-orbitron">
                      {(epoch.rewards / 1000).toFixed(0)}K $AIR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Strategy Section */}
        <Card className="data-panel bg-gradient-to-br from-primary/20 via-neon/10 to-cyber/20 border-2 border-gradient-to-r border-primary/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-gradient animate-glow" />
              <h4 className="font-bold font-orbitron text-gradient text-xl">Strategic Advantage Matrix</h4>
            </div>
            <div className="text-sm space-y-3">
              <p className="text-muted-foreground font-orbitron">
                11 Epochs • 3 Days Each • Dynamic APY Scaling • Limited Time Windows
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-green-500/20 border-2 border-green-500/40">
                  <div className="font-bold text-green-400 mb-2 font-orbitron">🚀 Early Entry</div>
                  <div className="text-xs text-green-300">Epochs 1-3: 200K $AIR</div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/20 border-2 border-yellow-500/40">
                  <div className="font-bold text-yellow-400 mb-2 font-orbitron">⚡ Mid Phase</div>
                  <div className="text-xs text-yellow-300">Epochs 4-8: Scaling Rewards</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/20 border-2 border-red-500/40">
                  <div className="font-bold text-red-400 mb-2 font-orbitron">⏰ Final Call</div>
                  <div className="text-xs text-red-300">Epochs 9-11: 25K $AIR</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-neon/10 border border-neon/30">
                <p className="text-xs text-neon font-orbitron font-semibold">
                  💡 Strategy: Higher APY comes with lower total rewards. Early epochs = Maximum allocation advantage.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};