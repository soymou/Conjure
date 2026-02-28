import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
}

export function PageHeader({ icon, title, description, meta }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
        {icon}
      </div>
      <div>
        <h1 className="text-[16px] font-semibold text-fg">{title}</h1>
        {description && <p className="text-2xs text-fg-4">{description}</p>}
      </div>
      {meta && <div className="ml-auto text-2xs text-fg-4">{meta}</div>}
    </div>
  );
}
