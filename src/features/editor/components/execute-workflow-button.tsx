import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button 
      size="lg" 
      onClick={handleExecute} 
      disabled={executeWorkflow.isPending}
      className={cn(
        "relative group overflow-hidden",
        "bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10",
        "hover:from-teal-500/20 hover:via-emerald-500/20 hover:to-teal-500/20",
        "border border-teal-500/30 hover:border-teal-500/50",
        "text-emerald-400 font-bold rounded-2xl",
        "shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
        "transition-all duration-500 hover:scale-[1.02] active:scale-95 px-10 gap-3",
        "backdrop-blur-xl"
      )}
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <FlaskConicalIcon className={cn(
        "size-5 transition-all duration-500 group-hover:rotate-12", 
        executeWorkflow.isPending && "animate-pulse scale-110 text-emerald-300"
      )} />
      
      <span className="relative z-10 tracking-wide uppercase text-[12px]">
        {executeWorkflow.isPending ? "System Executing..." : "Execute Workflow"}
      </span>
    </Button>
  );
};