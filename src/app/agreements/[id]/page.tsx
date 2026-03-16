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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-900">
          Tenancy Agreement
        </h1>

        {fullySigned && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Fully executed. Both parties have signed.
          </div>
        )}

        <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
          {agreement.terms}
        </pre>

        {!fullySigned && (
          <div className="grid gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              I have read and agree to this tenancy agreement.
            </label>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={!checked || pending}
              onClick={handleSign}
              className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Signing..." : "Sign agreement"}
            </button>
          </div>
        )}

        {fullySigned && (
          <button
            type="button"
            onClick={handleDownload}
            className="h-12 w-fit rounded-full border border-emerald-200 px-6 text-sm font-semibold text-emerald-800"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}
