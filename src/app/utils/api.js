// utils/api.js
import { isTokenExpired, refreshAccessToken } from "./auth";

export const fetchWithAuth = async(url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");

    // Check if access token is expired
    if (isTokenExpired(accessToken)) {
        try {
            accessToken = await refreshAccessToken(); // Refresh the access token
        } catch (error) {
            // Redirect to login if refresh token is invalid
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return;
        }
    }

    // Add authorization header
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request
    const response = await fetch(url, {...options, headers });

    // Handle unauthorized responses
    if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    }

    return response;
};
