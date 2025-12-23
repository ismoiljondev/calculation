const serverUrl = import.meta.env.VITE_API_BASE_URL;
export const downloadKatm = (katm_file) => {
  const url = `${serverUrl}/file/download/${katm_file}`;

  window.open(url, "_blank", "noopener,noreferrer");
};
