// frontend/src/pages/Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setError(false);
        setForm({ username: "", email: "", password: "", role: "user" });

        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage("❌ " + data.message);
        setError(true);
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
      setError(true);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#121212", // dark background
      color: "#fff",
      padding: "20px",
    },
    card: {
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderRadius: "10px",
      padding: "30px 40px",
      maxWidth: "400px",
      width: "100%",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    },
    title: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "24px",
      fontWeight: "600",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "500",
      color: "#ccc",
    },
    input: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #333",
      backgroundColor: "#2b2b2b",
      color: "#fff",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "#bb86fc",
      color: "#121212",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    message: {
      color: error ? "#cf6679" : "#2ecc71",
      fontSize: "14px",
      marginBottom: "10px",
      textAlign: "center",
    },
    footerText: {
      marginTop: "15px",
      textAlign: "center",
      fontSize: "14px",
      color: "#aaa",
    },
    link: {
      color: "#bb86fc",
      textDecoration: "none",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Signup</h2>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Signup
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
