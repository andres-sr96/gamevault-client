const TOKEN_KEY = "gamevault_token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUsernameFromToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = getToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    return (
      decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ] || null
    );
  } catch (err) {
    console.error("Error decoding auth token username", err);
    return null;
  }
};
