export const uploadImage = async (file) => {
  if (!file) throw new Error("No file selected");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Upload failed");
  }
  return data.url;
};
