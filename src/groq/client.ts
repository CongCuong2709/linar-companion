import * as vscode from "vscode";
import type {
  ChatCompletionResponse,
  ChatMessage,
  GroqTool,
} from "./types";

const GROQ_BASE = "https://api.groq.com/openai/v1";
const SECRET_KEY = "linar.groq.apiKey";

export async function getGroqApiKey(
  secrets: vscode.SecretStorage
): Promise<string | undefined> {
  return secrets.get(SECRET_KEY);
}

export async function setGroqApiKey(
  secrets: vscode.SecretStorage,
  key: string
): Promise<void> {
  await secrets.store(SECRET_KEY, key.trim());
}

export async function promptForApiKey(
  secrets: vscode.SecretStorage
): Promise<string | undefined> {
  const existing = await getGroqApiKey(secrets);
  const value = await vscode.window.showInputBox({
    title: "Groq API Key",
    prompt: "Get a key at console.groq.com",
    password: true,
    value: existing ? "••••••••" : undefined,
    ignoreFocusOut: true,
    validateInput: (v) =>
      v === "••••••••" || v.trim().length > 0
        ? null
        : "API key is required",
  });
  if (!value) {
    return undefined;
  }
  if (value !== "••••••••") {
    await setGroqApiKey(secrets, value);
  }
  return getGroqApiKey(secrets);
}

export async function chatCompletion(
  secrets: vscode.SecretStorage,
  messages: ChatMessage[],
  tools?: GroqTool[]
): Promise<ChatCompletionResponse> {
  const apiKey = await getGroqApiKey(secrets);
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const config = vscode.workspace.getConfiguration("linar");
  const model = config.get<string>("groq.model", "llama-3.3-70b-versatile");
  const max_tokens = config.get<number>("groq.maxTokens", 2048);
  const useJson = config.get<boolean>("groq.jsonMode", true);

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens,
    temperature: 0.6,
  };

  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  } else if (useJson) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq ${res.status}: ${text}`);
  }

  return (await res.json()) as ChatCompletionResponse;
}
