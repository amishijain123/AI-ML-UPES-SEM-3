import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add simple validation
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      }}
    >
      <div
        className="login-body"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          overflow: "hidden",
          position: "relative",
        }}
      >

        {/* Animated Background */}
        <div className="background-animation" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="floating-icon icon-1" style={{ position: "absolute", top: "80px", left: "40px", fontSize: "128px", color: "#34d399", opacity: 0.2 }}>
            📈
          </div>
          <div className="floating-icon icon-2" style={{ position: "absolute", bottom: "80px", right: "64px", fontSize: "160px", color: "#60a5fa", opacity: 0.2 }}>
            💹
          </div>
          <div className="floating-icon icon-3" style={{ position: "absolute", top: "50%", right: "25%", fontSize: "96px", color: "#c084fc", opacity: 0.2 }}>
            📊
          </div>
          <div className="floating-icon icon-4" style={{ position: "absolute", bottom: "33%", left: "25%", fontSize: "112px", color: "#f472b6", opacity: 0.2 }}>
            💱
          </div>
        </div>

        {/* Login Card */}
        <div
          className="login-card"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
            maxWidth: "400px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h1 style={{ color: "white", fontSize: "32px", marginBottom: "20px", textAlign: "center", fontWeight: 700 }}>
            Stock Market Login
          </h1>

          <p style={{ color: "#ddd", textAlign: "center", marginBottom: "30px" }}>
            Login to view live stock dashboard
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #aaa",
                background: "rgba(255,255,255,0.2)",
                color: "white",
              }}
            />

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #aaa",
                background: "rgba(255,255,255,0.2)",
                color: "white",
              }}
            />

            <button
              type="button"
              onClick={handleLogin}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: "#34d399",
                color: "#000",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              Login
            </button>
          </form>

          <p style={{ marginTop: "20px", color: "#ccc", textAlign: "center" }}>
            Forgot password?
          </p>
        </div>
      </div>
    </div>
  );
}
