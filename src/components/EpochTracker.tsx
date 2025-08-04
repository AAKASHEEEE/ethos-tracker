useEffect(() => {
  const calculateTimeLeft = () => {
    // Epoch 2 started: August 1, 2025, 10:45 PM IST == 17:15 UTC
    const epoch2Start = new Date('2025-08-01T17:15:00Z').getTime();
    const epochDuration = 3 * 24 * 60 * 60 * 1000; // 3 days

    const now = Date.now();
    const timeSinceEpoch2 = now - epoch2Start;
    const epochsElapsed = Math.floor(timeSinceEpoch2 / epochDuration);
    const currentEpoch = Math.min(2 + epochsElapsed, 11);

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
        currentEpoch,
        timeLeft: { days, hours, minutes, seconds },
        progressPercentage: Math.round(Math.max(0, progress)),
        epochStartTime: new Date(currentEpochStart),
        epochEndTime: new Date(currentEpochEnd)
      }));
    }
  };

  calculateTimeLeft();
  const interval = setInterval(calculateTimeLeft, 1000);

  return () => clearInterval(interval);
}, []);
