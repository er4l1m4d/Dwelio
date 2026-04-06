"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { jsPDF } from "jspdf";

type Agreement = {
  id: string;
  tenant_id: string;
  landlord_id: string;
  property_id: string;
  terms: string;
  tenant_signed: boolean;
  landlord_signed: boolean;
};

export default function AgreementPage() {
  const params = useParams();
  const supabase = createSupabaseBrowserClient();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [pending, startTransition] = useTransition();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [landlordName, setLandlordName] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [propertyAddress, setPropertyAddress] = useState<string | null>(null);

  const agreementId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const loadAgreement = async () => {
      const { data, error: fetchError } = await supabase
        .from("tenancy_agreements")
        .select(
          "id, tenant_id, landlord_id, property_id, terms, tenant_signed, landlord_signed",
        )
        .eq("id", agreementId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const agreementData = data as Agreement;
      setAgreement(agreementData);

      const { data: landlord } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", agreementData.landlord_id)
        .single();
      const { data: tenant } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", agreementData.tenant_id)
        .single();
      const { data: property } = await supabase
        .from("properties")
        .select("address")
        .eq("id", agreementData.property_id)
        .single();

      setLandlordName(landlord?.full_name ?? null);
      setTenantName(tenant?.full_name ?? null);
      setPropertyAddress(property?.address ?? null);
    };

    if (agreementId) {
      loadAgreement();
    }
  }, [agreementId, supabase]);

  const handleSign = () => {
    if (!agreement || !checked) return;

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to sign.");
        return;
      }

      const updates: Partial<Agreement> = {};
      if (user.id === agreement.tenant_id) {
        updates.tenant_signed = true;
      }
      if (user.id === agreement.landlord_id) {
        updates.landlord_signed = true;
      }

      const { error: updateError } = await supabase
        .from("tenancy_agreements")
        .update(updates)
        .eq("id", agreement.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setAgreement({ ...agreement, ...updates });
    });
  };

  if (!agreement) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Loading agreement...
      </div>
    );
  }

  const fullySigned = agreement.tenant_signed && agreement.landlord_signed;
  const signedDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDownload = () => {
    if (!agreement) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tenancy Agreement", 14, 20);

    doc.setFontSize(11);
    doc.text(`Landlord: ${landlordName ?? "Landlord"}`, 14, 32);
    doc.text(`Tenant: ${tenantName ?? "Tenant"}`, 14, 40);
    doc.text(`Property: ${propertyAddress ?? "Address"}`, 14, 48);

    doc.setFontSize(10);
    const termsLines = doc.splitTextToSize(agreement.terms, 180);
    doc.text(termsLines, 14, 60);

    if (agreement.tenant_signed) {
      doc.text(`Tenant signed on ${signedDate}`, 14, 260);
    }
    if (agreement.landlord_signed) {
      doc.text(`Landlord signed on ${signedDate}`, 14, 268);
    }

    doc.save("dwelio-tenancy-agreement.pdf");
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] bg-surface-container-lowest p-10 shadow-[var(--shadow-elevated-panel)]">
        <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container mb-8">
          Tenancy Agreement
        </h1>
        {error && (
          <p className="rounded-[1rem] bg-error-container px-4 py-3 text-sm font-medium text-error mb-6">
            {error}
          </p>
        )}
        {agreement ? (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Landlord
              </span>
              <span className="font-headline text-lg font-bold text-primary-container">
                {landlordName}
              </span>
            </div>
            <div className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Tenant
              </span>
              <span className="font-headline text-lg font-bold text-primary-container">
                {tenantName}
              </span>
            </div>
            <div className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Property Address
              </span>
              <span className="font-headline text-lg font-bold text-primary-container">
                {propertyAddress}
              </span>
            </div>
            <div className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Terms
              </span>
              <div className="rounded-[1.5rem] bg-surface-container-low p-4 text-on-surface-variant whitespace-pre-line">
                {agreement.terms}
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="h-5 w-5 rounded border border-outline-variant/40 bg-surface-container-lowest text-primary-container focus:ring-2 focus:ring-primary-container/20"
              />
              I agree to the terms above
            </label>
            <button
              type="button"
              onClick={handleSign}
              disabled={pending || !checked}
              className="h-12 rounded-full bg-primary-container px-6 font-headline text-sm font-bold text-on-primary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus:ring-4 focus:ring-primary-container/20"
            >
              {pending ? "Signing..." : "Sign agreement"}
            </button>
          </div>
        ) : (
          <p className="text-on-surface-variant">Loading agreement...</p>
        )}
      </div>
    </div>
  );
}
