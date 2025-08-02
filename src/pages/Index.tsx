import { DashboardHeader } from '@/components/DashboardHeader';
import { TokenStats } from '@/components/TokenStats';
import { EpochTracker } from '@/components/EpochTracker';
import { APYStats } from '@/components/APYStats';
import { Leaderboard } from '@/components/Leaderboard';
import { ChartsSection } from '@/components/ChartsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto p-4 space-y-6">
        {/* Header */}
        <DashboardHeader />
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <TokenStats />
            <APYStats />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <EpochTracker />
            <Leaderboard />
          </div>
        </div>
        
        {/* Full Width Charts */}
        <ChartsSection />
        
        {/* Footer */}
        <div className="retro-window">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-orbitron">
              Ethereum OS Dashboard v2.1.0 - Built for the DePIN Future
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Contract: 0x8164b40840418c77a68f6f9eedb5202b36d8b288 | Network: Base Mainnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
