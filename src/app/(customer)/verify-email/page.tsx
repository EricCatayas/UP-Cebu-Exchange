'use client';

import React, { use, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';

const COOLDOWN_SECONDS = 30;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function VerifyEmail(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const email = searchParams.email as string | undefined;

  const [isSent, setIsSent] = useState(searchParams.sent === 'true');
  const [cooldown, setCooldown] = useState<number>(isSent ? COOLDOWN_SECONDS : 0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendEmailVerification = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Missing email. Please go back and try again.');
      return;
    }
    if (cooldown > 0 || loading) return;

    try {
      setLoading(true);
      await authApi.resendEmailVerification(email);
      setIsSent(true);
      setMessage('Verification email sent. Please check your inbox.');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || cooldown > 0 || !email;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-6">
          <h1 className="text-xl font-semibold text-gray-900">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            Thanks for signing up for <span className="font-medium">UP Cebu Exchange</span>.{' '}
            {isSent ? 'We sent a verification link to:' : 'Click the button below to receive a verification link at:'}
          </p>
          <p className="mt-2 text-sm font-medium text-gray-900 break-all">{email || '—'}</p>
          <p className="mt-2 text-sm text-gray-600">Please click the link in that email to activate your account.</p>
        </div>

        <div className="px-6 pt-4 pb-6">
          <button
            type="button"
            onClick={handleSendEmailVerification}
            disabled={isDisabled}
            className={`inline-flex items-center justify-center w-full rounded-lg px-4 py-2 text-sm font-medium transition ${
              isDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Resending...'
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : isSent
              ? 'Resend Verification Email'
              : 'Send Verification Email'}
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

          <div className="mt-4 text-xs text-gray-500">
            Didn’t receive the email? Check your spam folder or try resending.
          </div>
        </div>
      </div>
    </div>
  );
}
