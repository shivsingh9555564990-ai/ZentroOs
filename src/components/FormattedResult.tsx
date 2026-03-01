import { memo } from 'react';

interface FormattedResultProps { text: string; accentColor: string; }

function FormattedResult({ text, accentColor }: FormattedResultProps) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        if (/^[━─\-=]{3,}$/.test(trimmed)) {
          return <div key={i} className="py-1"><div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} /></div>;
        }

        if (/^[🔥🎯💎📋💡🏆📌📝⏱️🔗🔔🏷️📊📈📏💪✍️#️⃣]/.test(trimmed) && (trimmed.includes(':') || /^[🏆🔥📊]/.test(trimmed)) && trimmed.length < 100) {
          const ci = trimmed.indexOf(':');
          if (ci > 0 && ci < 40) {
            return (
              <div key={i} className="pt-3 pb-1">
                <span className="text-[14px] font-bold tracking-tight" style={{ color: accentColor }}>{trimmed.slice(0, ci + 1)}</span>
                {trimmed.slice(ci + 1).trim() && <span className="text-[14px] font-semibold text-white ml-1.5">{trimmed.slice(ci + 1).trim()}</span>}
              </div>
            );
          }
          return <div key={i} className="pt-3 pb-1"><span className="text-[14px] font-bold tracking-tight" style={{ color: accentColor }}>{trimmed}</span></div>;
        }

        if (/^\d{1,2}[\.\\)]\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d{1,2})[\.\\)]\s+(.*)$/);
          if (match) {
            return (
              <div key={i} className="flex gap-2.5 py-1.5 pl-1 items-start">
                <span className="text-[12px] font-bold mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30` }}>{match[1]}</span>
                <span className="text-[14px] font-semibold text-white leading-relaxed flex-1">{renderInline(match[2], accentColor)}</span>
              </div>
            );
          }
        }

        if (/^[•\-\*]\s/.test(trimmed)) {
          return (
            <div key={i} className="flex gap-2.5 py-0.5 pl-2 items-start">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
              <span className="text-[13px] text-gray-300 leading-relaxed flex-1">{renderInline(trimmed.replace(/^[•\-\*]\s+/, ''), accentColor)}</span>
            </div>
          );
        }

        if ((trimmed.match(/#\w/g) || []).length >= 2) {
          return (
            <div key={i} className="flex flex-wrap gap-1.5 py-1">
              {trimmed.split(/(\s+)/).map((part, j) => {
                if (part.startsWith('#') && part.length > 1) {
                  return <span key={j} className="inline-block px-2.5 py-1 rounded-lg text-[12px] font-semibold"
                    style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}20` }}>{part}</span>;
                }
                return part.trim() ? <span key={j} className="text-[12px] text-gray-400 self-center">{part}</span> : null;
              })}
            </div>
          );
        }

        if (/^🏆/.test(trimmed)) {
          return (
            <div key={i} className="mt-3 p-3 rounded-xl" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}25`, boxShadow: `0 0 20px -8px ${accentColor}30` }}>
              <span className="text-[13px] font-bold text-white leading-relaxed">{renderInline(trimmed, accentColor)}</span>
            </div>
          );
        }

        if (/^\d{1,2}:\d{2}\s*[-–]/.test(trimmed)) {
          const match = trimmed.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(.*)$/);
          if (match) {
            return (
              <div key={i} className="flex gap-3 py-0.5 pl-1 items-center">
                <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: `${accentColor}15`, color: accentColor }}>{match[1]}</span>
                <span className="text-[13px] text-gray-300 font-medium">{match[2]}</span>
              </div>
            );
          }
        }

        if (trimmed.includes('⭐')) {
          return <div key={i} className="py-0.5 pl-1"><span className="text-[13px] text-amber-400 font-medium">{trimmed}</span></div>;
        }

        return <div key={i} className="py-0.5"><span className="text-[13px] text-gray-300 leading-relaxed font-medium">{renderInline(trimmed, accentColor)}</span></div>;
      })}
    </div>
  );
}

function renderInline(text: string, accent: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <span key={i} className="font-bold" style={{ color: accent }}>{p.slice(2, -2)}</span>;
    }
    return p;
  });
}

export default memo(FormattedResult);
