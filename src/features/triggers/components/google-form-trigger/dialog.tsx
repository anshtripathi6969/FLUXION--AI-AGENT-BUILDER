"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  CopyIcon, 
  CheckCircle2Icon, 
  InfoIcon,
  TerminalIcon,
  ZapIcon
} from "lucide-react";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const steps = [
    "Open your Google Form",
    'Click "More" (three dots) → Script editor',
    "Copy and paste the script provided below",
    'Save the project and click "Triggers" (clock icon)',
    'Click "+ Add Trigger"',
    'Select: "onFormSubmit" → "From form" → "On form submit"'
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 bg-[#09090b]/95 backdrop-blur-2xl border-l border-white/5 flex flex-col shadow-2xl">
        {/* Header Section */}
        <div className="p-8 pb-6 bg-white/[0.02] border-b border-white/5">
          <SheetHeader className="gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner group overflow-hidden">
                <NextImage
                  src="/logos/googleform.svg"
                  alt="Google Form"
                  width={32}
                  height={32}
                  className="size-8 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Google Form Trigger
                  <Badge variant="outline" className="bg-purple-500/5 text-purple-400 border-purple-500/20 text-[10px] uppercase tracking-wider h-5">Beta</Badge>
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-400 mt-1">
                  Connect your Google Forms to trigger automated workflows instantly.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar">
          {/* Webhook Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ZapIcon className="size-4 text-slate-500" />
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Webhook Gateway</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Live & Ready</span>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.03] transition-colors group">
              <Label htmlFor="webhook-url" className="text-slate-400 text-xs font-semibold px-1">Submission Endpoint</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  readOnly
                  className="h-11 bg-black/40 border-white/10 text-white hover:border-white/20 transition-all rounded-xl font-mono text-xs overflow-hidden text-ellipsis"
                />
                <Button
                  type="button"
                  size="icon"
                  className="size-11 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95"
                  onClick={() => copyToClipboard(webhookUrl, "Webhook URL copied")}
                >
                  <CopyIcon className="size-4 text-slate-300" />
                </Button>
              </div>
            </div>
          </section>

          {/* Instructions Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <InfoIcon className="size-4 text-slate-500" />
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Setup Instructions</h3>
            </div>

            <div className="grid gap-4">
              {steps.map((step, i) => (
                <div key={`step-${i}`} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <span className="flex-shrink-0 size-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Script Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <TerminalIcon className="size-4 text-slate-500" />
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Google Apps Script</h3>
            </div>

            <div className="relative group">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="rounded-2xl bg-black/40 border border-white/5 p-6 space-y-4 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-white">Full integration script</p>
                    <p className="text-[10px] text-slate-500">Automatically handles form mapping and delivery</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-400 font-semibold rounded-lg"
                    onClick={() => copyToClipboard(generateGoogleFormScript(webhookUrl), "Integration script copied")}
                  >
                    <CopyIcon className="size-3.5 mr-2" />
                    Copy Script
                  </Button>
                </div>
                <div className="rounded-xl bg-white/[0.02] p-4 border border-white/5">
                  <pre className="text-[10px] font-mono text-purple-300/70 overflow-hidden line-clamp-3">
                    {`function onFormSubmit(e) {\n  var formResponse = e.response;\n  var itemResponses = formResponse.getItemResponses();\n  ...`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Variables Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <CheckCircle2Icon className="size-4 text-slate-500" />
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Available Variables</h3>
            </div>

            <div className="grid gap-3">
              {[
                { var: "googleForm.respondentEmail", desc: "Respondent's email address" },
                { var: "googleForm.responses['Question Name']", desc: "Specific answer by question title" },
                { var: "googleForm.responses", desc: "Full response object as JSON" },
              ].map((v, i) => (
                <div key={`var-${i}`} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] group hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <code className="text-[11px] text-purple-400 font-mono font-medium tracking-tight">
                      {"{{"}{v.var}{"}}"}
                    </code>
                    <span className="text-[10px] text-slate-500">{v.desc}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(`{{${v.var}}}`, "Variable copied")}
                  >
                    <CopyIcon className="size-3 text-slate-400" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium tracking-tight flex items-center gap-2">
            <InfoIcon className="size-3" />
            Configured for this workflow version.
          </p>
          <Button 
            variant="ghost"
            className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-2"
            onClick={() => onOpenChange(false)}
          >
            Close Settings
          </Button>
        </div>

        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 -right-32 size-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
      </SheetContent>
    </Sheet>
  );
};