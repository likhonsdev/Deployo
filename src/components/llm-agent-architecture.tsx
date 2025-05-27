"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Workflow,
  Cpu,
  Layers,
  ArrowRight,
  ArrowDown,
  Zap,
  Bot,
  Code,
  Server,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export interface LLMAgentArchitectureProps {
  className?: string;
  width?: string;
  height?: string;
  text?: string;
  showConnections?: boolean;
  lineMarkerSize?: number;
  animateText?: boolean;
  animateLines?: boolean;
  animateMarkers?: boolean;
}

const LLMAgentArchitecture = ({
  className,
  width = "100%",
  height = "100%",
  text = "Deployo",
  showConnections = true,
  animateText = true,
  lineMarkerSize = 18,
  animateLines = true,
  animateMarkers = true,
}: LLMAgentArchitectureProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">{text} LLM Agent Framework</h2>
      </div>
      
      <div className="relative flex-1 flex flex-col md:flex-row gap-4">
        {/* Input Layer */}
        <Card className="flex-1 p-4 bg-background border-border shadow-sm">
          <div className="flex items-center mb-3">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="font-semibold text-foreground">Input Layer</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <FileText className="h-4 w-4 mr-2 text-blue-400" />
              <span>Document Processing</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Globe className="h-4 w-4 mr-2 text-blue-400" />
              <span>Web Browsing</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Database className="h-4 w-4 mr-2 text-blue-400" />
              <span>Database Queries</span>
            </div>
          </div>
          
          <motion.div 
            className="absolute right-2 top-1/2 hidden md:block"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-0 left-1/2 md:hidden"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </Card>
        
        {/* Processing Layer */}
        <Card className="flex-1 p-4 bg-background border-border shadow-sm">
          <div className="flex items-center mb-3">
            <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
            <h3 className="font-semibold text-foreground">Processing Layer</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Cpu className="h-4 w-4 mr-2 text-purple-400" />
              <span>LLM Reasoning</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Workflow className="h-4 w-4 mr-2 text-purple-400" />
              <span>Task Planning</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Layers className="h-4 w-4 mr-2 text-purple-400" />
              <span>Memory Management</span>
            </div>
          </div>
          
          <motion.div 
            className="absolute right-2 top-1/2 hidden md:block"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-0 left-1/2 md:hidden"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </Card>
        
        {/* Output Layer */}
        <Card className="flex-1 p-4 bg-background border-border shadow-sm">
          <div className="flex items-center mb-3">
            <Zap className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="font-semibold text-foreground">Output Layer</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Bot className="h-4 w-4 mr-2 text-green-400" />
              <span>Agent Actions</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Code className="h-4 w-4 mr-2 text-green-400" />
              <span>Code Generation</span>
            </div>
            <div className="flex items-center p-2 rounded-md bg-secondary/20">
              <Server className="h-4 w-4 mr-2 text-green-400" />
              <span>API Interactions</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Architecture Diagram */}
      <div className="mt-6">
        <svg
          className={cn("text-muted", className)}
          width={width}
          height="120"
          viewBox="0 0 800 120"
        >
          {/* Paths */}
          <g
            stroke="currentColor"
            fill="none"
            strokeWidth="0.5"
            strokeDasharray="100 100"
            pathLength="100"
            markerStart="url(#agent-circle-marker)"
          >
            {/* Input to Processing */}
            <path
              strokeDasharray="100 100"
              pathLength="100"
              d="M 200 30 h 100"
            />
            {/* Processing to Output */}
            <path
              strokeDasharray="100 100"
              pathLength="100"
              d="M 500 30 h 100"
            />
            {/* Input to Memory */}
            <path
              strokeDasharray="100 100"
              pathLength="100"
              d="M 150 50 v 30 h 250"
            />
            {/* Memory to Output */}
            <path
              strokeDasharray="100 100"
              pathLength="100"
              d="M 550 80 h 100 v -30"
            />
            {/* Animation For Path Starting */}
            {animateLines && (
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="1.5s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.25,0.1,0.5,1"
                keyTimes="0; 1"
              />
            )}
          </g>

          {/* Input Node */}
          <g transform="translate(150, 30)">
            <circle r="20" fill="#1e40af" opacity="0.2" />
            <circle r="15" fill="#1e40af" opacity="0.3" />
            <text
              x="0"
              y="5"
              fontSize="10"
              fill="currentColor"
              textAnchor="middle"
              fontWeight="bold"
            >
              Input
            </text>
          </g>

          {/* Processing Node */}
          <g transform="translate(400, 30)">
            <circle r="20" fill="#7e22ce" opacity="0.2" />
            <circle r="15" fill="#7e22ce" opacity="0.3" />
            <text
              x="0"
              y="5"
              fontSize="10"
              fill="currentColor"
              textAnchor="middle"
              fontWeight="bold"
            >
              LLM
            </text>
          </g>

          {/* Output Node */}
          <g transform="translate(650, 30)">
            <circle r="20" fill="#15803d" opacity="0.2" />
            <circle r="15" fill="#15803d" opacity="0.3" />
            <text
              x="0"
              y="5"
              fontSize="10"
              fill="currentColor"
              textAnchor="middle"
              fontWeight="bold"
            >
              Output
            </text>
          </g>

          {/* Memory Node */}
          <g transform="translate(400, 80)">
            <circle r="20" fill="#b45309" opacity="0.2" />
            <circle r="15" fill="#b45309" opacity="0.3" />
            <text
              x="0"
              y="5"
              fontSize="10"
              fill="currentColor"
              textAnchor="middle"
              fontWeight="bold"
            >
              Memory
            </text>
          </g>

          {/* Markers */}
          <defs>
            <marker
              id="agent-circle-marker"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth={lineMarkerSize}
              markerHeight={lineMarkerSize}
            >
              <circle
                id="innerMarkerCircle"
                cx="5"
                cy="5"
                r="2"
                fill="black"
                stroke="#232323"
                strokeWidth="0.5"
              >
                {animateMarkers && (
                  <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
                )}
              </circle>
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Framework Features */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="p-3 rounded-md bg-secondary/10 border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h4 className="font-medium text-foreground mb-1">Modular Architecture</h4>
          <p className="text-sm text-muted-foreground">Plug-and-play components for customizable agent workflows</p>
        </motion.div>
        
        <motion.div 
          className="p-3 rounded-md bg-secondary/10 border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h4 className="font-medium text-foreground mb-1">Multi-Model Support</h4>
          <p className="text-sm text-muted-foreground">Integrate with various LLM providers and model architectures</p>
        </motion.div>
        
        <motion.div 
          className="p-3 rounded-md bg-secondary/10 border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h4 className="font-medium text-foreground mb-1">Tool Integration</h4>
          <p className="text-sm text-muted-foreground">Extensible API for connecting to external tools and services</p>
        </motion.div>
      </div>
    </div>
  );
};

// Usage example
const DeployoAgentArchitecture = () => {
  return (
    <div className="p-4 rounded-xl bg-accent/20 h-full">
      <LLMAgentArchitecture />
    </div>
  );
};

export default DeployoAgentArchitecture;
