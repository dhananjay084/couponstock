"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/contact/contactSlice";
import { toast } from "react-toastify";
import { updateContactStatusAPI } from "../../redux/contact/ContactApi";

const CONTACT_STATUS_OPTIONS = ["New", "Contacted", "Invalid Details"];


export default function ContactsTablePage() {
  const dispatch = useDispatch();
  const { list, fetchStatus, fetchError } = useSelector((state) => state.contact);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(fetchContacts());
    }
  }, [dispatch, fetchStatus]);

  useEffect(() => {
    if (fetchStatus === "failed" && fetchError) {
      toast.error(fetchError || "Failed to fetch contacts.");
    }

    if (fetchStatus === "succeeded") {
      toast.success("Contacts loaded successfully!");
    }
  }, [fetchStatus, fetchError]);

  const handleStatusChange = async (contactId, status) => {
    try {
      setUpdatingId(contactId);
      await updateContactStatusAPI(contactId, status);
      toast.success("Contact status updated.");
      dispatch(fetchContacts());
    } catch (error) {
      toast.error(error.message || "Failed to update contact status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredContacts = list.filter((contact) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      `${contact?.firstName || ""} ${contact?.lastName || ""}`,
      contact?.email,
      contact?.phone,
      contact?.subject,
      contact?.message,
      contact?.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a243b]">All Contacts</h1>
          <p className="mt-1 text-sm text-gray-600">Review incoming messages and update their status without breaking the table layout.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Total Contacts</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{list.length}</div>
          </div>
          <div className="rounded-xl border border-[#E6DDFB] bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B6AA8]">Filtered Results</div>
            <div className="mt-1 text-2xl font-bold text-[#2F2158]">{filteredContacts.length}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, email, phone, subject or message"
          className="w-full rounded-xl border border-[#D9E1EE] bg-white px-4 py-3 text-sm text-[#1a243b] shadow-sm outline-none transition focus:border-[#8A63D2] focus:ring-2 focus:ring-[#E9DEFF]"
        />
      </div>

      {fetchStatus === "loading" && (
        <div className="py-8 text-center">Loading contacts...</div>
      )}
      {fetchStatus === "failed" && (
        <div className="text-red-600 mb-4">Error: {fetchError}</div>
      )}

      {filteredContacts.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-[#F8F9FC]">
              <tr>
                <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Name</th>
                <th className="w-[16%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Email</th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Phone</th>
                <th className="w-[16%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Subject</th>
                <th className="w-[24%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Message</th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Status</th>
                <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Submitted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top break-words">{contact.firstName} {contact.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top break-all">{contact.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top break-words">{contact.phone || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top break-words">{contact.subject || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top">
                    <div className="max-w-full whitespace-pre-wrap break-words leading-6">
                      {contact.message || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <select
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                      value={contact.status || "New"}
                      onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                      disabled={updatingId === contact._id}
                    >
                      {CONTACT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top">
                    {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : fetchStatus === "succeeded" ? (
        <div className="py-8 text-center text-gray-500">
          {list.length > 0 ? "No contacts match your search." : "No contacts available."}
        </div>
      ) : null}
    </div>
  );
}
