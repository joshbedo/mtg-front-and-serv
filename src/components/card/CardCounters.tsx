import React from 'react';

interface CardCountersProps {
  counters: Array<{ id: string; count: number }>;
}

export function CardCounters({ counters }: CardCountersProps) {
  return (
    <div className="absolute -bottom-1 left-0 right-0 flex justify-center items-center gap-1">
      {counters.map((counter) => (
        <div
          key={counter.id}
          className="w-6 h-6 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white/20"
        >
          {counter.count}
        </div>
      ))}
    </div>
  );
}