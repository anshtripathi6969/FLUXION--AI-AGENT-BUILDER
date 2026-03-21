"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";

import { cn } from "@/lib/utils";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) {
      return;
    }

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  }

  return (
    <div className="ml-auto">
      <Button 
        onClick={handleSave} 
        disabled={saveWorkflow.isPending}
        className={cn(
          "relative group overflow-hidden",
          "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10",
          "hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-indigo-500/20",
          "border border-indigo-500/30 hover:border-indigo-500/50",
          "text-indigo-400 font-bold rounded-xl h-9 px-6 gap-2",
          "shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]",
          "transition-all duration-500 hover:scale-[1.02] active:scale-95",
          "backdrop-blur-xl"
        )}
      >
        <SaveIcon className={cn(
          "size-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          saveWorkflow.isPending && "animate-spin"
        )} />
        <span className="tracking-tight uppercase text-[11px]">
          {saveWorkflow.isPending ? "Saving..." : "Save Changes"}
        </span>
      </Button>
    </div>
  )
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name,
      });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[100px] px-2 bg-white/5 border-white/10 text-white rounded-lg focus-visible:ring-indigo-500/50"
      />
    )
  }

  return (
    <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer font-semibold text-slate-300 hover:text-white transition-all duration-300 tracking-tight">
      {workflow.name}
    </BreadcrumbItem>
  )
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href="/workflows" className="text-slate-500 hover:text-slate-300 transition-colors">
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-700" />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  )
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-6 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
      <SidebarTrigger className="text-slate-400 hover:text-white transition-colors" />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};