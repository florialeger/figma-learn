import React from "react";

const PLACEHOLDERS = [
  ["<accent>", "\u0001A\u0001"],
  ["</accent>", "\u0001a\u0001"],
  ["<b>", "\u0001B\u0001"],
  ["</b>", "\u0001b\u0001"],
  ["<br/>", "\u0001BR\u0001"],
  ["<br>", "\u0001BR\u0001"],
  ["<ul>", "\u0001UL\u0001"],
  ["</ul>", "\u0001ul\u0001"],
  ["<li>", "\u0001LI\u0001"],
  ["</li>", "\u0001li\u0001"],
  ["<code>", "\u0001CODE\u0001"],
  ["</code>", "\u0001code\u0001"],
  ["<kbd>", "\u0001KBD\u0001"],
  ["</kbd>", "\u0001kbd\u0001"],
] as const;

const RESTORE = [
  ["\u0001A\u0001", '<span class="body-accent">'],
  ["\u0001a\u0001", "</span>"],
  ["\u0001B\u0001", "<b>"],
  ["\u0001b\u0001", "</b>"],
  ["\u0001BR\u0001", "<br/>"],
  ["\u0001UL\u0001", "<ul>"],
  ["\u0001ul\u0001", "</ul>"],
  ["\u0001LI\u0001", "<li>"],
  ["\u0001li\u0001", "</li>"],
  ["\u0001CODE\u0001", "<code>"],
  ["\u0001code\u0001", "</code>"],
  ["\u0001KBD\u0001", "<kbd>"],
  ["\u0001kbd\u0001", "</kbd>"],
] as const;

export function SafeHtml({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const sanitized = sanitizeHtml(html);
  return (
    <div
      className={className}
      data-safe-html
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

function sanitizeHtml(html: string): string {
  let out = html;
  for (const [tag, ph] of PLACEHOLDERS) {
    out = out.split(tag).join(ph);
  }

  out = out
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  for (const [ph, tag] of RESTORE) {
    out = out.split(ph).join(tag);
  }

  return out;
}
