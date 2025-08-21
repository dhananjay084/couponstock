"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "@/redux/contact/contactSlice";
import { toast } from "react-toastify";


export default function ContactsTablePage() {
  const dispatch = useDispatch();
  const { list, fetchStatus, fetchError } = useSelector((state) => state.contact);

  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(fetchContacts());
    }
  }, [dispatch, fetchStatus]);

  useEffect(() => {
    if (fetchStatus === "failed" && fetchError) {
      toast.error(fetchError || "Failed to fetch contacts.");
    }

    if (fetchStatus === "success") {
      toast.success("Contacts loaded successfully!");
    }
  }, [fetchStatus, fetchError]);


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
                    {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : fetchStatus === "success" ? (
        <div className="py-8 text-center text-gray-500">No contacts available.</div>
      ) : null}
    </div>
  );
}
