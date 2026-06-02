export const uploadImage = async (file) => {
  if (!file) throw new Error("No file selected");
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("image", file);
    return formData;
  };

  const sendUpload = async () =>
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads`, {
      method: "POST",
      body: buildFormData(),
      credentials: "include",
    });

  let res = await sendUpload();

  if (res.status === 401) {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    res = await sendUpload();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Upload failed");
  }
  return data.url;
};
