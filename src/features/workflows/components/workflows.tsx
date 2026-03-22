"use client";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "../../../generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";


export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });
    return (
        <div className="relative group max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors duration-300" />
            <Input
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                placeholder="Search your workflows..."
                className="pl-11 pr-4 py-6 bg-white/[0.03] border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300 text-sm placeholder:text-slate-500"
            />
        </div>
    );
};

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
    )
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },

        });
    }


    return (
        <div className="mb-2">
            <EntityHeader
                title="Your Workflows"
                description="Monitor and optimize your automation sequences"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </div>
    );
};

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const WorkflowsContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
};

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading Workflows..." />
};

export const WorkflowsError = () => {
    return <ErrorView message="Failed to load workflows..." />
};


export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
        });
    };

    return (
        <EmptyView
            onNew={handleCreate}
            message={
                <>
                    You haven&apos;t created any workflows yet.
                    <br />
                    Get started by creating your first workflow
                </>
            }
        />
    );
};

export const WorkflowItem = ({
    data,
}: {
    data: Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id });
    }

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 rounded-2xl group shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            subtitle={
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    Created {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                  </span>
                </div>
            }
            image={
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <WorkflowIcon className="size-6 text-primary" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}



















