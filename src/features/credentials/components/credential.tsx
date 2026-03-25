"use client";

import { CredentialType } from "@/generated/prisma";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    useCreateCredential,
    useUpdateCredential,
    useSuspenseCredential,
} from "../hooks/use-credentials";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
    {
        value: CredentialType.GEMINI,
        label: "Gemini",
        logo: "/logos/gemini.svg",
    },
];

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    };
};

export const CredentialForm = ({
    initialData,
}: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.GEMINI,
            value: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            })
        } else {
            await createCredential.mutateAsync(values, {
                onSuccess: (data) => {
                    router.push(`/credentials/${data.id}`);
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to create credential");
                }
            })
        }
    }

    return (
        <>
        <div className="bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                    {isEdit ? "Edit Credential" : "Create Credential"}
                </h1>
                <p className="text-sm text-slate-400">
                    {isEdit
                        ? "Update your API key or credential details"
                        : "Add a new API key or credential to your account"}
                </p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 font-medium">Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="My API key" 
                                        {...field} 
                                        className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 text-white rounded-xl transition-all h-11"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 font-medium">Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary/50 text-white h-11 rounded-xl w-full transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#09090b] border-white/10 text-slate-300">
                                        {credentialTypeOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="focus:bg-white/5 focus:text-white"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={option.logo}
                                                        alt={option.label}
                                                        width={16}
                                                        height={16}
                                                    />
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 font-medium">API Key</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="sk-..."
                                        {...field}
                                        className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-primary/50 text-white rounded-xl transition-all h-11"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={
                                createCredential.isPending ||
                                updateCredential.isPending
                            }
                            className="rounded-xl px-8 shadow-lg transition-all active:scale-95"
                        >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="rounded-xl px-8 bg-white/5 text-white hover:bg-white/10 border-white/10 hover:border-white/20 transition-all active:scale-95"
                        >
                            <Link href="/credentials" prefetch>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
        </>
    )
};

export const CredentialView = ({
    credentialId,
}: { credentialId: string }) => {
    const { data: credential } = useSuspenseCredential(credentialId);

    return <CredentialForm initialData={credential} />
};