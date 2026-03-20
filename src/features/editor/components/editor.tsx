"use client";

import { ErrorView, LoadingView } from '@/components/entity-components';
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  type ReactFlowInstance,
  type Node,
  type Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { useCallback, useEffect } from "react";


export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes, onNodesChange] = useNodesState((workflow.nodes as Node[]) ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState((workflow.edges as Edge[]) ?? []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setEditor(instance);
  }, [setEditor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => setEditor(null);
  }, [setEditor]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};