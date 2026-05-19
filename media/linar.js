(function () {
  const vscode = acquireVsCodeApi();
  const log = document.getElementById("log");
  const choicesEl = document.getElementById("choices");
  const statusEl = document.getElementById("status");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const btnStart = document.getElementById("btn-start");

  function addBubble(text, kind) {
    const div = document.createElement("div");
    div.className = "bubble " + kind;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function renderChoices(options) {
    choicesEl.innerHTML = "";
    if (!options || !options.length) return;
    options.forEach((label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        choicesEl.innerHTML = "";
        vscode.postMessage({ type: "choice", value: label });
      });
      choicesEl.appendChild(btn);
    });
  }

  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg.type === "say") addBubble(msg.text, "linar");
    if (msg.type === "narrator") addBubble(msg.text, "narrator");
    if (msg.type === "choices") renderChoices(msg.options);
    if (msg.type === "busy") {
      statusEl.textContent = msg.busy ? "đang suy nghĩ…" : "";
    }
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addBubble(text, "user");
    chatInput.value = "";
    vscode.postMessage({ type: "chat", text });
  });

  btnStart.addEventListener("click", () => {
    vscode.postMessage({ type: "start" });
  });
})();
