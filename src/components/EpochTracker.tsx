"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, Zap } from "lucide-react";

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
    // ⚡ EPOCH SETTINGS
    const EPOCH_2_START_UTC = Date.UTC(2025, 7, 1, 22, 45); // August = 7 (0-indexed)
    const EPOCH_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

    const tick = () => {
      // Always get current UTC time
      const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000;

      // Calculate elapsed time since Epoch 2 start
      const elapsed = nowUTC - EPOCH_2_START_UTC;

      // How many full epochs passed
      const epochsPassed = Math.floor(elapsed / EPOCH_DURATION_MS);
      const currentEpoch = Math.min(2 + epochsPassed, 11);

      // Current Epoch boundaries
      const currentEpochStart = EPOCH_2_START_UTC + epochsPassed * EPOCH_DURATION_MS;
      const currentEpochEnd = currentEpochStart + EPOCH_DURATION_MS;

      // Remaining time in ms
      const remaining = currentEpochEnd - nowUTC;
      const clamped = Math.max(0, remaining);

      const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
      const hours = Math.floor((clamped % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((clamped % (1000 * 60)) / 1000);

      const progress = Math.min(
        100,
        ((EPOCH_DURATION_MS - clamped) / EPOCH_DURATION_MS) * 100
      );

      setEpochData({
        currentEpoch,
        totalEpochs: 11,
        timeLeft: { days, hours, minutes, seconds },
        progressPercentage: Math.round(progress),
        epochStartTime: new Date(currentEpochStart),
        epochEndTime: new Date(currentEpochEnd),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">Epoch Tracker</h2>
      </div>

      <div className="p-6 space-y-6">
        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-3xl font-bold font-orbitron">
                Epoch {epochData.currentEpoch} of {epochData.totalEpochs}
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
              Epoch Progress: {epochData.progressPercentage}%
            </p>
          </div>
        </Card>

        <Card className="data-panel">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-primary font-orbitron">
                Time Remaining
              </h4>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {["DAYS", "HOURS", "MINS", "SECS"].map((label, idx) => {
                const value =
                  idx === 0
                    ? epochData.timeLeft.days
                    : idx === 1
                    ? epochData.timeLeft.hours
                    : idx === 2
                    ? epochData.timeLeft.minutes
                    : epochData.timeLeft.seconds;

                return (
                  <div key={label} className="text-center">
                    <div className="neon-button p-3">
                      <p className="text-2xl font-bold font-orbitron text-foreground">
                        {fmt(value)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-orbitron">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch Start</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochStartTime.toUTCString()}
            </p>
          </Card>

          <Card className="data-panel">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium font-orbitron">Epoch End</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {epochData.epochEndTime.toUTCString()}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
