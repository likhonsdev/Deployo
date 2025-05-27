import React from "react";
import DeployoAgentArchitecture from "@/components/llm-agent-architecture";

export default function LLMAgentFrameworkExample() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">LLM Agent Framework Visualization</h1>
      <div className="bg-background rounded-xl p-6 border border-border shadow-sm">
        <DeployoAgentArchitecture />
      </div>
    </div>
  );
}
