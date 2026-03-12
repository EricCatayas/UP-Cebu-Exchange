'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { ERROR_MESSAGE } from '@/lib/constants';

function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl] = useState(searchParams.get('redirect') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { success, error, callbackUrl } = await login(email, password, remember);
      if (!success) {
        alert(error || 'Login failed');

        if (error === ERROR_MESSAGE.EMAIL_VERIFICATION_REQUIRED) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
        return;
      }

      router.push(callbackUrl || redirectUrl || '/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', padding: '2rem', paddingTop: '5rem', paddingBottom: '10rem' }}
    >
      <div
        className="fillup-box"
        style={{
          width: '100%',
          maxWidth: '380px',
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.55rem 2.2rem 0.55rem 0.7rem',
                  border: '1px solid #bbb',
                  borderRadius: '4px',
                  fontSize: '.95rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.55rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#555',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
            className="bg-primary hover:bg-primary-dark"
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
