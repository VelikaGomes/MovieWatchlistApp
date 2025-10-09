// frontend/src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check role matches backend
        if (form.role !== data.user.role) {
          setMessage("Role mismatch. Please select the correct role.");
          setError(true);
          return;
        }

        setMessage("Login successful!");
        setError(false);

        // Save user info to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("name", data.user.username);
        localStorage.setItem("email", data.user.email);

        setTimeout(() => navigate("/"), 1000);
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
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212', // dark background
      fontFamily: 'Poppins, sans-serif',
      color: '#fff',
      padding: '20px',
    },
    card: {
      backgroundColor: '#1e1e1e',
      padding: '40px 50px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
    },
    title: { fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '10px' },
    subtitle: { color: '#ccc', fontSize: '15px', marginBottom: '25px' },
    formGroup: { marginBottom: '20px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#ccc' },
    input: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #333',
      outline: 'none',
      fontSize: '15px',
      backgroundColor: '#2b2b2b',
      color: '#fff',
      transition: 'border 0.3s ease, box-shadow 0.3s ease',
    },
    button: {
      backgroundColor: '#bb86fc',
      color: '#121212',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.3s',
    },
    buttonHover: { backgroundColor: '#9b4dff' },
    message: { color: error ? '#cf6679' : '#2ecc71', fontSize: '14px', marginBottom: '10px', textAlign: 'center' },
    footer: { marginTop: '18px', color: '#aaa', fontSize: '14px' },
    link: { color: '#bb86fc', textDecoration: 'none', fontWeight: '500', marginLeft: '4px' },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎬 Welcome Back</h2>
        <p style={styles.subtitle}>Login to manage your Movie Watchlist</p>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Enter your password"
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

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?
          <Link to="/signup" style={styles.link}> Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
