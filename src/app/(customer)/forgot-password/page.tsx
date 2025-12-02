'use client';

import React, { useState } from 'react';
import { authApi } from '@/lib/api/auth';
import Link from 'next/link';

const COOLDOWN_SECONDS = 30;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cooldown > 0 || loading) return;

    try {
      setLoading(true);
      const { success, error } = await authApi.requestPasswordReset(email);

      if (success) {
        setIsSent(true);
        setMessage('Password reset email sent. Please check your inbox.');
        setCooldown(COOLDOWN_SECONDS);
      } else {
        setError(error || 'Failed to send password reset email. Please try again later.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || cooldown > 0 || !email;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-6">
          <h1 className="text-xl font-semibold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password for{' '}
            <span className="font-medium">UP Cebu Exchange</span>.
          </p>
        </div>

        <form onSubmit={handleSendPasswordReset} className="px-6 pt-4 pb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`inline-flex items-center justify-center w-full rounded-lg px-4 py-2 text-sm font-medium transition ${
              isDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Sending...'
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : isSent
              ? 'Resend Reset Link'
              : 'Send Reset Link'}
          </button>

          {message && (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {isSent && (
            <div className="mt-4 text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try resending.
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
