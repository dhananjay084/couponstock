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

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Contacts</h1>

      {fetchStatus === "loading" && (
        <div className="py-8 text-center">Loading contacts...</div>
      )}
      {fetchStatus === "failed" && (
        <div className="text-red-600 mb-4">Error: {fetchError}</div>
      )}

      {list.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Message</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Submitted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map((contact) => (
                <tr key={contact._id}>
                  <td className="px-4 py-2">{contact.firstName} {contact.lastName}</td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.phone || "-"}</td>
                  <td className="px-4 py-2">{contact.subject || "-"}</td>
                  <td className="px-4 py-2">{contact.message || "-"}</td>
                  <td className="px-4 py-2">
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
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
                  <td className="px-4 py-2">
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
        <div className="py-8 text-center text-gray-500">No contacts available.</div>
      ) : null}
    </div>
  );
}
