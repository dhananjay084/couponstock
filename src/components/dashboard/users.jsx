"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { buildPublicApiUrl } from "../../lib/publicApiBase";

const USERS_URL = buildPublicApiUrl("/api/admin/users");

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(USERS_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch users.");
        }
        if (!active) return;
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        const message = err?.message || "Failed to fetch users.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const totalUsers = users.length;
  const adminCount = users.filter((user) => String(user?.role || "").toLowerCase() === "admin").length;
  const socialCount = users.filter((user) => String(user?.authProvider || "").toLowerCase() === "social").length;
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      user?.name,
      user?.email,
      user?.phone,
      user?.role,
      user?.authProvider,
      user?.socialProvider,
      user?.referralCode,
      user?.referredBy?.email,
      user?.referredBy?.name,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a243b]">Signed Up Users</h1>
          <p className="mt-1 text-sm text-gray-600">All registered accounts from local and social signup.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Total Users</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{totalUsers}</div>
          </div>
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Admins</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{adminCount}</div>
          </div>
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Social Signups</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{socialCount}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name, email, phone, role or referral"
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        />
      </div>

      {loading ? <div className="py-10 text-center">Loading users...</div> : null}
      {error ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      {!loading && !error ? (
        filteredUsers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Auth</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Referral Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Referred By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{user?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{user?.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{user?.phone || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="rounded-full bg-[#F1E8FF] px-2.5 py-1 font-semibold capitalize text-[#5B3CC4]">
                        {user?.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-800">
                      {user?.authProvider || "-"}
                      {user?.socialProvider ? ` (${user.socialProvider})` : ""}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-800">{user?.referralCode || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {user?.referredBy?.email || user?.referredBy?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(user?.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {users.length > 0 ? "No users match your search." : "No users found."}
          </div>
        )
      ) : null}
    </div>
  );
}
