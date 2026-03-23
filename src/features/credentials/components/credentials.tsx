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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        <Link href={`/credentials/${data.id}`} prefetch className="block h-full">
            <div className={cn(
                "group relative h-full flex flex-col justify-between bg-[#09090b]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] hover:border-blue-500/30 overflow-hidden",
                removeCredential.isPending && "opacity-50 pointer-events-none"
            )}>
                {/* Background ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-start justify-between mb-8">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Image src={logo} alt={data.type} width={28} height={28} className="drop-shadow-md" />
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 hover:text-white text-slate-400 size-8 rounded-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVerticalIcon className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#09090b] border-white/10 text-slate-300 rounded-xl"
                            >
                                <DropdownMenuItem onClick={handleRemove} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer rounded-lg">
                                    <TrashIcon className="size-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-100 transition-colors line-clamp-1">
                        {data.name}
                    </h3>
                    <div className="flex flex-col gap-1.5 mt-4">
                        <div className="flex items-center text-xs text-slate-400 font-medium">
                            <span className="w-16 text-slate-500">Updated</span>
                            <span className="text-slate-300">{formatDistanceToNow(data.updatedAt, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-slate-500">
                            <span className="w-16">Created</span>
                            <span>{formatDistanceToNow(data.createdAt, { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
};