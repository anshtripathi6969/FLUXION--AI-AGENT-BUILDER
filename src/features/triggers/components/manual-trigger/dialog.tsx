"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MousePointerIcon, InfoIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ManualTriggerDialog = ({
  open,
  onOpenChange
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#09090b]/80 backdrop-blur-xl border-white/10 shadow-2xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                 <MousePointerIcon className="size-6 text-blue-500 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">Manual Trigger</DialogTitle>
                <DialogDescription className="text-sm text-slate-400 mt-1">
                  Configure settings for this entry point
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex gap-4 transition-all hover:bg-white/[0.05]">
              <div className="shrink-0 size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                <InfoIcon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">No Configuration Needed</p>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  This node allows you to manually execute your workflow from the dashboard. Once activated, any steps connected to it will be processed sequentially.
                </p>
              </div>
            </div>

            <div className="pt-2">
               <p className="text-[10px] text-center text-slate-500 font-medium tracking-widest uppercase">
                  fluxion automation system
               </p>
            </div>
          </div>
        </div>
        
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 size-48 bg-blue-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-48 bg-primary/10 blur-[80px] pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
};