import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        {children}
      </StatusBorder>

      <div className="absolute inset-0 z-50 rounded-[7px] bg-background/50 backdrop-blur-sm" />
      <div className="absolute inset-0 z-50">
        <span className="absolute left-[calc(50%-1.25rem)] top-[calc(50%-1.25rem)] inline-block h-10 w-10 animate-ping rounded-full bg-blue-500/20" />

        <LoaderCircle className="absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6 animate-spin text-blue-500" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      <style>
        {`
          @keyframes fluxion-border-spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .fluxion-border-spinner {
            animation: fluxion-border-spin 1.6s linear infinite;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 160%;
            aspect-ratio: 1;
            transform-origin: center;
          }
          .fluxion-border-ring {
            padding: 2px;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }
        `}
      </style>
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "fluxion-border-ring pointer-events-none absolute -inset-[2px] z-20 overflow-hidden rounded-2xl shadow-[0_0_24px_rgba(59,130,246,0.35)]",
          className,
        )}
      >
        <div className="fluxion-border-spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,_#38bdf8_0deg,_#3b82f6_90deg,_transparent_210deg,_transparent_360deg)]" />
      </div>
    </div>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-[2px] z-20 rounded-2xl border-2 transition-all duration-300",
          className,
        )}
      />
    </div>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return (
            <BorderLoadingIndicator className={className}>
              {children}
            </BorderLoadingIndicator>
          );
        default:
          return <>{children}</>;
      }
    case "success":
      return (
        <StatusBorder
          className={cn(
            "border-emerald-500/90 shadow-[0_0_24px_rgba(16,185,129,0.32)]",
            className,
          )}
        >
          {children}
        </StatusBorder>
      );
    case "error":
      return (
        <StatusBorder
          className={cn(
            "border-red-500/90 shadow-[0_0_24px_rgba(239,68,68,0.32)]",
            className,
          )}
        >
          {children}
        </StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};
