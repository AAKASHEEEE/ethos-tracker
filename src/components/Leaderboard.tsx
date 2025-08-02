import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Trophy, Medal, Star } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  amount: number;
  percentage?: number;
}

export const Leaderboard = () => {
  const [topClaimers, setTopClaimers] = useState<LeaderboardEntry[]>([
    { rank: 1, address: '0x1a2b...3c4d', amount: 156789.45 },
    { rank: 2, address: '0x5e6f...7g8h', amount: 134567.89 },
    { rank: 3, address: '0x9i0j...1k2l', amount: 123456.78 },
    { rank: 4, address: '0x3m4n...5o6p', amount: 98765.43 },
    { rank: 5, address: '0x7q8r...9s0t', amount: 87654.32 }
  ]);

  const [topHolders, setTopHolders] = useState<LeaderboardEntry[]>([
    { rank: 1, address: '0x2b3c...4d5e', amount: 2456789.12, percentage: 24.5 },
    { rank: 2, address: '0x6f7g...8h9i', amount: 1234567.89, percentage: 12.3 },
    { rank: 3, address: '0x0j1k...2l3m', amount: 987654.32, percentage: 9.8 },
    { rank: 4, address: '0x4n5o...6p7q', amount: 765432.10, percentage: 7.6 },
    { rank: 5, address: '0x8r9s...0t1u', amount: 543210.98, percentage: 5.4 }
  ]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/30';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'bg-gradient-to-r from-secondary/50 to-muted/50 border-border';
    }
  };

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">User Leaderboard</h2>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="claimers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary border border-border">
            <TabsTrigger value="claimers" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Top Claimers
            </TabsTrigger>
            <TabsTrigger value="holders" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Top Holders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="claimers" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gradient font-orbitron">
                Highest $AIR Claimers
              </h3>
              <p className="text-sm text-muted-foreground">
                Users with the most claimed tokens
              </p>
            </div>
            
            <div className="space-y-3">
              {topClaimers.map((entry) => (
                <Card 
                  key={entry.rank} 
                  className={`p-4 transition-all duration-300 hover:scale-[1.02] ${getRankStyle(entry.rank)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="text-lg font-bold font-orbitron">#{entry.rank}</span>
                      </div>
                      <div>
                        <p className="font-mono text-cyber">{formatAddress(entry.address)}</p>
                        <p className="text-xs text-muted-foreground">Wallet Address</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-neon font-orbitron">
                        {formatNumber(entry.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">$AIR Claimed</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="holders" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gradient font-orbitron">
                Largest $AIR Holders
              </h3>
              <p className="text-sm text-muted-foreground">
                Users with the highest token balances
              </p>
            </div>
            
            <div className="space-y-3">
              {topHolders.map((entry) => (
                <Card 
                  key={entry.rank} 
                  className={`p-4 transition-all duration-300 hover:scale-[1.02] ${getRankStyle(entry.rank)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="text-lg font-bold font-orbitron">#{entry.rank}</span>
                      </div>
                      <div>
                        <p className="font-mono text-cyber">{formatAddress(entry.address)}</p>
                        <p className="text-xs text-muted-foreground">Wallet Address</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-neon font-orbitron">
                        {formatNumber(entry.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">$AIR Held</p>
                        {entry.percentage && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-orbitron">
                            {entry.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {entry.percentage && (
                    <div className="mt-3">
                      <div className="progress-neon h-2">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Additional Stats */}
        <Card className="data-panel mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-cyber font-orbitron">156</p>
              <p className="text-xs text-muted-foreground">Total Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon font-orbitron">89.2%</p>
              <p className="text-xs text-muted-foreground">Participation Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyber font-orbitron">2.4M</p>
              <p className="text-xs text-muted-foreground">Total Claimed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon font-orbitron">$6.2K</p>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};