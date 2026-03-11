'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    const newAccount = { fullName, email, phoneNumber, password };
    const result = await register(newAccount);
    console.log('result', result);
    if (result.success) {
      console.log('Registration successful');
      alert('Registration successful! A verification email has been sent to your email address.');
      router.push(`/verify-email?email=${encodeURIComponent(email)}&sent=true`);
    } else {
      alert(`Registration failed: ${result.error}`);
      console.error('Registration error:', result.error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8rem', paddingTop: '5rem' }}>
      <div
        className="fillup-box"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ margin: '0 0 1.25rem', fontSize: '1.75rem' }}>Register</h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Full name</span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                padding: '0.55rem 0.7rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '.95rem',
              }}
            />
          </label>

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
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Phone Number</span>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
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
            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
          </label>

          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Confirm Password</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
            Register
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '.85rem' }}>
          Already have an account?{' '}
          <a href="/login" className="text-primary" style={{ fontWeight: 600, textDecoration: 'none' }}>
            Login Here
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
