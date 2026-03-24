"use client";

import { formatDistanceToNow } from "date-fns";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityList,
    EntityPagination,
    EntitySearch,
    ErrorView,
    LoadingView
} from "@/components/entity-components";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType } from "@/generated/prisma";
import Image from "next/image";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search credentials"
        />
    );
};

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential} />}
            emptyView={<CredentialsEmpty />}
            className="grid grid-cols-1 2xl:grid-cols-2 gap-6"
        />
    );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <EntityHeader
            title="Credentials"
            description="Create and manage your credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New credential"
            disabled={disabled}
        />
    );
};

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};

export const CredentialsContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    );
};

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials" />;
};

export const CredentialsEmpty = () => {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/credentials/new`);
    };

    return (
        <EmptyView
            onNew={handleCreate}
            message="You haven't created any credentials yet. Get started by creating your first credential"
        />
    );
};

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/logos/openai.svg",
    [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
    [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialItem = ({
    data,
}: {
    data: any // using any or Credential if exported correctly 
}) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (removeCredential.isPending) return;
        removeCredential.mutate({ id: data.id });
    };

    const logo = credentialLogos[data.type as CredentialType] || "/logos/openai.svg";

    return (
        <Link href={`/credentials/${data.id}`} prefetch className="block w-full">
            <div className={cn(
                "group relative w-full flex flex-col md:flex-row md:items-center justify-between bg-[#030305]/60 backdrop-blur-3xl border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] overflow-hidden",
                removeCredential.isPending && "opacity-50 pointer-events-none"
            )}>
                {/* Background ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-5">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Image src={logo} alt={data.type} width={28} height={28} className="drop-shadow-md group-hover:rotate-6 transition-transform duration-500" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-100 transition-colors line-clamp-1">
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
};