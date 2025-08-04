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
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    progressPercentage: 0,
    epochStartTime: new Date(),
    epochEndTime: new Date(),
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
        totalEpochs: 11,
        timeLeft: { days, hours, minutes, seconds },
        progressPercentage: Math.round(progress),
        epochStartTime: new Date(currentStart),
        epochEndTime: new Date(currentEnd),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">Epoch Tracker</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Epoch Number & Progress */}
        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-3xl font-bold text-primary font-orbitron">
                Epoch {epochData.currentEpoch} / {epochData.totalEpochs}
              </h3>
            </div>
            <div className="progress-neon h-6">
              <div
                className="progress-fill flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${epochData.progressPercentage}%` }}
              >
                {epochData.progressPercentage}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Progress: {epochData.progressPercentage}%
            </p>
          </div>
        </Card>

        {/* Countdown */}
        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-primary font-orbitron">Time Remaining</h4>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['DAYS', 'HOURS', 'MINS', 'SECS'].map((label, i) => (
                <div key={label} className="text-center">
                  <div className="neon-button p-3">
                    <p className="text-2xl font-bold font-orbitron text-foreground">
                      {formatTime(Object.values(epochData.timeLeft)[i])}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-orbitron">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* UTC Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch Start (UTC)</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochStartTime.toUTCString()}
            </p>
          </Card>

          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch End (UTC)</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochEndTime.toUTCString()}
            </p>
          </Card>
        </div>

        {/* Next Epoch */}
        <Card className="data-panel">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-green-400 font-orbitron">
              Next: Epoch {epochData.currentEpoch + 1}
            </h4>
            <p className="text-sm text-muted-foreground">
              Rewards in {epochData.timeLeft.days}d {epochData.timeLeft.hours}h
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
