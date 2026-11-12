import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import {
  activeExecutionAtom,
  executionNodeStatusesAtom,
  executionRunVersionAtom,
} from "@/features/editor/store/atoms";
import { useTRPC } from "@/trpc/client";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to remove a workflow
 */
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to fetch a single workflow using suspense
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/**
 * Hook to update a workflow name
 */
export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to update a workflow
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save workflow: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to execute a workflow
 */
export const useExecuteWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const setActiveExecution = useSetAtom(activeExecutionAtom);
  const setExecutionNodeStatuses = useSetAtom(executionNodeStatusesAtom);
  const setExecutionRunVersion = useSetAtom(executionRunVersionAtom);

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onMutate: (variables) => {
        const startedAt = Date.now() - 1000;
        let nextVersion = 1;
        setExecutionRunVersion((prev) => {
          nextVersion = prev + 1;
          return nextVersion;
        });
        setExecutionNodeStatuses({});
        setActiveExecution({
          workflowId: variables.id,
          executionId: null,
          startedAt,
          version: nextVersion,
        });
        return { startedAt, nextVersion };
      },
      onSuccess: (data, _variables, context) => {
        setActiveExecution((prev) => ({
          workflowId: data.id,
          executionId: data.executionId ?? null,
          startedAt: context?.startedAt ?? prev?.startedAt ?? Date.now() - 1000,
          version: context?.nextVersion ?? prev?.version ?? 1,
        }));
        queryClient.invalidateQueries({
          queryKey: trpc.executions.getLatestByWorkflow.queryKey({
            workflowId: data.id,
          }),
        });
        toast.success(`Workflow "${data.name}" execution started`);
      },
      onError: (error) => {
        setActiveExecution(null);
        toast.error(`Failed to execute workflow: ${error.message}`);
      },
    }),
  );
};
