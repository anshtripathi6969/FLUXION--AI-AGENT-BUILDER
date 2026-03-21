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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlobeIcon, Settings2Icon, Code2Icon } from "lucide-react";

const formSchema = z.object({
  variableName: z
  .string()
  .min(1 , { message: "Variable Name is required"})
  .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/ , { message: "Variable Name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
  endpoint: z.string().url({ message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});


export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpRequestFormValues) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
};

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "MyApiCall";
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);


  const handleSubmit = (values: HttpRequestFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 bg-[#09090b]/95 backdrop-blur-2xl border-l border-white/5 flex flex-col shadow-2xl">
        <div className="p-8 pb-6 bg-white/[0.02] border-b border-white/5">
          <SheetHeader className="gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner group">
                 <GlobeIcon className="size-6 text-orange-500 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-white tracking-tight">HTTP Request</SheetTitle>
                <SheetDescription className="text-sm text-slate-400 mt-1">
                  Send automated requests to any external API
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
              {/* SECTION: Basic Config */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                   <Settings2Icon className="size-4 text-slate-500" />
                   <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Basic Configuration</h3>
                </div>
                
                <div className="grid grid-cols-12 gap-8 rounded-2xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.03] transition-colors relative group">
                  {/* Variable Name - Full Width */}
                  <div className="col-span-12">
                    <FormField
                      control={form.control}
                      name="variableName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-400 text-xs font-semibold">Variable Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MyApiCall"
                              className="h-11 bg-white/5 border-white/10 text-white hover:border-white/20 transition-all rounded-xl placeholder:text-slate-600 font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                            Reference response data using: <code className="bg-white/5 px-1.5 py-0.5 rounded text-orange-400 font-mono text-[9px]">{`{{${watchVariableName}.httpResponse.data}}`}</code>
                          </FormDescription>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Method & URL - Split Row */}
                  <div className="col-span-12 sm:col-span-4">
                    <FormField
                      control={form.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-400 text-xs font-semibold">Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white hover:border-white/20 transition-all rounded-xl">
                                <SelectValue placeholder="GET" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0f0f12] border-white/10 text-white">
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-8">
                    <FormField
                      control={form.control}
                      name="endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-400 text-xs font-semibold">Endpoint URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/data"
                              {...field}
                              className="h-11 bg-white/5 border-white/10 text-white hover:border-white/20 transition-all rounded-xl placeholder:text-slate-600"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-12">
                    <p className="text-[10px] text-slate-500 mt-2 px-1 italic">
                      Supports {"{{variables}}"} from previous steps.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION: Request Body */}
              {showBodyField && (
                <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 px-1">
                     <Code2Icon className="size-4 text-slate-500" />
                     <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Request Body (JSON)</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-colors pointer-events-none rounded-2xl" />
                            <Textarea
                              placeholder='{\n  "key": "value"\n}'
                              className="min-h-[220px] bg-black/40 border-white/10 text-white font-mono text-sm leading-relaxed p-6 rounded-2xl hover:border-white/20 focus-visible:ring-primary/30 transition-all relative z-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[10px] text-slate-500 mt-3 px-1">
                          Define your JSON payload here. You can use dynamic variables.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              )}
            </form>
          </Form>
        </div>

        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                All changes are saved to this workflow version.
            </p>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(handleSubmit)}
              className="px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95"
            >
              Save Configuration
            </Button>
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 -right-32 size-64 bg-orange-500/10 blur-[100px] pointer-events-none" />
      </SheetContent>
    </Sheet>
  );
};
