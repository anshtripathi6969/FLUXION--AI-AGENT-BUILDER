"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import "@xyflow/react/dist/style.css";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "sonner";
import { nodeComponents } from "@/config/node-components";
import { useTRPC } from "@/trpc/client";
import {
  activeExecutionAtom,
  editorAtom,
  executionNodeStatusesAtom,
} from "../store/atoms";
import { AddNodeButton } from "./add-node-button";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

function ExecutionStatusSync({ workflowId }: { workflowId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [activeExecution, setActiveExecution] = useAtom(activeExecutionAtom);
  const setExecutionNodeStatuses = useSetAtom(executionNodeStatusesAtom);
  const [completedToastId, setCompletedToastId] = useState<string | null>(null);

  const isTrackingThisWorkflow = activeExecution?.workflowId === workflowId;
  const trackedExecutionId = isTrackingThisWorkflow
    ? (activeExecution.executionId ?? undefined)
    : undefined;
  const isWaitingForNewExecutionId =
    isTrackingThisWorkflow && !trackedExecutionId;

  // Clear stale node statuses when opening a different workflow
  useEffect(() => {
    setExecutionNodeStatuses({});
    setCompletedToastId(null);
    setActiveExecution((prev) =>
      prev && prev.workflowId !== workflowId ? null : prev,
    );
  }, [workflowId, setExecutionNodeStatuses, setActiveExecution]);

  const { data: latestExecution } = useQuery({
    ...trpc.executions.getLatestByWorkflow.queryOptions({
      workflowId,
      executionId: trackedExecutionId,
    }),
    enabled: !isWaitingForNewExecutionId,
    refetchInterval: (query) => {
      const exec = query.state.data;
      if (isTrackingThisWorkflow && trackedExecutionId) {
        if (!exec || exec.status === ExecutionStatus.RUNNING) {
          return 500;
        }
        return false;
      }
      if (exec?.status === ExecutionStatus.RUNNING) {
        return 1000;
      }
      return false;
    },
  });

  useEffect(() => {
    if (isWaitingForNewExecutionId || !latestExecution) {
      return;
    }

    const isMatchingTracked =
      isTrackingThisWorkflow &&
      trackedExecutionId &&
      latestExecution.id === trackedExecutionId;

    const isRecentRunning =
      latestExecution.status === ExecutionStatus.RUNNING &&
      Date.now() - new Date(latestExecution.startedAt).getTime() <
        15 * 60 * 1000;

    if (!isTrackingThisWorkflow && isRecentRunning) {
      setActiveExecution((prev) =>
        prev?.workflowId === workflowId
          ? prev
          : {
              workflowId,
              executionId: latestExecution.id,
              startedAt: new Date(latestExecution.startedAt).getTime(),
              version: 0,
            },
      );
    }

    if (isMatchingTracked || isRecentRunning) {
      setExecutionNodeStatuses(latestExecution.nodeStatuses);
    }

    if (
      isMatchingTracked &&
      completedToastId !== latestExecution.id &&
      latestExecution.status !== ExecutionStatus.RUNNING
    ) {
      setCompletedToastId(latestExecution.id);
      queryClient.invalidateQueries({
        queryKey: trpc.executions.getMany.queryKey(),
      });
      if (latestExecution.status === ExecutionStatus.SUCCESS) {
        toast.success("Workflow completed successfully");
      } else if (latestExecution.status === ExecutionStatus.FAILED) {
        toast.error(
          latestExecution.error
            ? `Workflow failed: ${latestExecution.error}`
            : "Workflow execution failed",
        );
      }
    }
  }, [
    isWaitingForNewExecutionId,
    latestExecution,
    isTrackingThisWorkflow,
    trackedExecutionId,
    workflowId,
    completedToastId,
    setActiveExecution,
    setExecutionNodeStatuses,
    queryClient,
    trpc.executions.getMany,
  ]);

  return null;
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ExecutionStatusSync workflowId={workflowId} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls className="text-black" />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
