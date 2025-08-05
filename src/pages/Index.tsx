import { DashboardHeader } from "@/components/DashboardHeader";

import { EpochTracker } from "@/components/EpochTracker";
import { APYStats } from "@/components/APYStats";

import { DexscreenerWidget } from "@/components/DexscreenerWidget";
import { SentimentVoting } from "@/components/SentimentVoting";





const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="space-y-8">
            <APYStats />
          </div>
          
          <div className="space-y-8">
            <EpochTracker />
            <SentimentVoting />
          </div>
          
          <div className="space-y-8">
            <DexscreenerWidget />
          </div>
        </div>
        
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p className="mb-2">ETH OS Dashboard v3.0.0 • Ethereum Network • Real-time Analytics</p>
          <p className="text-xs">
            made by{' '}
            <a 
              href="https://twitter.com/Marshipv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              @Marshipv
            </a>
            {' '}❤️
          </p>
        </footer>
      </div>
    </div>
  );
};


export default Index;
