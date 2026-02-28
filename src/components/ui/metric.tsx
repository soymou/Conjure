import type { ReactNode } from "react";

interface MetricProps {
  label: string;
  value: ReactNode;
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg font-semibold text-fg">{value}</p>
      <p className="text-2xs text-fg-4">{label}</p>
    </div>
  );
}
