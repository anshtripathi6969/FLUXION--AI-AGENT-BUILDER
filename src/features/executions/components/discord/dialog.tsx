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
import { MessageSquareIcon, CheckIcon, TerminalIcon, SettingsIcon, WebhookIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
    }),
  username: z.string().optional(),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Discord messages cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<DiscordFormValues>;
};

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      username: defaultValues.username || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  // Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        username: defaultValues.username || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myDiscord";

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
            <MessageSquareIcon className="size-40 text-blue-500" />
          </div>
          
          <SheetHeader className="relative z-10">
            <SheetTitle className="text-2xl font-semibold flex items-center gap-3 text-white tracking-tight">
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <MessageSquareIcon className="size-5 text-blue-500 animate-pulse" />
              </div>
              Discord Configuration
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400/80 mt-2">
              Configure the Discord webhook settings for this node to send messages to a channel.
            </SheetDescription>
          </SheetHeader>
        </div>

        <Separator className="bg-white/5" />

        {/* Form Section */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <Form {...form}>
            <form id="discord-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Settings Configuration */}
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
                            placeholder="e.g. myDiscord"
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

                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium font-bold">Webhook URL <span className="text-red-400">*</span></FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <WebhookIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                          <Input
                            placeholder="https://discord.com/api/webhooks/..."
                            className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 text-white pl-9 h-11 rounded-xl transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-[11px] text-slate-500">
                        Get this from Discord: Channel Settings → Integrations → Webhooks
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-white/5" />

              {/* Message Configuration */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquareIcon className="size-4 text-purple-400" />
                  <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">Message</h3>
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium">Bot Username <span className="text-slate-500 font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Workflow Bot"
                          className="bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500/50 text-white h-11 rounded-xl transition-all pl-3"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-slate-500">
                        Override the webhook's default username
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-medium font-bold">Message Content <span className="text-red-400">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Summary: {{myGemini.text}}"
                          className="min-h-[140px] font-mono text-sm bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-purple-500/50 text-slate-200 rounded-xl transition-all resize-y shadow-inner p-3"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-slate-500 mt-2 block">
                        The message to send. Use <code className="text-slate-400 bg-white/5 px-1 rounded">{"{{variables}}"}</code> for simple values
                        or <code className="text-slate-400 bg-white/5 px-1 rounded">{"{{json variable}}"}</code> to stringify objects
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
        <div className="p-6 bg-white/[0.02] border-t border-white/5 backdrop-blur-md z-10 flex items-center justify-end">
          <Button 
            type="submit" 
            form="discord-form" 
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