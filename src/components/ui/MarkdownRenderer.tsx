"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type BlockType =
  | { type: "heading"; level: number; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "blockquote"; text: string }
  | { type: "bullet_list"; items: string[] }
  | { type: "ordered_list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; text: string }
  | { type: "hr" };

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2.5 text-xs leading-relaxed text-slate-200 markdown-body ${className}`}>
      {blocks.map((block, idx) => (
        <React.Fragment key={idx}>{renderBlock(block, idx)}</React.Fragment>
      ))}
    </div>
  );
}

function parseBlocks(raw: string): BlockType[] {
  const lines = raw.split("\n");
  const blocks: BlockType[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Code Block
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++;
      }
      blocks.push({
        type: "code",
        language: language || "plaintext",
        code: codeLines.join("\n"),
      });
      continue;
    }

    // Headings (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        text: quoteLines.join(" "),
      });
      continue;
    }

    // Bullet List (- or * or +)
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({
        type: "bullet_list",
        items,
      });
      continue;
    }

    // Ordered List (1. or 2.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({
        type: "ordered_list",
        items,
      });
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headerLine = trimmed;
      const headers = headerLine
        .split("|")
        .slice(1, -1)
        .map((h) => h.trim());
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const rowCells = lines[i]
          .trim()
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        rows.push(rowCells);
        i++;
      }
      blocks.push({
        type: "table",
        headers,
        rows,
      });
      continue;
    }

    // Paragraph (collect non-empty lines until empty line or other block)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(---|___|\*\*\*)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paraLines.join(" "),
      });
    }
  }

  return blocks;
}

function renderBlock(block: BlockType, key: number) {
  switch (block.type) {
    case "heading": {
      if (block.level === 1) {
        return (
          <h1 key={key} className="text-base font-bold text-white tracking-tight pt-2 pb-1 border-b border-slate-800">
            {renderInline(block.text)}
          </h1>
        );
      }
      if (block.level === 2) {
        return (
          <h2 key={key} className="text-sm font-bold text-slate-100 pt-1.5 pb-0.5">
            {renderInline(block.text)}
          </h2>
        );
      }
      if (block.level === 3) {
        return (
          <h3 key={key} className="text-xs font-bold uppercase tracking-wider text-indigo-300 pt-1">
            {renderInline(block.text)}
          </h3>
        );
      }
      return (
        <h4 key={key} className="text-xs font-semibold text-slate-200 pt-1">
          {renderInline(block.text)}
        </h4>
      );
    }

    case "paragraph":
      return (
        <p key={key} className="leading-relaxed text-slate-200">
          {renderInline(block.text)}
        </p>
      );

    case "bullet_list":
      return (
        <ul key={key} className="space-y-1.5 my-1.5 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "ordered_list":
      return (
        <ol key={key} className="space-y-1.5 my-1.5 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed text-slate-200">
              <span className="font-mono font-bold text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.2 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-2 border-indigo-500/60 bg-indigo-950/20 px-3 py-2 rounded-r-lg my-2 text-slate-300 italic"
        >
          {renderInline(block.text)}
        </blockquote>
      );

    case "code":
      return <CodeBlock key={key} code={block.code} language={block.language} />;

    case "table":
      return (
        <div key={key} className="overflow-x-auto my-2 rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {block.headers.map((h, hi) => (
                  <th key={hi} className="p-2 font-bold text-slate-200">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {block.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-900/40">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2 text-slate-300">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "hr":
      return <hr key={key} className="border-slate-800 my-3" />;

    default:
      return null;
  }
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-[11px]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/80 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-slate-200 whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting: bold, italic, inline code, links, strikethrough.
 */
export function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Tokenize regex for inline elements
  // 1. Bold: **text** or __text__
  // 2. Italic: *text* or _text_
  // 3. Inline code: `text`
  // 4. Link: [text](url)
  // 5. Strikethrough: ~~text~~
  const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|\[.*?\]\(.*?\)|\~\~.*?\~\~)/g;

  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text** or __text__
    if ((part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
        (part.startsWith("__") && part.endsWith("__") && part.length >= 4)) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-white tracking-tight">
          {renderInline(inner)}
        </strong>
      );
    }

    // Inline code: `text`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-medium inline-block my-0.5"
        >
          {inner}
        </code>
      );
    }

    // Strikethrough: ~~text~~
    if (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <del key={index} className="line-through text-slate-500">
          {renderInline(inner)}
        </del>
      );
    }

    // Links: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Italic: *text* or _text_
    if ((part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) ||
        (part.startsWith("_") && part.endsWith("_") && part.length >= 2 && !part.startsWith("__"))) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-200">
          {renderInline(inner)}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
