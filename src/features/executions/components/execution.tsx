"use client";

import { ExecutionStatus } from "@/generated/prisma";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSuspenseExecution } from "@/features/executions/hooks/use-executions";
import { cn } from "@/lib/utils";

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

export const ExecutionView = ({
    executionId
}: {
    executionId: string
}) => {
    const { data: execution } = useSuspenseExecution(executionId);
    const [showStackTrace, setShowStackTrace] = useState(false);

    const duration = execution.completedAt
        ? Math.round(
            (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000,
        )
        : null;

    const statusColors = {
        [ExecutionStatus.SUCCESS]: {
            border: "border-green-500/20",
            bg: "from-green-500/10 to-transparent",
            badge: "bg-green-500/20 text-green-400 border-green-500/30",
        },
        [ExecutionStatus.FAILED]: {
            border: "border-red-500/20",
            bg: "from-red-500/10 to-transparent",
            badge: "bg-red-500/20 text-red-400 border-red-500/30",
        },
        [ExecutionStatus.RUNNING]: {
            border: "border-blue-500/20",
            bg: "from-blue-500/10 to-transparent",
            badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        },
    };

    const config = statusColors[execution.status] || statusColors[ExecutionStatus.RUNNING];

    return (
        <div className="w-full flex flex-col gap-6 pb-20">
            {/* Header Panel */}
            <div className={cn("relative overflow-hidden rounded-3xl border bg-[#09090b]/80 backdrop-blur-2xl p-8", config.border)}>
                {/* Ambient glow */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none", config.bg)} />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className={cn("size-16 rounded-2xl flex items-center justify-center border shadow-inner", config.badge)}>
                            {getStatusIcon(execution.status)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                                {formatStatus(execution.status)}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Execution log for <Link href={`/workflows/${execution.workflowId}`} className="text-white hover:text-blue-400 transition-colors font-medium underline underline-offset-4">{execution.workflow.name}</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 p-6 rounded-2xl bg-black/40 border border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Started</span>
                        <span className="text-sm text-slate-200">{formatDistanceToNow(execution.startedAt, { addSuffix: true })}</span>
                    </div>
                    {execution.completedAt && (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</span>
                            <span className="text-sm text-slate-200">{formatDistanceToNow(execution.completedAt, { addSuffix: true })}</span>
                        </div>
                    )}
                    {duration !== null && (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</span>
                            <span className="text-sm text-slate-200">{duration}s</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Event ID</span>
                        <span className="text-sm text-slate-200 font-mono truncate" title={execution.inngestEventId}>{execution.inngestEventId}</span>
                    </div>
                </div>
            </div>

            {/* Error Panel if failed */}
            {execution.error && (
                <div className="rounded-3xl border border-red-500/20 bg-[#09090b]/80 backdrop-blur-2xl p-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col gap-5">
                        <h2 className="text-xl font-bold text-red-400 flex items-center gap-3">
                            <XCircleIcon className="size-6" /> Execution Error
                        </h2>
                        <div className="p-5 rounded-2xl relative border bg-black/60 border-red-900/50 shadow-inner">
                            <code className="text-sm text-red-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
                                {execution.error}
                            </code>
                        </div>

                        {execution.errorStack && (
                            <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -ml-3 h-9 px-3">
                                        {showStackTrace ? "Hide stack trace" : "View full stack trace"}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4">
                                    <div className="p-5 rounded-2xl border bg-black/80 border-red-900/30 overflow-x-auto shadow-inner">
                                        <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap break-all leading-relaxed">
                                            {execution.errorStack}
                                        </pre>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </div>
                </div>
            )}

            {/* Output Panel */}
            {execution.output && (
                <div className="rounded-3xl border border-white/5 bg-[#09090b]/80 backdrop-blur-2xl p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                    <h2 className="relative z-10 text-xl font-bold text-white flex items-center gap-3 mb-6">
                        <div className="size-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" /> 
                        Final Output
                    </h2>
                    <div className="relative z-10 p-6 rounded-2xl border bg-black/60 border-white/5 overflow-x-auto shadow-inner">
                        <pre className="text-sm font-mono text-blue-200/80 whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(execution.output, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};