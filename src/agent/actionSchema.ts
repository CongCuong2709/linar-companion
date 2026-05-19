/** Appended to system prompt — JSON protocol (no native tool_calls). */
export const LINAR_JSON_PROTOCOL = `

## Response format (REQUIRED)

Reply with a single JSON object only. No markdown, no prose outside JSON.

{
  "actions": [
    { "tool": "say", "args": { "text": "one short line" } },
    { "tool": "offer_choices", "args": { "options": ["A", "B"], "prompt": "optional" } }
  ]
}

Available tools:
- say: { "text": string }
- offer_choices: { "options": string[2-6], "prompt"?: string } — then stop; wait for user
- run_demo: { "code": string } — Python snippet
- create_practice_file: { "filename": string, "content": string }
- read_file: { "relativePath": string }
- update_progress: { "note": string }

Rules:
- Multiple say actions are allowed in one response.
- Put offer_choices last when you use it.
- After tool results are sent to you, respond again with JSON actions.
- Never use <function=...> tags or function call syntax.`;
