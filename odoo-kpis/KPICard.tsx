"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "warning" | "danger" | "success";
  loading?: boolean;
}

const variantStyles = {
  default: {
    icon: "bg-sky-500/10 text-sky-400",
    border: "border-slate-700/60",
    glow: "",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-400",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/10",
  },
  danger: {
    icon: "bg-rose-500/10 text-rose-400",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/10",
  },
  success: {
    icon: "bg-emerald-500/10 text-emerald-400",
    border: "border-emerald-500/30",
    glow: "",
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  loading = false,
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border bg-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg",
        styles.border,
        styles.glow && `shadow-md ${styles.glow}`
      )}
    >
      {/* Subtle top accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px",
          variant === "warning" && "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent",
          variant === "danger" && "bg-gradient-to-r from-transparent via-rose-400/60 to-transparent",
          variant === "success" && "bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent",
          variant === "default" && "bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
        )}
      />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
              {title}
            </p>
            {loading ? (
              <div className="h-8 w-24 rounded bg-slate-800 animate-pulse mb-1" />
            ) : (
              <p className="text-3xl font-bold text-slate-100 tabular-nums leading-none mb-1">
                {value}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1.5 truncate">{subtitle}</p>
            )}
            {trend && !loading && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.value >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-slate-600">{trend.label}</span>
              </div>
            )}
          </div>

          <div className={cn("rounded-xl p-2.5 shrink-0", styles.icon)}>
            <Icon size={20} strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
