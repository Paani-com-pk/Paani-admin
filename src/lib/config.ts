const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

export const apiBaseUrl = configuredBaseUrl.replace(/\/+$/, "");
