import React, { useState, useEffect } from 'react';

function HackathonTimer({ endsAt }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endsAt.toMillis() - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsExpired(true);
        setTimeLeft("TIME'S UP");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className={`font-mono text-xl font-bold px-4 py-2 rounded-lg flex items-center gap-2 ${isExpired ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-green-400'}`}>
      <span className="animate-pulse">🔴</span>
      {timeLeft}
    </div>
  );
}

export default HackathonTimer;