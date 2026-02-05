"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError("Login failed");
                return;
            }

            router.push(data.redirectTo);
        } catch (e) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>Login</h1>

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                    padding: "12px 20px",
                    fontSize: 16,
                    cursor: "pointer",
                }}
            >
                {loading ? "Logging in…" : "Login"}
            </button>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
        </main>
    );
}
