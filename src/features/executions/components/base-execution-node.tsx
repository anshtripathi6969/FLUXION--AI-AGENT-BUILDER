"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { 
  BaseNode, 
  BaseNodeContent, 
  BaseNodeHeader, 
  BaseNodeHeaderTitle 
} from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    // TODO: add delete method
    const handleDelete = () => {};

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <BaseNode onDoubleClick={onDoubleClick} className="w-[280px] rounded-2xl group">
          <BaseNodeHeader className="bg-orange-500/10 border-b border-orange-500/20 py-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {typeof Icon === "string" ? (
                  <Image src={Icon} alt={name} width={18} height={18} />
                ) : (
                  <Icon className="size-4 text-orange-500" />
                )}
              </div>
              <BaseNodeHeaderTitle className="text-[13px] font-bold text-white tracking-tight">
                {name}
              </BaseNodeHeaderTitle>
            </div>
          </BaseNodeHeader>
          
          <BaseNodeContent className="p-4 bg-white/[0.01]">
            {description && (
               <p className="text-[11px] text-slate-400 leading-relaxed mb-2 font-medium">
                  {description}
               </p>
            )}
            {children}
          </BaseNodeContent>
          <BaseHandle
            id="target-1"
            type="target"
            position={Position.Left}
          />
          <BaseHandle
            id="source-1"
            type="source"
            position={Position.Right}
            className="bg-orange-500"
          />
        </BaseNode>
      </WorkflowNode>
    )
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";