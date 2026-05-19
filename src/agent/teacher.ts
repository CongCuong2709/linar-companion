import * as vscode from "vscode";
import { chatCompletion, promptForApiKey } from "../groq/client";
import type { ChatMessage } from "../groq/types";
import {
  createPracticeFile,
  loadProgressContext,
  readWorkspaceFile,
  runPythonDemo,
  updateProgressNote,
} from "../tools/executor";
import { parseActions, type LinarAction } from "./parseActions";
import { LINAR_SYSTEM_PROMPT } from "./systemPrompt";
import type { LinarPanel } from "../ui/linarPanel";

export type TeacherState = "idle" | "running" | "waiting_choice";

const TOOLS_WITH_FEEDBACK = new Set([
  "run_demo",
  "create_practice_file",
  "read_file",
  "update_progress",
]);

export class TeacherSession {
  private messages: ChatMessage[] = [];
  private state: TeacherState = "idle";
  private pendingChoiceResolve?: (choice: string) => void;

  constructor(
    private readonly secrets: vscode.SecretStorage,
    private readonly panel: LinarPanel
  ) {}

  getState(): TeacherState {
    return this.state;
  }

  async start(userMessage?: string): Promise<void> {
    const hasKey = await promptForApiKey(this.secrets);
    if (!hasKey) {
      vscode.window.showWarningMessage("Linar needs a Groq API key.");
      return;
    }

    const progress = await loadProgressContext();
    this.messages = [
      { role: "system", content: LINAR_SYSTEM_PROMPT + progress },
    ];

    const opener =
      userMessage ??
      "Bắt đầu buổi học. Chào user và hỏi họ muốn học gì hoặc đánh giá trình độ ngắn.";

    await this.runAgentLoop(opener);
  }

  async continueWithUserText(text: string): Promise<void> {
    this.messages.push({ role: "user", content: text });
    await this.runAgentLoop();
  }

  async continueWithChoice(choice: string): Promise<void> {
    if (this.pendingChoiceResolve) {
      this.pendingChoiceResolve(choice);
      this.pendingChoiceResolve = undefined;
      return;
    }
    await this.continueWithUserText(`[User chose] ${choice}`);
  }

  async reviewFile(relativePath: string): Promise<void> {
    const content = await readWorkspaceFile(relativePath);
    await this.continueWithUserText(
      `User saved practice file. Path: ${relativePath}. Content:\n${content}\n\nReview their work.`
    );
  }

  private waitForChoice(): Promise<string> {
    return new Promise((resolve) => {
      this.pendingChoiceResolve = resolve;
    });
  }

  private async runAgentLoop(initialUser?: string): Promise<void> {
    if (initialUser) {
      this.messages.push({ role: "user", content: initialUser });
    }

    this.state = "running";
    this.panel.setBusy(true);

    try {
      for (let step = 0; step < 24; step++) {
        const res = await chatCompletion(this.secrets, this.messages);
        const msg = res.choices[0]?.message;
        if (!msg?.content) {
          break;
        }

        const content = msg.content.trim();
        this.messages.push({ role: "assistant", content });

        const actions = parseActions(content);
        const { waitedForChoice, toolSummary } = await this.runActions(actions);

        if (waitedForChoice) {
          continue;
        }

        if (toolSummary) {
          this.messages.push({
            role: "user",
            content: `[Tool results]\n${toolSummary}\n\nContinue teaching. Reply with JSON actions only.`,
          });
          continue;
        }

        break;
      }
    } catch (e) {
      const err = (e as Error).message;
      if (err === "NO_API_KEY") {
        await promptForApiKey(this.secrets);
      } else {
        vscode.window.showErrorMessage(`Linar / Groq: ${err}`);
        this.panel.appendNarrator(`(Lỗi kết nối Groq: ${err})`);
      }
    } finally {
      this.state = "idle";
      this.panel.setBusy(false);
    }
  }

  private async runActions(
    actions: LinarAction[]
  ): Promise<{ waitedForChoice: boolean; toolSummary: string }> {
    const summaries: string[] = [];
    let waitedForChoice = false;

    for (const { tool, args } of actions) {
      const result = await this.executeTool(tool, args);
      if (TOOLS_WITH_FEEDBACK.has(tool)) {
        summaries.push(`${tool}: ${result}`);
      }

      if (tool === "offer_choices") {
        this.state = "waiting_choice";
        this.panel.setBusy(false);
        const picked = await this.waitForChoice();
        this.state = "running";
        this.panel.setBusy(true);
        this.messages.push({
          role: "user",
          content: `[User chose] ${picked}`,
        });
        return { waitedForChoice: true, toolSummary: "" };
      }
    }

    return {
      waitedForChoice,
      toolSummary: summaries.join("\n"),
    };
  }

  private async executeTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<string> {
    switch (name) {
      case "say": {
        const text = String(args.text ?? "");
        this.panel.appendSay(text);
        return JSON.stringify({ ok: true });
      }
      case "offer_choices": {
        const prompt = args.prompt ? String(args.prompt) : undefined;
        const options = (args.options as string[]) ?? [];
        if (prompt) {
          this.panel.appendSay(prompt);
        }
        this.panel.showChoices(options);
        return JSON.stringify({ ok: true, waiting: true });
      }
      case "run_demo":
        return runPythonDemo(String(args.code ?? ""));
      case "create_practice_file":
        return createPracticeFile(
          String(args.filename ?? "practice.py"),
          String(args.content ?? "")
        );
      case "read_file":
        return readWorkspaceFile(String(args.relativePath ?? ""));
      case "update_progress":
        return updateProgressNote(String(args.note ?? ""));
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  }
}
