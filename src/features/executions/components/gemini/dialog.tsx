"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BrainIcon, SparklesIcon, CheckIcon, TerminalIcon, SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message: "must start with letter/underscore and contain only letters, numbers, underscores",
    }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<GeminiFormValues>;
};

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  // Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myGemini";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[450px] sm:w-[500px] border-l border-white/10 bg-[#09090b]/95 backdrop-blur-2xl p-0 flex flex-col h-full shadow-2xl">
        {/* Header Section */}
        <div className="p-8 pb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pl-10 -mt-10 pointer-events-none">
            <BrainIcon className="size-40 text-blue-500" />
          </div>
          
          <SheetHeader className="relative z-10">
            <SheetTitle className="text-2xl font-semibold flex items-center gap-3 text-white tracking-tight">
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <BrainIcon className="size-5 text-blue-500 animate-pulse" />
              </div>
              Gemini Execution
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400/80 mt-2">
              Configure the AI model prompts to generate text and process data.
            </SheetDescription>
          </SheetHeader>
        </div>

        <Separator className="bg-white/5" />

        {/* Form Section */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <Form {...form}>
            <form id="gemini-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Output Configuration */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <SettingsIcon className="size-4 text-blue-400" />
                  <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">Settings</h3>
                </div>

                <FormField
                  control={form.control}
                  name="variableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium">Variable Name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <TerminalIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                          <Input
                            placeholder="e.g. summarizedText"
                            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 text-white pl-9 h-11 rounded-xl transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500/90 font-medium bg-blue-500/5 px-3 py-2 rounded-lg border border-blue-500/10">
                        Use <code className="text-blue-400">{"{{"}{watchVariableName}.text{"}}"}</code> in future steps
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-white/5" />

              {/* Prompt Configuration */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <SparklesIcon className="size-4 text-purple-400" />
                  <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">Prompts</h3>
                </div>

                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium">System Prompt <span className="text-slate-500 font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant."
                          className="min-h-[80px] font-mono text-sm bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500/50 text-slate-300 rounded-xl transition-all resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-slate-500">
                        Defines the persona. Accepts <code className="text-slate-400">{"{{variables}}"}</code>
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium font-bold">User Prompt <span className="text-red-400">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Summarize this text: {{json httpResponse.data}}"
                          className="min-h-[140px] font-mono text-sm bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500/50 text-slate-200 rounded-xl transition-all resize-y shadow-inner"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-slate-500">
                        The strict instructions to process data. Use <code className="text-slate-400">{"{{json variable}}"}</code> for objects.
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 backdrop-blur-md z-10 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
            Powered by gemini-2.0-flash
          </p>
          <Button 
            type="submit" 
            form="gemini-form" 
            className="rounded-xl px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <CheckIcon className="size-4" />
            Save Node
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};