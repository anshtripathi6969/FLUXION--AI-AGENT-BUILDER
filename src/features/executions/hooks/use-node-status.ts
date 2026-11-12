import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import {
  activeExecutionAtom,
  executionNodeStatusesAtom,
  executionRunVersionAtom,
} from "@/features/editor/store/atoms";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

const STATUS_PRIORITY: Record<NodeStatus, number> = {
  initial: 0,
  loading: 1,
  success: 2,
  error: 3,
};

function mergeNodeStatus(a: NodeStatus, b: NodeStatus): NodeStatus {
  return STATUS_PRIORITY[a] >= STATUS_PRIORITY[b] ? a : b;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  const activeExecution = useAtomValue(activeExecutionAtom);
  const executionNodeStatuses = useAtomValue(executionNodeStatusesAtom);
  const executionRunVersion = useAtomValue(executionRunVersionAtom);

  const [wsState, setWsState] = useState<{
    version: number;
    status: NodeStatus;
  }>({
    version: executionRunVersion,
    status: "initial",
  });

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const cutoffMs = activeExecution ? activeExecution.startedAt - 2000 : 0;

    // Find the latest message for this node in the current run window
    const latestMessage = data
      .filter((msg) => {
        if (
          msg.kind !== "data" ||
          msg.channel !== channel ||
          msg.topic !== topic ||
          msg.data.nodeId !== nodeId
        ) {
          return false;
        }
        if (cutoffMs > 0 && msg.createdAt) {
          return new Date(msg.createdAt).getTime() >= cutoffMs;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage?.kind === "data") {
      const next = latestMessage.data.status as NodeStatus;
      setWsState((prev) => {
        const baseStatus: NodeStatus =
          prev.version === executionRunVersion ? prev.status : "initial";
        return {
          version: executionRunVersion,
          status: mergeNodeStatus(baseStatus, next),
        };
      });
    }
  }, [data, nodeId, channel, topic, activeExecution, executionRunVersion]);

  const wsStatus: NodeStatus =
    wsState.version === executionRunVersion ? wsState.status : "initial";
  const dbStatus: NodeStatus = executionNodeStatuses[nodeId] ?? "initial";
  return mergeNodeStatus(wsStatus, dbStatus);
}
