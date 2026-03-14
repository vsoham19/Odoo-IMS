"use client";

import { Badge } from "@/components/ui/badge";
import { OperationStatus } from "@/types/inventory";

interface OperationStatusBadgeProps {
  status: OperationStatus | string;
}

export function OperationStatusBadge({ status }: OperationStatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-semibold shadow-sm">
          Draft
        </Badge>
      );
    case "waiting":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold shadow-sm">
          Waiting
        </Badge>
      );
    case "ready":
      return (
        <Badge variant="outline" className="bg-[#017E84]/10 text-[#017E84] border-[#017E84]/20 font-semibold shadow-sm">
          Ready
        </Badge>
      );
    case "done":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold shadow-sm">
          Done
        </Badge>
      );
    case "cancel":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 font-semibold shadow-sm">
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-semibold">{status}</Badge>
      );
  }
}
