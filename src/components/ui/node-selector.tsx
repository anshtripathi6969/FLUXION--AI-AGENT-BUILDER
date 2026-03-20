"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
  GlobeIcon,
  MousePointerIcon,
  SearchIcon,
  ZapIcon,
  PlayIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
  color: string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
    color: "bg-blue-500/10 text-blue-500",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request to any API or webhook",
    icon: GlobeIcon,
    color: "bg-orange-500/10 text-orange-500",
  },
];


interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function NodeSelector({
  open,
  onOpenChange,
  children
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const [search, setSearch] = useState("");

  const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
    // Check if trying to add a manual trigger when one already exists
    if (selection.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes();
      const hasManualTrigger = nodes.some(
        (node) => node.type === NodeType.MANUAL_TRIGGER,
      );

      if (hasManualTrigger) {
        toast.error("Only one manual trigger is allowed per workflow");
        return;
      }
    }

    setNodes((nodes) => {
      const hasInitialTrigger = nodes.some(
        (node) => node.type === NodeType.INITIAL,
      );

      // Position new node roughly in the center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const flowPosition = screenToFlowPosition({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      });

      const newNode = {
        id: createId(),
        data: {},
        position: flowPosition,
        type: selection.type,
      };

      // If we still have the placeholder "Initial" node, replace it
      if (hasInitialTrigger) {
        return [newNode] as any;
      }

      return [...nodes, newNode] as any;
    });

    toast.success(`${selection.label} added to workflow`);
    onOpenChange(false);
  }, [
    setNodes,
    getNodes,
    onOpenChange,
    screenToFlowPosition,
  ]);

  const filteredTriggers = triggerNodes.filter(n => 
    n.label.toLowerCase().includes(search.toLowerCase()) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExecutions = executionNodes.filter(n => 
    n.label.toLowerCase().includes(search.toLowerCase()) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0 flex flex-col h-full bg-[#09090b] border-l border-white/5 shadow-2xl">
        <div className="p-8 pb-6">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-2xl font-bold flex items-center gap-3 text-white tracking-tight">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                 <ZapIcon className="size-5 text-primary animate-pulse" />
              </div>
              Add a New Step
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400/80 mt-2">
              Select a trigger or action to add to your automated workflow. Search 100+ integrations or custom tools.
            </SheetDescription>
          </SheetHeader>

          <div className="relative mt-2">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input 
              placeholder="Search steps and integrations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white/5 border-white/10 hover:border-white/20 transition-all ring-offset-background focus-visible:ring-1 focus-visible:ring-primary text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar">
          {filteredTriggers.length > 0 && (
            <section>
              <div className="px-4 mb-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <PlayIcon className="size-3 fill-current" />
                  Triggers
                </h3>
              </div>
              <div className="grid gap-2">
                {filteredTriggers.map((nodeType) => (
                  <NodeItem key={nodeType.type} nodeType={nodeType} onSelect={handleNodeSelect} />
                ))}
              </div>
            </section>
          )}

          {filteredExecutions.length > 0 && (
            <section>
              <div className="px-4 mb-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ZapIcon className="size-3 fill-current" />
                  Actions & Logic
                </h3>
              </div>
              <div className="grid gap-2">
                {filteredExecutions.map((nodeType) => (
                  <NodeItem key={nodeType.type} nodeType={nodeType} onSelect={handleNodeSelect} />
                ))}
              </div>
            </section>
          )}

          {filteredTriggers.length === 0 && filteredExecutions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center px-10 animate-in fade-in zoom-in duration-300">
              <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                <SearchIcon className="size-8 text-slate-600" />
              </div>
              <p className="text-lg font-semibold text-white">No results found</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">We couldn't find any steps matching "{search}". Try searching for categories like "HTTP" or "Trigger".</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <p className="text-[10px] text-center text-slate-500 font-medium tracking-wide uppercase">
                Powered by AI Automation Engine
            </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NodeItem({ nodeType, onSelect }: { nodeType: NodeTypeOption; onSelect: (n: NodeTypeOption) => void }) {
  const Icon = nodeType.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(nodeType)}
      className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-200 group text-left border border-transparent hover:border-white/10 hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r-full" />
      
      <div className={cn("size-12 shrink-0 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 duration-300 shadow-lg border border-white/10", nodeType.color)}>
        {typeof Icon === "string" ? (
          <Image src={Icon} alt={nodeType.label} width={24} height={24} className="object-contain" />
        ) : (
          <Icon className="size-6" />
        )}
      </div>
      <div className="flex flex-col overflow-hidden space-y-1">
        <span className="font-bold text-[15px] text-white group-hover:text-primary transition-colors">
          {nodeType.label}
        </span>
        <span className="text-[12px] text-slate-400/90 leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
          {nodeType.description}
        </span>
      </div>
      
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-300">
          <PlayIcon className="size-4 text-primary fill-current" />
      </div>
    </button>
  );
}