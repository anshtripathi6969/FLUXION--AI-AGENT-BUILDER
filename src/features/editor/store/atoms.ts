import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export interface ActiveExecutionState {
  workflowId: string;
  executionId: string | null;
  startedAt: number;
  version: number;
}

export const editorAtom = atom<ReactFlowInstance | null>(null);

export const activeExecutionAtom = atom<ActiveExecutionState | null>(null);

export const executionNodeStatusesAtom = atom<Record<string, NodeStatus>>({});

export const executionRunVersionAtom = atom<number>(0);
