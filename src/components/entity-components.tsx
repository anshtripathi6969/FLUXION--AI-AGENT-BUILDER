import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyTitle,
    EmptyHeader,
    EmptyMedia
} from "./ui/empty";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";



type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { newButtonHref: string; onNew?: never }
        | { onNew?: never; newButtonHref?: never }
    );

export const EntityHeader = ({
    title,
    description,
    onNew,
    newButtonHref,
    newButtonLabel,
    disabled,
    isCreating,
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white">{title}</h1>
                {description && (
                    <p className="text-xs md:text-sm text-slate-400 mt-1" >
                        {description}
                    </p>
                )}
            </div>
            {onNew && !newButtonHref && (
                <Button
                    disabled={isCreating || disabled}
                    size="default"
                    onClick={onNew}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-2 px-5 font-semibold border border-white/10"
                >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    <PlusIcon className="size-4 transition-transform group-hover:rotate-90 duration-300" />
                    {newButtonLabel}
                </Button>
            )}
            {newButtonHref && !onNew && (
                <Button
                    size="default"
                    asChild
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-2 px-5 font-semibold border border-white/10"
                >
                    <Link href={newButtonHref} prefetch >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                        <PlusIcon className="size-4 transition-transform group-hover:rotate-90 duration-300" />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
};

type EntityContainerProps = {
    children: React.ReactNode;
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
};

export const EntityContainer = ({
    children,
    header,
    search,
    pagination,
}: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full" >
            <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
                {header}
                <div className="flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
};

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder = "Search",
}: EntitySearchProps) => {
    return (
        <div className="relative ml-auto" >
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input className="max-w-[200px] bg-white/5 shadow-inner border-white/10 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-primary/50 text-white pl-8 rounded-xl transition-all"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled,
}: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || disabled}
            >
                Previous
            </Button>
            <div className="text-sm font-medium">
                Page {page} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || disabled}
            >
                Next
            </Button>
        </div>
    );
};

interface StateViewProps {
    message?: React.ReactNode;
};

export const LoadingView = ({
    message,
}: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="size-6 animate-spin text-primary" />
            {!!message && (
                <p className="text-sm text-muted-foreground" >
                    {message}
                </p>
            )}
        </div>
    );
};

export const ErrorView = ({
    message,
}: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="size-6 text-primary" />
            {!!message && (
                <p className="text-sm text-muted-foreground" >
                    {message}
                </p>
            )}
        </div>
    );
};

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void;
    message?: React.ReactNode;
};

export const EmptyView = ({
    message,
    onNew
}: EmptyViewProps) => {
    return (
        <Empty className="border-none bg-transparent h-full" >
            <EmptyHeader>
                <EmptyMedia className="bg-transparent text-primary">
                    <PackageOpenIcon className="size-8" />
                </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>
                No Items
            </EmptyTitle>
            {message && (
                <EmptyDescription>
                    {message}
                </EmptyDescription>
            )}
            {!!onNew && (
                <EmptyContent>
                    <Button onClick={onNew}>
                        Add item
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
};


interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string;
};

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className,
}: EntityListProps<T>) {
    if (items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-center items-center" >
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col gap-y-4",
            className,
        )}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
};

interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
};

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className,
}: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isRemoving) {
            return;
        }

        if (onRemove) {
            await onRemove();
        }
    }

    return (
        <Link href={href} prefetch>
            <Card
                className={cn(
                    "p-4 shadow-xl border-white/10 bg-[#09090b]/80 backdrop-blur-xl hover:bg-white/[0.04] hover:shadow-2xl hover:border-white/20 cursor-pointer transition-all rounded-2xl",
                    isRemoving && "opacity-50 cursor-not-allowed",
                    className,
                )}
            >
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium text-slate-200">
                                {title}
                            </CardTitle>
                            {!!subtitle && (
                                <CardDescription className="text-xs text-slate-500 mt-1">
                                    {subtitle}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex gap-x-4 items-center">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVerticalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem onClick={handleRemove}>
                                            <TrashIcon className="size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
};


























