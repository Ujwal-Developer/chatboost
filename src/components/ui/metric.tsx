import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  delta,
  className
}: {
  label: string;
  value: string;
  delta?: string;
  className?: string;
}) {
  return (
    <div className={cn("surface rounded-lg p-5", className)}>
      <p className="text-sm text-white/56">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-2xl font-semibold tracking-normal text-white">{value}</strong>
        {delta ? <span className="rounded-full bg-mint/12 px-2 py-1 text-xs font-medium text-mint">{delta}</span> : null}
      </div>
    </div>
  );
}
