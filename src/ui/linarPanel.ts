import * as vscode from "vscode";

export type WebviewInbound =
  | { type: "choice"; value: string }
  | { type: "chat"; text: string }
  | { type: "start" };

export class LinarPanel implements vscode.WebviewViewProvider {
  public static readonly viewId = "linar.panel";

  private view?: vscode.WebviewView;
  private onInbound?: (msg: WebviewInbound) => void;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, "media"),
      ],
    };
    webviewView.webview.html = this.getHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((msg: WebviewInbound) => {
      this.onInbound?.(msg);
    });
  }

  setMessageHandler(handler: (msg: WebviewInbound) => void): void {
    this.onInbound = handler;
  }

  appendSay(text: string): void {
    this.post({ type: "say", text });
  }

  appendNarrator(text: string): void {
    this.post({ type: "narrator", text });
  }

  showChoices(options: string[]): void {
    this.post({ type: "choices", options });
  }

  setBusy(busy: boolean): void {
    this.post({ type: "busy", busy });
  }

  clearChoices(): void {
    this.post({ type: "choices", options: [] });
  }

  private post(payload: unknown): void {
    void this.view?.webview.postMessage(payload);
  }

  private getHtml(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "linar.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "linar.js")
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri}" />
  <title>Linar</title>
</head>
<body>
  <div id="app">
    <header class="header">
      <span class="avatar">L</span>
      <span class="title">Linar</span>
      <span id="status" class="status"></span>
    </header>
    <div id="log" class="log"></div>
    <div id="choices" class="choices"></div>
    <form id="chat-form" class="chat-form">
      <input id="chat-input" type="text" placeholder="Nhắn Linar..." autocomplete="off" />
      <button type="submit">Gửi</button>
    </form>
    <button id="btn-start" class="btn-start">Bắt đầu / tiếp tục buổi học</button>
  </div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let n = "";
  for (let i = 0; i < 32; i++) {
    n += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return n;
}
