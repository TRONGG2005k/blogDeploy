import { setToken, getToken } from "../service/LocalStorageService";
import { API_BASE_URL } from "../configuration/configuration"; // <-- import API_BASE_URL

// Hàm này sẽ được gọi khi token hết hạn (status 401)
export const fetchWith401Check = async (url, options = {}) => {
  const token = getToken("accessToken");

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
            response = await fetch(url, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            });
        }
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
};


const refreshToken = async (navigate) => {
  try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        const data = await res.json();
        console.log("Refresh token response:", data);
        if (data?.token) {
            setToken(data.token);
            console.log("✅ Token đã được refresh!", data.token);
            return data.token;
        } else {
            // Nếu không có token mới, điều hướng đến trang đăng nhập
            console.warn("⚠️ Refresh token thất bại");
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
};
