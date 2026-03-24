"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/ui/node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button
        onClick={() => setSelectorOpen(true)}
        size="icon"
        variant="outline"
        className="bg-[#030305]/60 backdrop-blur-md border-white/20 hover:bg-white/10 hover:border-white/30 transition-all rounded-xl"
      >
        <PlusIcon className="text-white" />
      </Button>
    </NodeSelector>
  )
});

AddNodeButton.displayName = "AddNodeButton";