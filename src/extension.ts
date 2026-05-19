import * as vscode from "vscode";
import { TeacherSession } from "./agent/teacher";
import { promptForApiKey } from "./groq/client";
import { LinarPanel } from "./ui/linarPanel";

let session: TeacherSession | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const panel = new LinarPanel(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(LinarPanel.viewId, panel)
  );

  const getSession = (): TeacherSession => {
    if (!session) {
      session = new TeacherSession(context.secrets, panel);
    }
    return session;
  };

  panel.setMessageHandler((msg) => {
    const s = getSession();
    if (msg.type === "start") {
      void s.start();
    } else if (msg.type === "choice") {
      void s.continueWithChoice(msg.value);
    } else if (msg.type === "chat") {
      void s.continueWithUserText(msg.text);
    }
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("linar.setApiKey", () => {
      void promptForApiKey(context.secrets);
    }),
    vscode.commands.registerCommand("linar.openPanel", async () => {
      await vscode.commands.executeCommand("workbench.view.extension.linar");
    }),
    vscode.commands.registerCommand("linar.startLesson", () => {
      void getSession().start();
    }),
    vscode.commands.registerCommand("linar.reviewSavedFile", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        void vscode.window.showWarningMessage("Open a practice file first.");
        return;
      }
      const root = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!root) {
        return;
      }
      const rel = vscode.workspace.asRelativePath(editor.document.uri);
      void getSession().reviewFile(rel);
    })
  );

  // Optional: review when user saves a file under learning/
  const learningFolder = vscode.workspace
    .getConfiguration("linar")
    .get<string>("learningFolder", "learning");

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      const root = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!root) {
        return;
      }
      const rel = vscode.workspace.asRelativePath(doc.uri);
      if (!rel.replace(/\\/g, "/").startsWith(`${learningFolder}/`)) {
        return;
      }
      const auto = vscode.workspace
        .getConfiguration("linar")
        .get<boolean>("autoReviewOnSave", false);
      if (auto && session) {
        void session.reviewFile(rel);
      }
    })
  );

  void vscode.window.showInformationMessage(
    "Linar: set Groq API key (command palette → Linar: Set Groq API Key), then open the Linar sidebar."
  );
}

export function deactivate(): void {
  session = undefined;
}
