"use client";

import { formatDistanceToNow } from "date-fns";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityList,
    EntityPagination,
    ErrorView,
    LoadingView
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions"
import { useExecutionsParams } from "../hooks/use-executions-params";
import type { Execution } from "@/generated/prisma";
import { ExecutionStatus } from "@/generated/prisma";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionsEmpty />}
        />
    );
};

export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Executions"
            description="View your workflow execution history"
        />
    );
};

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};

export const ExecutionsContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    );
};

export const ExecutionsLoading = () => {
    return <LoadingView message="Loading executions..." />;
};

export const ExecutionsError = () => {
    return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmpty = () => {
    return (
        <EmptyView
            message="You haven't created any executions yet. Get started by running your first workflow"
        />
    );
};

const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />;
    }
}

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({
    data,
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        };
    };
}) => {
    const duration = data.completedAt
        ? Math.round(
            (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000,
        )
        : null;

    const statusConfig = {
        [ExecutionStatus.SUCCESS]: {
            icon: <CheckCircle2Icon className="size-5 text-green-400" />,
            border: "group-hover:border-green-500/30",
            shadow: "hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.15)]",
            bg: "from-green-500/5 to-transparent",
            iconBg: "from-green-500/20 to-emerald-500/20 border-green-500/20",
            titleColor: "group-hover:text-green-100",
        },
        [ExecutionStatus.FAILED]: {
            icon: <XCircleIcon className="size-5 text-red-400" />,
            border: "group-hover:border-red-500/30",
            shadow: "hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)]",
            bg: "from-red-500/5 to-transparent",
            iconBg: "from-red-500/20 to-rose-500/20 border-red-500/20",
            titleColor: "group-hover:text-red-100",
        },
        [ExecutionStatus.RUNNING]: {
            icon: <Loader2Icon className="size-5 text-blue-400 animate-spin" />,
            border: "group-hover:border-blue-500/30",
            shadow: "hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)]",
            bg: "from-blue-500/5 to-transparent",
            iconBg: "from-blue-500/20 to-indigo-500/20 border-blue-500/20",
            titleColor: "group-hover:text-blue-100",
        },
    };

    const config = statusConfig[data.status] || statusConfig[ExecutionStatus.RUNNING];

    return (
        <Link href={`/executions/${data.id}`} prefetch className="block w-full">
            <div className={cn(
                "group relative w-full flex items-center justify-between bg-[#09090b]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden",
                config.shadow,
                config.border
            )}>
                {/* Ambient glow */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", config.bg)} />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className={cn("size-12 rounded-xl flex items-center justify-center border group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner bg-gradient-to-br", config.iconBg)}>
                        {config.icon}
                    </div>

                    <div className="flex flex-col justify-center gap-1.5">
                        <h3 className={cn("text-lg font-bold text-white tracking-tight transition-colors", config.titleColor)}>
                            {formatStatus(data.status)}
                        </h3>
                        <div className="flex items-center text-xs text-slate-400 font-medium">
                            <span className="text-slate-300">{data.workflow.name}</span>
                            <span className="mx-2">&bull;</span>
                            <span className="text-slate-500">Started {formatDistanceToNow(data.startedAt, { addSuffix: true })}</span>
                            {duration !== null && (
                                <>
                                    <span className="mx-2">&bull;</span>
                                    <span className="text-slate-500">Took {duration}s</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );    
};