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
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const subscribedCount = subscribers.filter(
    (subscriber) => (subscriber?.status || "subscribed") === "subscribed"
  ).length;
  const unsubscribedCount = subscribers.filter(
    (subscriber) => (subscriber?.status || "subscribed") === "unsubscribed"
  ).length;

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

  const filteredSubscribers = subscribers.filter((subscriber) =>
    [subscriber?.email, subscriber?.status || "subscribed"]
      .filter(Boolean)
      .some((value) =>
        String(value)
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      )
  );

  const handleDelete = async (subscriber) => {
    const email = subscriber?.email || "this subscriber";
    const confirmed = window.confirm(`Delete ${email} from subscribers?`);
    if (!confirmed) return;

    try {
      setDeletingId(subscriber._id);
      const res = await fetch(`${SUBSCRIBERS_URL}/${subscriber._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete subscriber.");
      }

      setSubscribers((prev) => prev.filter((entry) => entry._id !== subscriber._id));
      toast.success("Subscriber deleted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete subscriber.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a243b]">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-gray-600">Track every newsletter email and whether it is currently subscribed or unsubscribed.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Total Records</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{subscribers.length}</div>
          </div>
          <div className="rounded-xl border border-[#D7F0E4] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3D7A5C]">Subscribed</div>
            <div className="mt-1 text-2xl font-bold text-[#17573A]">{subscribedCount}</div>
          </div>
          <div className="rounded-xl border border-[#F6E0D1] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A85C2A]">Unsubscribed</div>
            <div className="mt-1 text-2xl font-bold text-[#8B4513]">{unsubscribedCount}</div>
          </div>
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Filtered Results</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{filteredSubscribers.length}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subscribers by email"
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        />
      </div>

      {loading ? <div className="py-10 text-center">Loading subscribers...</div> : null}
      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      {!loading && !error ? (
        filteredSubscribers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Subscribed At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Updated At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{subscriber?.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          (subscriber?.status || "subscribed") === "subscribed"
                            ? "bg-[#E7F7EE] text-[#176B43]"
                            : "bg-[#FFF1E8] text-[#A4571C]"
                        }`}
                      >
                        {(subscriber?.status || "subscribed") === "subscribed" ? "Subscribed" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(subscriber?.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(subscriber?.updatedAt)}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleDelete(subscriber)}
                        disabled={deletingId === subscriber._id}
                        className="rounded-lg bg-[#FDECEC] px-3 py-2 font-semibold text-[#C53030] transition hover:bg-[#FBD5D5] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === subscriber._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {subscribers.length > 0 ? "No subscribers match your search." : "No subscribers found."}
          </div>
        )
      ) : null}
    </div>
  );
}
