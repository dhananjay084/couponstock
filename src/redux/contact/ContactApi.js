// contactApi.js
const BASE_URL =  "https://mycouponstock-production.up.railway.app"; // e.g., "https://mycouponstock-production.up.railway.app"

export async function createContactAPI(payload) {
    const res = await fetch(`${BASE_URL}/api/contacts`, {
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
    const res = await fetch(`${BASE_URL}/api/contacts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data.error || "Failed to fetch contacts";
      throw new Error(message);
    }
    return data.data || data;
  }
