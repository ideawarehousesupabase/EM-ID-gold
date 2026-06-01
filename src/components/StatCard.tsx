import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="luxury-border bg-card rounded-lg p-6 relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="mt-3 text-4xl font-display gold-text-gradient">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-2">{hint}</div>}
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-md bg-accent/60 flex items-center justify-center text-gold">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
