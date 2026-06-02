"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { buildPublicApiUrl } from "../../lib/publicApiBase";

const SUBSCRIBERS_URL = buildPublicApiUrl("/api/admin/subscribers");

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSubscribers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(SUBSCRIBERS_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch subscribers.");
        }
        if (!active) return;
        setSubscribers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        const message = err?.message || "Failed to fetch subscribers.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSubscribers();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a243b]">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-gray-600">All email addresses currently subscribed to the newsletter.</p>
        </div>
        <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Total Subscribers</div>
          <div className="mt-1 text-2xl font-bold text-[#2F2158]">{subscribers.length}</div>
        </div>
      </div>

      {loading ? <div className="py-10 text-center">Loading subscribers...</div> : null}
      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      {!loading && !error ? (
        subscribers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Subscribed At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{subscriber?.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(subscriber?.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(subscriber?.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">No subscribers found.</div>
        )
      ) : null}
    </div>
  );
}
