import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  colorScheme = 'blue',
  badgeText
}) => {
  return (
    <div className="charcoal-glass-card rounded-2xl border border-white/15 p-5 shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              {title}
            </span>
            {badgeText && (
              <span className="charcoal-pill px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                {badgeText}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-[11px] text-zinc-400 font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
            <Icon className="w-5 h-5 drop-shadow-[0_0_6px_#ffffff]" />
          </div>
        )}
      </div>

      {trendLabel && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono">
          {trend === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-sky-300" />
          )}
          <span className={trend === 'up' ? 'text-emerald-400 font-semibold' : 'text-zinc-300 font-semibold'}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};
