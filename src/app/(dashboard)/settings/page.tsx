import React from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings.client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
    include: { apps: { orderBy: { createdAt: "asc" }, take: 1 } },
  });

  const app = developer?.apps[0];

  if (!app) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-200">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">Project Settings</h1>
          <p className="font-body text-[16px] text-text-secondary">Configure your VREN integration, treasury, and app details.</p>
        </div>
        <div className="bg-white border border-dashed border-border-subtle rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <h3 className="font-display text-[20px] font-medium text-charcoal mb-2">No app registered yet</h3>
          <p className="font-body text-[14px] text-text-secondary max-w-85">
            Register your first application to configure settings. You can create an app via the API or dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-200">
      <div>
        <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">Project Settings</h1>
        <p className="font-body text-[16px] text-text-secondary">Configure your VREN integration, treasury, and app details.</p>
      </div>

      <SettingsForm
        appId={app.id}
        initialName={app.name}
        initialPayoutWallet={app.payoutWallet}
        initialContractId={app.contractId}
        developerEmail={developer.email}
      />
    </div>
  );
}
