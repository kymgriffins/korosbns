/**
 * Editor.js JSON detection and HTML conversion for article body fields.
 */

export type EditorJsBlock = {
  type: string;
  data: Record<string, unknown>;
};

export type EditorJsPayload = {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function editorBlocksToHtml(blocks: EditorJsBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const btype = block.type;
    const d = block.data ?? {};
    if (btype === "paragraph") {
      parts.push(`<p>${String(d.text ?? "")}</p>`);
    } else if (btype === "header") {
      const level = Number(d.level ?? 2);
      parts.push(`<h${level}>${String(d.text ?? "")}</h${level}>`);
    } else if (btype === "list") {
      const tag = d.style === "ordered" ? "ol" : "ul";
      const items = Array.isArray(d.items) ? d.items : [];
      const lis = items.map((i) => `<li>${String(i)}</li>`).join("");
      parts.push(`<${tag}>${lis}</${tag}>`);
    } else if (btype === "image") {
      const file = d.file as { url?: string } | undefined;
      const url = file?.url ?? String(d.url ?? "");
      const caption = String(d.caption ?? "");
      const capHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
      parts.push(
        `<figure><img src="${url}" alt="${caption}" style="max-width:100%"/>${capHtml}</figure>`,
      );
    } else if (btype === "quote") {
      const text = String(d.text ?? "");
      const caption = String(d.caption ?? "");
      const cite = caption ? `<cite>— ${caption}</cite>` : "";
      parts.push(`<blockquote><p>${text}</p>${cite}</blockquote>`);
    } else if (btype === "code") {
      parts.push(`<pre><code>${escapeHtml(String(d.code ?? ""))}</code></pre>`);
    } else if (btype === "delimiter") {
      parts.push("<hr>");
    } else if (btype === "embed") {
      const src = String(d.embed ?? d.source ?? "");
      parts.push(
        `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:8px;margin:1rem 0">` +
          `<iframe src="${src}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>`,
      );
    } else if (btype === "table") {
      const rows = Array.isArray(d.content) ? d.content : [];
      const rowHtml = rows
        .map((row) => {
          const cells = (Array.isArray(row) ? row : []).map((c) => `<td>${String(c)}</td>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      parts.push(`<table><tbody>${rowHtml}</tbody></table>`);
    } else if (btype === "checklist") {
      const items = Array.isArray(d.items) ? d.items : [];
      const itemsHtml = items
        .map((item) => {
          const row = item as { text?: string; checked?: boolean };
          const checked = row.checked ? " checked" : "";
          return `<li style="list-style:none"><input type="checkbox"${checked} disabled> ${String(row.text ?? "")}</li>`;
        })
        .join("");
      parts.push(`<ul class="checklist">${itemsHtml}</ul>`);
    } else if (btype === "raw") {
      parts.push(String(d.html ?? ""));
    }
  }
  return parts.join("\n");
}

export function parseEditorJsBody(body: string | null | undefined): EditorJsPayload | null {
  if (!body || typeof body !== "string") return null;
  const trimmed = body.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    let blocks = obj.blocks;
    if (blocks === undefined && "time" in obj) blocks = [];
    if (!Array.isArray(blocks)) return null;
    return { time: obj.time as number | undefined, blocks: blocks as EditorJsBlock[], version: obj.version as string | undefined };
  } catch {
    return null;
  }
}

export function isEditorJsBody(body: string | null | undefined): boolean {
  return parseEditorJsBody(body) !== null;
}

/** Resolve display HTML from body_html / body fields; never returns raw Editor.js JSON. */
export function resolveArticleBodyHtml(
  bodyHtml: string | null | undefined,
  body?: string | null | undefined,
): string {
  const html = (bodyHtml || "").trim();
  if (html) return html;

  const parsed = parseEditorJsBody(body);
  if (parsed) {
    if (!parsed.blocks.length) return "";
    return editorBlocksToHtml(parsed.blocks);
  }

  return (body || "").trim();
}
