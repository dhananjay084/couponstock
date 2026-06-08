"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { buildPublicApiUrl } from "../../lib/publicApiBase";

const AWIN_OFFERS_URL = buildPublicApiUrl("/api/admin/awin-offers");

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function AwinOffersAdmin() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [returnedCount, setReturnedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;

    const loadOffers = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          type: "all",
          membership: "all",
        });
        if (status) params.set("status", status);

        const res = await fetch(`${AWIN_OFFERS_URL}?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch Awin offers.");
        }
        if (!active) return;
        setOffers(Array.isArray(data?.offers) ? data.offers : []);
        setHasNextPage(Boolean(data?.pagination?.hasNextPage));
        setReturnedCount(Number(data?.pagination?.returned || 0));
        setTotalCount(
          Number.isFinite(Number(data?.pagination?.total))
            ? Number(data.pagination.total)
            : null
        );
        setTotalPages(
          Number.isFinite(Number(data?.pagination?.totalPages))
            ? Number(data.pagination.totalPages)
            : null
        );
      } catch (err) {
        if (!active) return;
        const message = err?.message || "Failed to fetch Awin offers.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOffers();
    return () => {
      active = false;
    };
  }, [page, pageSize, status]);

  const filteredOffers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return offers;

    return offers.filter((offer) =>
      [
        offer?.title,
        offer?.description,
        offer?.type,
        offer?.advertiser?.name,
        offer?.voucher?.code,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [offers, searchTerm]);

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a243b]">Awin Offers</h1>
          <p className="mt-1 text-sm text-gray-600">Live publisher offers fetched from your Awin account with server-side pagination.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Offers Loaded</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{offers.length}</div>
          </div>
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Total Offers</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{totalCount ?? "-"}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Awin offers by title, advertiser, type or code"
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expiringSoon">Expiring Soon</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        >
          <option value={20}>20 per page</option>
          <option value={100}>100 per page</option>
          <option value={200}>200 per page</option>
        </select>
      </div>

      {loading ? <div className="py-10 text-center">Loading Awin offers...</div> : null}
      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      {!loading && !error ? (
        filteredOffers.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#E6EAF2] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#4A3C6A]">
                Showing {filteredOffers.length} visible offers on page {page}
                {searchTerm.trim() ? ` (${returnedCount} fetched before local search filter)` : ""}
                {totalCount ? ` out of ${totalCount} total offers` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    page === 1
                      ? "cursor-not-allowed border border-[#E4D8FF] bg-white text-[#9A8CC3]"
                      : "border border-[#E4D8FF] bg-white text-[#4A3C6A] hover:bg-[#F2EBFF]"
                  }`}
                >
                  Prev
                </button>
                <span className="rounded-full bg-[#F5EEFF] px-3 py-1 text-xs font-semibold text-[#5B3CC4]">
                  Page {page}{totalPages ? ` of ${totalPages}` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!hasNextPage}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    !hasNextPage
                      ? "cursor-not-allowed border border-[#E4D8FF] bg-white text-[#9A8CC3]"
                      : "border border-[#E4D8FF] bg-white text-[#4A3C6A] hover:bg-[#F2EBFF]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F9FC]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Advertiser</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Voucher Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">End</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Tracking Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOffers.map((offer) => (
                    <tr key={offer?.promotionId || offer?.title}>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div className="font-semibold">{offer?.title || "-"}</div>
                        <div className="mt-1 max-w-[320px] text-xs text-gray-500">
                          {offer?.description || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{offer?.advertiser?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm capitalize text-gray-800">{offer?.type || "-"}</td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-800">{offer?.voucher?.code || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{formatDate(offer?.startDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{formatDate(offer?.endDate)}</td>
                      <td className="px-4 py-3 text-sm">
                        {offer?.urlTracking ? (
                          <a
                            href={offer.urlTracking}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[#5B3CC4] hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {offers.length > 0 ? "No Awin offers match your search." : "No Awin offers found."}
          </div>
        )
      ) : null}
    </div>
  );
}
