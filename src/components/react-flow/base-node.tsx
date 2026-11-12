import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { NodeStatus } from "./node-status-indicator";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  status?: NodeStatus;
}

export const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ className, status, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[#09090b]/90 backdrop-blur-sm text-white relative rounded-2xl border border-white/10 shadow-xl transition-all duration-300",
        "hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-0.5",
        "[.react-flow\\_\\_node.selected_&]:border-primary/50",
        "[.react-flow\\_\\_node.selected_&]:ring-4",
        "[.react-flow\\_\\_node.selected_&]:ring-primary/10",
        "[.react-flow\\_\\_node.selected_&]:shadow-[0_0_20px_rgba(var(--primary),0.15)]",
        className,
      )}
      {...props}
    >
      {props.children}
      {status === "error" && (
        <div
          title="Execution failed"
          className="pointer-events-none absolute right-3 top-3.5 z-30 flex size-7 items-center justify-center rounded-full border border-red-400/60 bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.45)]"
        >
          <XCircleIcon className="size-4 text-red-400 stroke-[2.5]" />
        </div>
      )}
      {status === "success" && (
        <div
          title="Executed successfully"
          className="pointer-events-none absolute right-3 top-3.5 z-30 flex size-7 items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/20 shadow-[0_0_14px_rgba(16,185,129,0.55)]"
        >
          <CheckCircle2Icon className="size-4 text-emerald-400 stroke-[2.75]" />
        </div>
      )}
      {status === "loading" && (
        <div
          title="Executing..."
          className="pointer-events-none absolute right-3 top-3.5 z-30 flex size-7 items-center justify-center rounded-full border border-blue-400/60 bg-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.45)]"
        >
          <Loader2Icon className="size-4 text-blue-400 stroke-[2.5] animate-spin" />
        </div>
      )}
    </div>
  ),
);
BaseNode.displayName = "BaseNode";

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const BaseNodeHeader = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    {...props}
    className={cn(
      "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
      // Remove or modify these classes if you modify the padding in the
      // `<BaseNode />` component.
      className,
    )}
  />
));
BaseNodeHeader.displayName = "BaseNodeHeader";

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const BaseNodeHeaderTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="base-node-title"
    className={cn("user-select-none flex-1 font-semibold", className)}
    {...props}
  />
));
BaseNodeHeaderTitle.displayName = "BaseNodeHeaderTitle";

export const BaseNodeContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-content"
    className={cn("flex flex-col gap-y-2 p-3", className)}
    {...props}
  />
));
BaseNodeContent.displayName = "BaseNodeContent";

export const BaseNodeFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-footer"
    className={cn(
      "flex flex-col items-center gap-y-2 border-t px-3 pb-3 pt-2",
      className,
    )}
    {...props}
  />
));
BaseNodeFooter.displayName = "BaseNodeFooter";
