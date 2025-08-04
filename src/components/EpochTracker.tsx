import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, Zap } from 'lucide-react';

interface EpochData {
  currentEpoch: number;
  totalEpochs: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  progressPercentage: number;
  epochStartTime: Date;
  epochEndTime: Date;
}

export const EpochTracker = () => {
  const [epochData, setEpochData] = useState<EpochData>({
    currentEpoch: 2,
    totalEpochs: 11,
    timeLeft: { days: 14, hours: 23, minutes: 56, seconds: 45 },
    progressPercentage: 15,
    epochStartTime: new Date(),
    epochEndTime: new Date()
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Epoch 2 started: August 1, 2025, 10:45 PM
      const epoch2Start = new Date('2025-08-01T22:45:00Z').getTime();
      const epochDuration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      const now = Date.now();
      
      // Calculate which epoch we're in
      const timeSinceEpoch2 = now - epoch2Start;
      const epochsElapsed = Math.floor(timeSinceEpoch2 / epochDuration);
      const currentEpoch = Math.max(2, 2 + epochsElapsed);
      
      // Calculate current epoch times
      const currentEpochStart = epoch2Start + (epochsElapsed * epochDuration);
      const currentEpochEnd = currentEpochStart + epochDuration;
      const timeLeft = currentEpochEnd - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const progress = ((epochDuration - timeLeft) / epochDuration) * 100;

        setEpochData(prev => ({
          ...prev,
          currentEpoch: currentEpoch,
          timeLeft: { days, hours, minutes, seconds },
          progressPercentage: Math.round(Math.max(0, progress)),
          epochStartTime: new Date(currentEpochStart),
          epochEndTime: new Date(currentEpochEnd)
        }));
      } else {
        // Epoch ended, recalculate for next epoch
        const nextEpochStart = currentEpochEnd;
        const nextEpochEnd = nextEpochStart + epochDuration;
        const nextEpoch = Math.min(currentEpoch + 1, 11);
        
        setEpochData(prev => ({
          ...prev,
          currentEpoch: nextEpoch,
          timeLeft: { days: 3, hours: 0, minutes: 0, seconds: 0 },
          progressPercentage: 0,
          epochStartTime: new Date(nextEpochStart),
          epochEndTime: new Date(nextEpochEnd)
        }));
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">Epoch Tracker</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Current Epoch Display */}
        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-3xl font-bold text-primary font-orbitron">
                Epoch {epochData.currentEpoch} of {epochData.totalEpochs}
              </h3>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-neon h-6">
              <div 
                className="progress-fill flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${epochData.progressPercentage}%` }}
              >
                {epochData.progressPercentage}%
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Epoch Progress: {epochData.progressPercentage}% Complete
            </p>
          </div>
        </Card>

        {/* Countdown Timer */}
        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-primary font-orbitron">Time Remaining</h4>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="neon-button p-3">
                  <p className="text-2xl font-bold font-orbitron text-foreground">
                    {formatTime(epochData.timeLeft.days)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-orbitron">DAYS</p>
              </div>
              
              <div className="text-center">
                <div className="neon-button p-3">
                  <p className="text-2xl font-bold font-orbitron text-foreground">
                    {formatTime(epochData.timeLeft.hours)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-orbitron">HOURS</p>
              </div>
              
              <div className="text-center">
                <div className="neon-button p-3">
                  <p className="text-2xl font-bold font-orbitron text-foreground">
                    {formatTime(epochData.timeLeft.minutes)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-orbitron">MINS</p>
              </div>
              
              <div className="text-center">
                <div className="neon-button p-3">
                  <p className="text-2xl font-bold font-orbitron text-foreground">
                    {formatTime(epochData.timeLeft.seconds)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-orbitron">SECS</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Epoch Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch Start</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochStartTime.toLocaleDateString()} at{' '}
              {epochData.epochStartTime.toLocaleTimeString()}
            </p>
          </Card>
          
          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch End</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochEndTime.toLocaleDateString()} at{' '}
              {epochData.epochEndTime.toLocaleTimeString()}
            </p>
          </Card>
        </div>

        {/* Next Epoch Preview */}
        <Card className="data-panel">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-green-400 font-orbitron">Next: Epoch {epochData.currentEpoch + 1}</h4>
            <p className="text-sm text-muted-foreground">
              Estimated rewards distribution in {epochData.timeLeft.days}d {epochData.timeLeft.hours}h
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};