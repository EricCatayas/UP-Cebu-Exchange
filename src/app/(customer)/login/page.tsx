'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { success, error, callbackUrl } = await login(email, password, remember);
      if (!success) {
        alert(error || 'Login failed');
        return;
      }

      router.push(callbackUrl || '/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.75rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          background: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ margin: '0 0 1.25rem', fontSize: '1.75rem' }}>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                padding: '0.55rem 0.7rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '.95rem',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '0.55rem 0.7rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '.95rem',
              }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '.85rem' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Remember Me?</span>
          </label>

          <button
            type="submit"
            className="bg-primary"
            style={{
              marginTop: '0.4rem',
              padding: '0.65rem 0.9rem',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.4rem', fontSize: '.8rem' }}>
          <a href="/forgot-password" className="text-primary" style={{ textDecoration: 'none' }}>
            Forgot Password
          </a>
          <div>
            Need an Account?{' '}
            <a href="/register" className="text-primary" style={{ fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
