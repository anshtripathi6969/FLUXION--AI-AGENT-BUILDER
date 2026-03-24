"use client";

import { EmptyView, EntityContainer, EntityHeader, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "../../../generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon, SearchIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";


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
            className="grid grid-cols-1 2xl:grid-cols-2 gap-6"
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

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (removeWorkflow.isPending) return;
        removeWorkflow.mutate({ id: data.id });
    }

    return (
        <Link href={`/workflows/${data.id}`} prefetch className="block w-full">
            <div className={cn(
                "group relative w-full flex flex-col md:flex-row md:items-center justify-between bg-[#030305]/60 backdrop-blur-3xl border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] overflow-hidden",
                removeWorkflow.isPending && "opacity-50 pointer-events-none"
            )}>
                {/* Background ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-5">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-inner">
                        <WorkflowIcon className="size-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-100 transition-colors line-clamp-1">
                            {data.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-500">Updated</span>
                                <span className="text-slate-300">{formatDistanceToNow(data.updatedAt, { addSuffix: true })}</span>
                            </div>
                            <span className="text-white/10 hidden sm:inline">•</span>
                            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
                                <span className="text-slate-500">Created</span>
                                <span>{formatDistanceToNow(data.createdAt, { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-x-4 items-center mt-4 md:mt-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 hover:text-white text-slate-400 size-10 rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVerticalIcon className="size-4.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#030305] border-white/10 text-slate-300 rounded-xl"
                        >
                            <DropdownMenuItem onClick={handleRemove} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer rounded-lg">
                                <TrashIcon className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Link>
    )
}



















