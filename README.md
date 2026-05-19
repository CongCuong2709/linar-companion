# Linar Companion

AI coding teacher inside VS Code. **Groq** generates lessons, pacing, and dialogue; the extension only provides tools (say, choices, run Python, practice files, review).

## Setup

1. `npm install && npm run compile`
2. Press **F5** to launch Extension Development Host
3. Open a folder (workspace) for practice files
4. Command palette → **Linar: Set Groq API Key** ([console.groq.com](https://console.groq.com))
5. Open the **Linar** icon in the activity bar → **Bắt đầu / tiếp tục buổi học**

## Groq

- API: `https://api.groq.com/openai/v1/chat/completions`
- Default model: `llama-3.3-70b-versatile` (change in Settings → `linar.groq.model`)
- Uses **JSON actions** (not native tool calling) — works reliably with Llama on Groq
- Key is stored in VS Code Secret Storage (not in repo)

## Commands

| Command | Action |
|---------|--------|
| Linar: Set Groq API Key | Store API key |
| Linar: Start / Continue Lesson | Start agent loop |
| Linar: Review Current Practice File | Send active file to Groq for feedback |

Optional: `linar.autoReviewOnSave` — auto-review files under `learning/` on save.

## Layout

- `learning/` — practice files created by the AI
- `.linar/progress.md` — short notes the AI appends for continuity
- [`docs/dinh-huong-project-hien-tai.md`](docs/dinh-huong-project-hien-tai.md) — định hướng sản phẩm từ tưởng tượng Linar cũ
- [`docs/demo-kich-ban-thu.md`](docs/demo-kich-ban-thu.md) — kịch bản thử đẹp (tham chiếu QA, không nằm trong prompt)

## Requirements

- Python on PATH for `run_demo` tool
- Groq API key with tool-calling capable model
