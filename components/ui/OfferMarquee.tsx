import React from 'react';

export default function OfferMarquee({ messages }: { messages: string[] }) {
  if (!messages?.length) {
    return null;
  }

  const trackItems = [...messages, ...messages];

  return (
    <section className="w-full overflow-hidden rounded-[5px] border border-blue-950/10 bg-gradient-to-r from-[#0c4a9e] via-[#0c4a9e]/90 to-[#005e7d] px-4 py-3 shadow-[0_18px_40px_-20px_rgba(12,74,158,0.8)]">
      <div className="relative overflow-hidden">
        <div className="flex min-w-max items-center gap-6 animate-marquee">
          {trackItems.map((text, index) => (
            <span
              key={`${text}-${index}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-sm shadow-white/10"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
