import React from "react";
import { Key, Plus, Copy, MoreHorizontal, AlertCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) redirect("/login");

  const apiKeys = await db.apiKey.findMany({
    where: { developerId: developer.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            API Keys
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-150">
            Generate and manage keys to authenticate requests from your backend servers.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-parchment rounded-md hover:bg-charcoal/90 transition-colors font-ui text-[14px] font-medium shadow-md">
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="bg-[#fffdf7] border border-[#e5e0d8] rounded-xl p-5 flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
        <div>
          <h4 className="font-ui text-[14px] font-semibold text-charcoal mb-1">Keep your keys secure</h4>
          <p className="font-body text-[14px] text-text-secondary">
            Never expose your secret keys in client-side code (like browsers or mobile apps). Use them only on your backend server to interact with the VREN API.
          </p>
        </div>
      </div>

      <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-border-subtle bg-[#fcfcfc]">
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Key Name</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Secret Key</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Created</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Last Used</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-ui text-[14px] text-text-muted">
                    No API keys yet. Generate one to authenticate your backend server.
                  </td>
                </tr>
              ) : apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <Key className="w-4 h-4 text-text-muted" />
                      <span className="font-ui text-[14px] text-charcoal font-medium">{k.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-[13px] text-text-secondary bg-[#f5f5f5] px-2 py-1 rounded">
                        {k.keyPrefix}
                      </code>
                      <button className="p-1 text-text-muted hover:text-charcoal transition-colors" title="Copy key prefix">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">{formatDate(k.createdAt)}</td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">
                    {k.lastUsedAt ? formatRelativeTime(k.lastUsedAt) : "Never"}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="p-2 text-text-muted hover:text-charcoal hover:bg-white rounded-md transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent group-hover:border-border-subtle">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
