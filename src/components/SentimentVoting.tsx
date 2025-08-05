import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface SentimentData {
  bullish: number;
  bearish: number;
  totalVotes: number;
  userVote: 'bullish' | 'bearish' | null;
  epochNumber: number;
}

export const SentimentVoting = () => {
  const [sentiment, setSentiment] = useState<SentimentData>({
    bullish: 342,
    bearish: 158,
    totalVotes: 500,
    userVote: null,
    epochNumber: 2
  });

  useEffect(() => {
    // Load user vote from localStorage
    const savedVote = localStorage.getItem(`sentiment-vote-epoch-${sentiment.epochNumber}`);
    if (savedVote) {
      setSentiment(prev => ({
        ...prev,
        userVote: savedVote as 'bullish' | 'bearish'
      }));
    }
  }, [sentiment.epochNumber]);

  const handleVote = (vote: 'bullish' | 'bearish') => {
    if (sentiment.userVote === vote) return; // Already voted this way
    
    setSentiment(prev => {
      let newBullish = prev.bullish;
      let newBearish = prev.bearish;
      let newTotal = prev.totalVotes;
      
      // Remove previous vote if exists
      if (prev.userVote === 'bullish') {
        newBullish--;
        newTotal--;
      } else if (prev.userVote === 'bearish') {
        newBearish--;
        newTotal--;
      }
      
      // Add new vote
      if (vote === 'bullish') {
        newBullish++;
      } else {
        newBearish++;
      }
      newTotal++;
      
      return {
        ...prev,
        bullish: newBullish,
        bearish: newBearish,
        totalVotes: newTotal,
        userVote: vote
      };
    });
    
    // Save vote to localStorage
    localStorage.setItem(`sentiment-vote-epoch-${sentiment.epochNumber}`, vote);
  };

  const bullishPercentage = sentiment.totalVotes > 0 ? (sentiment.bullish / sentiment.totalVotes) * 100 : 0;
  const bearishPercentage = sentiment.totalVotes > 0 ? (sentiment.bearish / sentiment.totalVotes) * 100 : 0;

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">Community Sentiment</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Voting Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleVote('bullish')}
            disabled={sentiment.userVote === 'bullish'}
            className={`neon-button-green flex items-center justify-center gap-3 py-4 ${
              sentiment.userVote === 'bullish' 
                ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                : ''
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Bullish</span>
            {sentiment.userVote === 'bullish' && (
              <span className="text-xs">✓</span>
            )}
          </button>
          
          <button
            onClick={() => handleVote('bearish')}
            disabled={sentiment.userVote === 'bearish'}
            className={`neon-button-red flex items-center justify-center gap-3 py-4 ${
              sentiment.userVote === 'bearish' 
                ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                : ''
            }`}
          >
            <TrendingDown className="h-5 w-5" />
            <span>Bearish</span>
            {sentiment.userVote === 'bearish' && (
              <span className="text-xs">✓</span>
            )}
          </button>
        </div>

        {/* Results */}
        <Card className="data-panel">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold font-orbitron text-foreground">
                Epoch {sentiment.epochNumber} Results
              </h3>
            </div>
            
            {/* Progress Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Bullish
                  </span>
                  <span className="text-sm font-bold text-green-400">
                    {bullishPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-neon h-3">
                  <div 
                    className="progress-fill h-full bg-gradient-to-r from-green-500 to-green-400"
                    style={{ width: `${bullishPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {sentiment.bullish} votes
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-red-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Bearish
                  </span>
                  <span className="text-sm font-bold text-red-400">
                    {bearishPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-neon h-3">
                  <div 
                    className="progress-fill h-full bg-gradient-to-r from-red-500 to-red-400"
                    style={{ width: `${bearishPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {sentiment.bearish} votes
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Total Votes: <span className="font-bold text-foreground">{sentiment.totalVotes}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Voting resets with each new epoch
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};