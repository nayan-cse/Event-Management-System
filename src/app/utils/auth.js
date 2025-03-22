// utils/auth.js
export const isTokenExpired = (token) => {
    if (!token) return true; // Token is missing
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return true; // Invalid token
        return decoded.exp * 1000 < Date.now(); // Check if token is expired
    } catch (error) {
        return true; // Token is invalid
    }
};

// utils/auth.js
export const refreshAccessToken = async() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token found");
    }

    try {
        const response = await fetch("/api/v1/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("accessToken", data.accessToken); // Update access token
            return data.accessToken;
        } else {
            throw new Error(data.message || "Failed to refresh token");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
