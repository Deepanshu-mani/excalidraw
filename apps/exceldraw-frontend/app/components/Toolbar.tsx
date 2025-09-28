"use client";

import {
  RectangleHorizontal,
  Circle,
  Minus,
  Eraser,
  Undo,
  Redo,
} from "lucide-react";

export type Tool = "rect" | "circle" | "line" | "eraser" | "select";

interface ToolbarProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

export function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  const tools = [
    { id: "rect" as Tool, icon: RectangleHorizontal, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "line" as Tool, icon: Minus, label: "Line" },
    {
      id: "eraser" as Tool,
      icon: Eraser,
      label: "Eraser (Coming Soon)",
      disabled: true,
    },
  ];

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20 z-50">
      <div className="flex flex-col gap-2">
        {/* Undo/Redo Controls (Disabled for now) */}
        <div className="flex flex-col gap-1">
          <button
            disabled
            className="p-2 rounded-md transition-all duration-200 text-white/30 cursor-not-allowed"
            title="Undo (Coming Soon)"
          >
            <Undo size={16} />
          </button>
          <button
            disabled
            className="p-2 rounded-md transition-all duration-200 text-white/30 cursor-not-allowed"
            title="Redo (Coming Soon)"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 my-2" />

        {/* Drawing Tools */}
        {tools.map(({ id, icon: Icon, label, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && onToolSelect(id)}
            disabled={disabled}
            className={`p-3 rounded-md transition-all duration-200 ${
              disabled
                ? "text-white/30 cursor-not-allowed"
                : selectedTool === id
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/20"
            }`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}
