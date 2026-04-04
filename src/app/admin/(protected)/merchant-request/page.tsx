"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SignupRequest = {
  id: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  websiteUrl: string;
  email: string;
  taxId: string;
  expectedYardage: string;
  preferredFabricType: string;
  brandVision: string;
  businessLicense: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type ApiListResponse = {
  requests?: SignupRequest[];
  error?: string;
};

type ApiApproveResponse = {
  ok?: boolean;
  firebaseUid?: string;
  error?: string;
};

export default function MerchantRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track per-row approve state
  const [approvingById, setApprovingById] = useState<Record<string, boolean>>({});
  const [successById, setSuccessById] = useState<Record<string, string>>({});

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "pending").length,
    [requests]
  );

  async function loadRequests(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const res = await fetch("/api/admin/signup-requests?status=pending&limit=100", {
        method: "GET",
        cache: "no-store",
      });

      const data: ApiListResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error(data.error || "Failed to load requests");
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function approveRequest(requestId: string) {
    setApprovingById((prev) => ({ ...prev, [requestId]: true }));
    setError(null);

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data: ApiApproveResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error(data.error || "Failed to approve request");
      }

      // Optimistic remove from list
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setSuccessById((prev) => ({
        ...prev,
        [requestId]: `Approved successfully${data.firebaseUid ? ` (UID: ${data.firebaseUid})` : ""}`,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setApprovingById((prev) => ({ ...prev, [requestId]: false }));
    }
  }

  useEffect(() => {
    void loadRequests(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-[#bdb29e] p-6">
        <p className="text-sm">Loading merchant requests...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#bdb29e] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#c5a059]">Merchant Requests</h1>
            <p className="mt-1 text-sm text-[#9d9589]">
              Pending approvals: <span className="text-[#d7c08b]">{pendingCount}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests(true)}
            disabled={refreshing}
            className="rounded-md border border-[#3a3a3a] bg-[#171717] px-4 py-2 text-sm hover:border-[#c5a059] disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {requests.length === 0 ? (
          <div className="rounded-xl border border-[#2f2f2f] bg-[#121212] p-6 text-sm text-[#9d9589]">
            No pending merchant requests found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#2f2f2f] bg-[#121212]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#171717] text-left text-[#d7c08b]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const isApproving = !!approvingById[r.id];
                  return (
                    <tr key={r.id} className="border-t border-[#262626] align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#e2dacd]">{r.fullName || "-"}</div>
                        <div className="text-xs text-[#928b80]">{r.jobTitle || "-"}</div>
                      </td>
                      <td className="px-4 py-3">{r.companyName || "-"}</td>
                      <td className="px-4 py-3">{r.email || "-"}</td>
                      <td className="px-4 py-3">
                        {r.websiteUrl ? (
                          <a
                            href={r.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#c5a059] underline underline-offset-2"
                          >
                            Visit
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => void approveRequest(r.id)}
                          disabled={isApproving}
                          className="rounded-md bg-[#c5a059] px-3 py-1.5 text-xs font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isApproving ? "Approving..." : "Approve"}
                        </button>
                        {successById[r.id] ? (
                          <p className="mt-2 text-xs text-green-300">{successById[r.id]}</p>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}