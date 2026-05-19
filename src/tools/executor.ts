import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const execAsync = promisify(exec);

function workspaceRoot(): vscode.Uri | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri;
}

function learningDir(): string {
  return vscode.workspace
    .getConfiguration("linar")
    .get<string>("learningFolder", "learning");
}

export async function runPythonDemo(code: string): Promise<string> {
  const root = workspaceRoot();
  if (!root) {
    return JSON.stringify({ error: "No workspace folder open" });
  }

  const dir = path.join(root.fsPath, ".linar", "tmp");
  await mkdir(dir, { recursive: true });
  const scriptPath = path.join(dir, "_demo.py");
  await writeFile(scriptPath, code, "utf8");

  const py = process.platform === "win32" ? "python" : "python3";
  try {
    const { stdout, stderr } = await execAsync(`"${py}" "${scriptPath}"`, {
      cwd: root.fsPath,
      timeout: 15_000,
      maxBuffer: 512_000,
    });
    const term = vscode.window.createTerminal({
      name: "Linar Demo",
      cwd: root.fsPath,
    });
    term.show(true);
    term.sendText(`${py} "${scriptPath}"`);
    return JSON.stringify({
      ok: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    return JSON.stringify({
      ok: false,
      stdout: err.stdout?.trim() ?? "",
      stderr: err.stderr?.trim() ?? "",
      error: err.message ?? "Python run failed",
    });
  }
}

export async function createPracticeFile(
  filename: string,
  content: string
): Promise<string> {
  const root = workspaceRoot();
  if (!root) {
    return JSON.stringify({ error: "No workspace folder open" });
  }

  const rel = path.join(learningDir(), filename);
  const full = path.join(root.fsPath, rel);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, content, "utf8");

  const doc = await vscode.workspace.openTextDocument(
    vscode.Uri.file(full)
  );
  await vscode.window.showTextDocument(doc, { preview: false });

  return JSON.stringify({
    ok: true,
    path: rel.replace(/\\/g, "/"),
    message: "File opened. User should edit TODOs and save.",
  });
}

export async function readWorkspaceFile(
  relativePath: string
): Promise<string> {
  const root = workspaceRoot();
  if (!root) {
    return JSON.stringify({ error: "No workspace folder open" });
  }

  const full = path.join(root.fsPath, relativePath);
  try {
    const content = await readFile(full, "utf8");
    return JSON.stringify({ ok: true, path: relativePath, content });
  } catch (e) {
    return JSON.stringify({
      error: `Cannot read ${relativePath}: ${(e as Error).message}`,
    });
  }
}

export async function updateProgressNote(note: string): Promise<string> {
  const root = workspaceRoot();
  if (!root) {
    return JSON.stringify({ error: "No workspace folder open" });
  }

  const dir = path.join(root.fsPath, ".linar");
  await mkdir(dir, { recursive: true });
  const progressPath = path.join(dir, "progress.md");
  const line = `- ${new Date().toISOString().slice(0, 10)}: ${note}\n`;

  let existing = "";
  try {
    existing = await readFile(progressPath, "utf8");
  } catch {
    existing = "# Linar progress (AI-maintained)\n\n";
  }

  await writeFile(progressPath, existing + line, "utf8");
  return JSON.stringify({ ok: true, path: ".linar/progress.md" });
}

export async function loadProgressContext(): Promise<string> {
  const root = workspaceRoot();
  if (!root) {
    return "";
  }
  const progressPath = path.join(root.fsPath, ".linar", "progress.md");
  try {
    const content = await readFile(progressPath, "utf8");
    return `\n\n[Previous progress notes]\n${content.slice(-2000)}`;
  } catch {
    return "";
  }
}
