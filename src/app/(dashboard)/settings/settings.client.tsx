"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface SettingsFormProps {
  appId: string;
  initialName: string;
  initialPayoutWallet: string;
  initialContractId: string | null;
  developerEmail: string | null;
}

export function SettingsForm({ appId, initialName, initialPayoutWallet, initialContractId, developerEmail }: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [payoutWallet, setPayoutWallet] = useState(initialPayoutWallet);
  const [contractId, setContractId] = useState(initialContractId ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          payoutWallet: payoutWallet.trim(),
          ...(contractId.trim() && { contractId: contractId.trim() }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  const inputClass = "w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-ui text-[14px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all";
  const monoInputClass = "w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-mono text-[13px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all";

  return (
    <div className="flex flex-col gap-6">
      {/* General */}
      <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
        <h2 className="font-display text-[20px] font-medium text-charcoal mb-6 pb-4 border-b border-border-subtle">
          General Information
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Project Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Support Email</label>
            <input type="email" defaultValue={developerEmail ?? ""} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            <p className="font-ui text-[12px] text-text-muted mt-1.5">Email is set during wallet authentication and cannot be changed here.</p>
          </div>
        </div>
      </div>

      {/* Treasury */}
      <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
        <h2 className="font-display text-[20px] font-medium text-charcoal mb-6 pb-4 border-b border-border-subtle">
          Treasury & Smart Contract
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Payout Wallet Address</label>
            <input type="text" value={payoutWallet} onChange={(e) => setPayoutWallet(e.target.value)} className={monoInputClass} placeholder="0x..." />
            <p className="font-ui text-[12px] text-text-muted mt-1.5">All USDC subscription revenue will be routed instantly to this address. Recommend using a multisig (e.g., Safe).</p>
          </div>
          <div>
            <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">On-Chain App ID (bytes32)</label>
            <input type="text" value={contractId} onChange={(e) => setContractId(e.target.value)} className={monoInputClass} placeholder="0x0000... (from VrenRegistry.registerApp())" />
            <p className="font-ui text-[12px] text-text-muted mt-1.5">The bytes32 appId returned by your VrenRegistry.registerApp() transaction. Leave blank if not yet deployed.</p>
          </div>
        </div>
      </div>

      {/* Status feedback */}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#fff0f0] border border-terracotta/30 rounded-lg">
          <XCircle className="w-4 h-4 text-terracotta shrink-0" />
          <span className="font-ui text-[13px] text-terracotta">{errorMsg}</span>
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#eefcf0] border border-[#28C840]/30 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-[#28C840] shrink-0" />
          <span className="font-ui text-[13px] text-[#28C840]">Settings saved successfully.</span>
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-md hover:bg-[#c94b46] disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-ui text-[14px] font-semibold shadow-md"
        >
          {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
