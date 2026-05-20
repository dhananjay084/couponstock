// contactApi.js
import { buildPublicApiUrl } from "../../lib/publicApiBase";

const CONTACTS_URL = buildPublicApiUrl("/api/contacts");

export async function createContactAPI(payload) {
  const res = await fetch(CONTACTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    // prefer server-provided error message if exists
    const message = data.error || (data.errors ? JSON.stringify(data.errors) : "Failed to submit");
    throw new Error(message);
  }

  return data.data || data;
}

export async function fetchContactsAPI() {
  const res = await fetch(CONTACTS_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data.error || "Failed to fetch contacts";
    throw new Error(message);
  }

  return data.data || data;
}

export async function updateContactStatusAPI(id, status) {
  const res = await fetch(`${CONTACTS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data.error || "Failed to update contact status";
    throw new Error(message);
  }

  return data.data || data;
}
