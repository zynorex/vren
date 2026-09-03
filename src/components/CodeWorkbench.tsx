"use client";

import { useState } from "react";

const CODE_TABS = [
  {
    label: "React Hook",
    file: "app.tsx",
    lines: [
      { num: 1, tokens: [{ type: "keyword", text: "import" }, { type: "plain", text: " { useGate } " }, { type: "keyword", text: "from" }, { type: "plain", text: " " }, { type: "string", text: '"@vren/sdk/react"' }, { type: "plain", text: ";" }] },
      { num: 2, tokens: [] },
      { num: 3, tokens: [{ type: "keyword", text: "function" }, { type: "plain", text: " " }, { type: "fn", text: "PremiumDashboard" }, { type: "plain", text: "() {" }] },
      { num: 4, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "const" }, { type: "plain", text: " { data } = " }, { type: "fn", text: "useGate" }, { type: "plain", text: "(" }, { type: "string", text: '"pro"' }, { type: "plain", text: ");" }] },
      { num: 5, tokens: [] },
      { num: 6, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "if" }, { type: "plain", text: " (!data?.access) " }, { type: "keyword", text: "return" }, { type: "plain", text: " <UpgradePrompt />;" }] },
      { num: 7, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "return" }, { type: "plain", text: " <Dashboard />;" }] },
      { num: 8, tokens: [{ type: "plain", text: "}" }] },
    ],
  },
  {
    label: "Subscribe",
    file: "checkout.tsx",
    lines: [
      { num: 1, tokens: [{ type: "keyword", text: "import" }, { type: "plain", text: " { useSubscribe, useCancel } " }, { type: "keyword", text: "from" }, { type: "plain", text: " " }, { type: "string", text: '"@vren/sdk/react"' }, { type: "plain", text: ";" }] },
      { num: 2, tokens: [] },
      { num: 3, tokens: [{ type: "keyword", text: "function" }, { type: "plain", text: " " }, { type: "fn", text: "Checkout" }, { type: "plain", text: "() {" }] },
      { num: 4, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "const" }, { type: "plain", text: " { subscribe, isPending } = " }, { type: "fn", text: "useSubscribe" }, { type: "plain", text: "();" }] },
      { num: 5, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "const" }, { type: "plain", text: " { cancel } = " }, { type: "fn", text: "useCancel" }, { type: "plain", text: "();" }] },
      { num: 6, tokens: [] },
      { num: 7, tokens: [{ type: "plain", text: "  " }, { type: "keyword", text: "return" }, { type: "plain", text: " (" }] },
      { num: 8, tokens: [{ type: "plain", text: '    <button onClick={() => subscribe("1")}>' }] },
      { num: 9, tokens: [{ type: "plain", text: "      {isPending ? " }, { type: "string", text: '"Confirming..."' }, { type: "plain", text: " : " }, { type: "string", text: '"Subscribe"' }, { type: "plain", text: "}" }] },
      { num: 10, tokens: [{ type: "plain", text: "    </button>" }] },
      { num: 11, tokens: [{ type: "plain", text: "  );" }] },
      { num: 12, tokens: [{ type: "plain", text: "}" }] },
    ],
  },
  {
    label: "Server SDK",
    file: "api/gate.ts",
    lines: [
      { num: 1, tokens: [{ type: "keyword", text: "import" }, { type: "plain", text: " { Vren } " }, { type: "keyword", text: "from" }, { type: "plain", text: " " }, { type: "string", text: '"@vren/sdk"' }, { type: "plain", text: ";" }] },
      { num: 2, tokens: [] },
      { num: 3, tokens: [{ type: "keyword", text: "const" }, { type: "plain", text: " vren = " }, { type: "keyword", text: "new" }, { type: "plain", text: " " }, { type: "fn", text: "Vren" }, { type: "plain", text: "({" }] },
      { num: 4, tokens: [{ type: "plain", text: "  appId: " }, { type: "string", text: '"0xabc...def"' }, { type: "plain", text: "," }] },
      { num: 5, tokens: [{ type: "plain", text: "  network: " }, { type: "string", text: '"polygon"' }, { type: "plain", text: "," }] },
      { num: 6, tokens: [{ type: "plain", text: "});" }] },
      { num: 7, tokens: [] },
      { num: 8, tokens: [{ type: "keyword", text: "const" }, { type: "plain", text: " result = " }, { type: "keyword", text: "await" }, { type: "plain", text: " vren." }, { type: "fn", text: "gate" }, { type: "plain", text: "(" }, { type: "string", text: '"pro"' }, { type: "plain", text: ", wallet);" }] },
      { num: 9, tokens: [{ type: "comment", text: "// { access: true, tier: \"1\", expiresAt: ... }" }] },
    ],
  },
  {
    label: "Webhook",
    file: "webhooks/polygon.ts",
    lines: [
      { num: 1, tokens: [{ type: "comment", text: "// Incoming Alchemy webhook payload" }] },
      { num: 2, tokens: [{ type: "plain", text: "{" }] },
      { num: 3, tokens: [{ type: "plain", text: '  "eventType": ' }, { type: "string", text: '"Subscribed"' }, { type: "plain", text: "," }] },
      { num: 4, tokens: [{ type: "plain", text: '  "transactionHash": ' }, { type: "string", text: '"0x7f2c..."' }, { type: "plain", text: "," }] },
      { num: 5, tokens: [{ type: "plain", text: '  "data": {' }] },
      { num: 6, tokens: [{ type: "plain", text: '    "subscriber": ' }, { type: "string", text: '"0x71C7..."' }, { type: "plain", text: "," }] },
      { num: 7, tokens: [{ type: "plain", text: '    "planId": ' }, { type: "fn", text: "1" }, { type: "plain", text: "," }] },
      { num: 8, tokens: [{ type: "plain", text: '    "expiry": ' }, { type: "fn", text: "1756684800" }] },
      { num: 9, tokens: [{ type: "plain", text: "  }" }] },
      { num: 10, tokens: [{ type: "plain", text: "}" }] },
    ],
  },
];

const TOKEN_COLORS: Record<string, string> = {
  keyword: "text-terracotta",
  string: "text-sage",
  fn: "text-warm-gold",
  comment: "text-[#666]",
  plain: "text-[#e0e0e0]",
};

export function CodeWorkbench() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = CODE_TABS[activeTab];

  const plainText = tab.lines
    .map((l) => l.tokens.map((t) => t.text).join(""))
    .join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161616] flex flex-col rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl overflow-hidden">
      {/* Tab bar + file name + copy button */}
      <div className="w-full border-b border-[#2a2a2a] flex items-center">
        <div className="flex gap-2 px-5 py-3">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-2 font-mono text-[11px] text-[#555] tracking-wider flex-1">{tab.file}</div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 font-mono text-[11px] text-[#666] hover:text-[#aaa] transition-colors"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] overflow-x-auto">
        {CODE_TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2.5 font-ui text-[12px] tracking-wide whitespace-nowrap transition-all relative ${
              i === activeTab
                ? "text-parchment"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            {t.label}
            {i === activeTab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
            )}
          </button>
        ))}
      </div>

      {/* Code area with line numbers */}
      <div className="p-6 lg:p-8 flex-1 flex overflow-x-auto">
        {/* Line numbers gutter */}
        <div className="pr-5 select-none border-r border-[#2a2a2a] mr-5 shrink-0">
          {tab.lines.map((l) => (
            <div key={l.num} className="font-mono text-[13px] leading-[1.85] text-[#444] text-right">
              {l.num}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre className="font-mono text-[13px] lg:text-[14px] leading-[1.85] whitespace-pre flex-1">
          {tab.lines.map((line) => (
            <div key={line.num}>
              {line.tokens.length === 0 ? "\n" : line.tokens.map((token, ti) => (
                <span key={ti} className={TOKEN_COLORS[token.type] || "text-[#e0e0e0]"}>
                  {token.text}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
