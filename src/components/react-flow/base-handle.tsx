import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "size-3.5 rounded-full border-2 border-[#09090b] bg-slate-400 transition-all duration-300",
        "hover:scale-125 hover:border-primary hover:bg-primary shadow-[0_0_15px_rgba(0,0,0,0.6)]",
        "after:absolute after:inset-[-10px] after:content-[''] after:cursor-crosshair", // Larger hit area
        className,
      )}
    >
      {children}
    </Handle>
  );
}
