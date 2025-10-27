import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../service/LocalStorageService";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { useAuth } from './AuthContext';
import { API_BASE_URL } from "../configuration/configuration"; // <-- import API_BASE_URL

function Authenticate() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { login: loginContext } = useAuth();

    useEffect(() => {
        const handleAuthentication = async () => {
            const authCodeRegex = /code=([^&]+)/;
            const match = window.location.href.match(authCodeRegex);

            if (!match) {
                setError("Authorization code not found.");
                return;
            }

            const authCode = match[1];
            console.log("Authorization code:", authCode);

            try {
                const response = await fetchWith401Check(
                    `${API_BASE_URL}/auth/outbound/authentication?code=${authCode}`,
                    {
                        method: "POST",
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                console.log("Received token:", data.token);
                console.log(data);

                loginContext({ role: data.role });
                setToken(data.token);

                if (data.role.includes("ROLE_ADMIN")) {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } catch (err) {
                console.error("Authentication failed:", err);
                setError("Authentication failed. Please try again.");
            }
        };

        handleAuthentication();
    }, [navigate]);

    return (
        <div>
            <h1>Authenticating...</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Authenticate;
