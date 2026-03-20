"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CouponSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/coupon-submissions`, {
        params: statusFilter ? { status: statusFilter } : undefined,
        withCredentials: true,
      });
      setSubmissions(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const approve = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/coupon-submissions/${id}/approve`, {}, { withCredentials: true });
      toast.success("Approved and published");
      fetchSubmissions();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Approve failed");
    }
  };

  const reject = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/coupon-submissions/${id}/reject`, {}, { withCredentials: true });
      toast.success("Rejected");
      fetchSubmissions();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Reject failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Coupon Submissions</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Store</th>
                <th className="p-2 border">Country</th>
                <th className="p-2 border">Discount</th>
                <th className="p-2 border">Expiry</th>
                <th className="p-2 border">Submitter</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id} className="text-center">
                  <td className="p-2 border">{s.dealTitle}</td>
                  <td className="p-2 border">{s.store}</td>
                  <td className="p-2 border">{Array.isArray(s.country) ? s.country.join(", ") : s.country}</td>
                  <td className="p-2 border">{s.discount}</td>
                  <td className="p-2 border">
                    {s.expiredDate ? new Date(s.expiredDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-2 border">
                    {s.submitterName}
                    <div className="text-xs text-gray-500">{s.submitterEmail}</div>
                  </td>
                  <td className="p-2 border capitalize">{s.status}</td>
                  <td className="p-2 border">
                    {s.status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approve(s._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(s._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CouponSubmissions;
