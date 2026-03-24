import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { motion, type Variants } from "framer-motion";
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

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

export const staggerItem: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

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
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4"
        >
            <motion.div variants={staggerItem} className="flex flex-col max-w-2xl px-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-sm pb-1">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm md:text-base text-slate-400 font-medium tracking-wide">
                        {description}
                    </p>
                )}
            </motion.div>

            {(onNew || newButtonHref) && (
                <motion.div variants={staggerItem}>
                    {onNew && !newButtonHref && (
                        <Button
                            disabled={isCreating || disabled}
                            size="default"
                            onClick={onNew}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-3 px-6 h-12 font-bold border border-white/10"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                            <PlusIcon className="size-5 transition-transform group-hover:rotate-90 duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <span className="tracking-wide">{newButtonLabel}</span>
                        </Button>
                    )}
                    {newButtonHref && !onNew && (
                        <Button
                            size="default"
                            asChild
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-3 px-6 h-12 font-bold border border-white/10"
                        >
                            <Link href={newButtonHref} prefetch >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                                <PlusIcon className="size-5 transition-transform group-hover:rotate-90 duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                <span className="tracking-wide">{newButtonLabel}</span>
                            </Link>
                        </Button>
                    )}
                </motion.div>
            )}
        </motion.div>
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
        <div className="p-4 md:px-12 md:py-10 h-full relative z-10" >
            <div className="mx-auto max-w-screen-2xl w-full flex flex-col gap-y-12 h-full">
                {header}
                <div className="flex flex-col gap-y-6 h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {search}
                    </motion.div>
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
                className="text-white hover:text-white border-white/10 hover:bg-white/5 bg-transparent"
            >
                Previous
            </Button>
            <div className="text-sm font-medium text-slate-300">
                Page {page} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || disabled}
                className="text-white hover:text-white border-white/10 hover:bg-white/5 bg-transparent"
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
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex justify-center items-center mt-20" 
            >
                <div className="max-w-md mx-auto">
                    {emptyView}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={cn(
                "flex flex-col gap-6",
                className,
            )}
        >
            {items.map((item, index) => (
                <motion.div key={getKey ? getKey(item, index) : index} variants={staggerItem}>
                    {renderItem(item, index)}
                </motion.div>
            ))}
        </motion.div>
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
        <Link href={href} prefetch className="block w-full">
            <div
                className={cn(
                    "group relative w-full flex flex-col md:flex-row md:items-center justify-between bg-[#030305]/60 backdrop-blur-3xl border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] overflow-hidden",
                    isRemoving && "opacity-50 cursor-not-allowed",
                    className,
                )}
            >
                {/* Ambient glow inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-center gap-5">
                    <div className="size-14 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-inner bg-gradient-to-br from-white/5 to-white/[0.01]">
                        {image}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-100 transition-colors">
                            {title}
                        </h3>
                        {!!subtitle && (
                            <div className="text-sm text-slate-400 font-medium">
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>

                {(actions || onRemove) && (
                    <div className="relative z-10 flex gap-x-4 items-center mt-4 md:mt-0">
                        {actions}
                        {onRemove && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 hover:text-white text-slate-400 rounded-xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVerticalIcon className="size-4" />
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
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
};


























