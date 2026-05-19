export interface LinarAction {
  tool: string;
  args: Record<string, unknown>;
}

/** Parse model output: JSON actions, markdown JSON, or Groq <function=name{...}> fallback. */
export function parseActions(raw: string): LinarAction[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  const fromJson = tryParseJsonActions(trimmed);
  if (fromJson.length) {
    return fromJson;
  }

  const fromTags = parseFunctionTags(trimmed);
  if (fromTags.length) {
    return fromTags;
  }

  // Plain prose — show as one say
  return [{ tool: "say", args: { text: trimmed } }];
}

function tryParseJsonActions(text: string): LinarAction[] {
  const candidates: string[] = [text];

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) {
    candidates.push(fence[1].trim());
  }

  const brace = extractOuterJsonObject(text);
  if (brace) {
    candidates.push(brace);
  }

  for (const c of candidates) {
    try {
      const data = JSON.parse(c) as unknown;
      const actions = normalizeActions(data);
      if (actions.length) {
        return actions;
      }
    } catch {
      /* next */
    }
  }
  return [];
}

function extractOuterJsonObject(text: string): string | undefined {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }
  return undefined;
}

function normalizeActions(data: unknown): LinarAction[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const obj = data as Record<string, unknown>;
  const list = obj.actions ?? obj.action;
  if (!Array.isArray(list)) {
    return [];
  }

  const out: LinarAction[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const row = item as Record<string, unknown>;
    const tool = String(row.tool ?? row.name ?? "").trim();
    if (!tool) {
      continue;
    }
    const args =
      row.args && typeof row.args === "object"
        ? (row.args as Record<string, unknown>)
        : stripToolKeys(row);
    out.push({ tool, args });
  }
  return out;
}

function stripToolKeys(row: Record<string, unknown>): Record<string, unknown> {
  const { tool, name, args, ...rest } = row;
  return rest;
}

/** Groq/Llama sometimes emits: <function=say{"text":"hi"}</function> */
function parseFunctionTags(text: string): LinarAction[] {
  const re = /<function=(\w+)\s*(\{[\s\S]*?\})\s*(?:<\/?function>)?/gi;
  const out: LinarAction[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const tool = m[1];
    try {
      const args = JSON.parse(m[2]) as Record<string, unknown>;
      out.push({ tool, args });
    } catch {
      /* skip malformed */
    }
  }
  return out;
}
