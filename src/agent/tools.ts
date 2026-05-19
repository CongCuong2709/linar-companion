import type { GroqTool } from "../groq/types";

/** Tools the LLM can call — platform only, no lesson content. */
export const LINAR_TOOLS: GroqTool[] = [
  {
    type: "function",
    function: {
      name: "say",
      description:
        "Linar speaks in the visual novel panel. Keep lines short; split long explanations across multiple say calls.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Dialogue line (Vietnamese ok)" },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "offer_choices",
      description:
        "Show clickable choices and WAIT for the user. Use after a question or branch. Do not call other tools in the same turn before user picks.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Optional short line before choices",
          },
          options: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 6,
            description: "2–6 choice labels",
          },
        },
        required: ["options"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_demo",
      description:
        "Run Python snippet in the workspace terminal and return stdout/stderr. Use for short demos (variables, print, etc.).",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "Python source to execute" },
        },
        required: ["code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_practice_file",
      description:
        "Create or overwrite a practice file under the learning folder, open it in the editor, and tell the user to edit and save.",
      parameters: {
        type: "object",
        properties: {
          filename: {
            type: "string",
            description: "e.g. variables_intro.py (relative to learning folder)",
          },
          content: { type: "string", description: "Full file content with TODOs" },
        },
        required: ["filename", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read a workspace file (e.g. after user saved practice code).",
      parameters: {
        type: "object",
        properties: {
          relativePath: {
            type: "string",
            description: "Path relative to workspace root, e.g. learning/variables_intro.py",
          },
        },
        required: ["relativePath"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_progress",
      description:
        "Append a short note to .linar/progress.md about what the user learned or struggled with (for continuity next session).",
      parameters: {
        type: "object",
        properties: {
          note: { type: "string", description: "One or two sentences" },
        },
        required: ["note"],
      },
    },
  },
];
