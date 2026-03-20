"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
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
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.filter((node) => node.id !== id);
        return updatedNodes;
      });

      setEdges((currentEdges) => {
        const updatedEdges = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        return updatedEdges;
      });
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-2xl"
        >
          <BaseNode status={status} onDoubleClick={onDoubleClick} className="w-[280px] rounded-2xl relative group overflow-hidden">
            <BaseNodeContent className="p-0">
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border-b border-orange-500/20">
                <div className="size-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16} height={16} />
                  ) : (
                    <Icon className="size-4 text-orange-500" />
                  )}
                </div>
                <span className="text-[13px] font-bold text-white tracking-tight leading-none">
                  {name}
                </span>
              </div>

              <div className="p-4 bg-white/[0.01]">
                {description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {description}
                  </p>
                )}
                {children}
              </div>

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
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    )
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";