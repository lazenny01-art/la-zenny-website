// ImgBB Image Upload — Free, no credit card needed
// Get your API key at: https://api.imgbb.com
// Replace the key below with YOUR ImgBB API key

const IMGBB_API_KEY = "16f6987bdf6bf0c6ad1d746209985ec9";

/**
 * Uploads a file to ImgBB and returns the image URL.
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<string>} - The direct image URL
 */
export const uploadToCloudinary = async (file, onProgress) => {
  // Convert file to base64
  const base64 = await fileToBase64(file);

  // Simulate upload progress start
  if (onProgress) onProgress(30);

  const formData = new FormData();
  formData.append("image", base64.split(",")[1]); // ImgBB needs base64 without data: prefix
  formData.append("name", file.name);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (onProgress) onProgress(80);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Upload failed (${response.status})`);
  }

  const data = await response.json();

  if (!data.success || !data.data?.url) {
    console.error("ImgBB response:", data);
    throw new Error(data.error?.message || "No image URL returned from ImgBB");
  }

  if (onProgress) onProgress(100);

  // Return the display URL (direct link to image)
  return data.data.display_url || data.data.url;
};

/**
 * Converts a File object to a base64 data URL string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
