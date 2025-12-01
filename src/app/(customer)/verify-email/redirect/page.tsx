'use client';
import { use, useEffect, useState } from 'react';
import { ERROR_MESSAGE } from '@/lib/constants';
import { authApi } from '@/lib/api/auth';

const COOLDOWN_SECONDS = 30;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function VerifyEmailLink(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const query = searchParams.query;

  const token = searchParams.token as string | undefined;
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Missing token. Please check your verification link.');
        setIsVerifying(false);
        return;
      }
      try {
        const { success, error } = await authApi.verifyEmail(token);

        if (!success) {
          if (error === ERROR_MESSAGE.EMAIL_VERIFICATION_TOKEN_EXPIRED) {
            setError('Your verification link has expired. Please request a new verification email.');
            setIsTokenExpired(true);
            setIsVerifying(false);
            return;
          }
          if (error === ERROR_MESSAGE.EMAIL_VERIFICATION_TOKEN_INVALID) {
            setError('The verification link is invalid. Please check your verification link.');
            setIsVerifying(false);
            return;
          }
          throw new Error(error || 'Email verification failed');
        }
        setMessage('Email verified successfully! You can now log in.');
      } catch (err: any) {
        setError(err?.message || 'Email verification failed');
      } finally {
        setIsVerifying(false);
      }
    };
    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
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
      setMessage('Verification email sent. Please check your inbox.');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-6 pb-8">
          <h1 className="text-xl font-semibold text-gray-900">Verifying your email</h1>
          {isVerifying ? (
            <p className="mt-4 text-sm text-gray-600">Please wait while we verify your email...</p>
          ) : error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : (
            <p className="mt-4 text-sm text-green-600">{message}</p>
          )}
        </div>
        {isTokenExpired && (
          <div className="px-6 pt-4 pb-6">
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || cooldown > 0}
              className={`inline-flex items-center justify-center w-full rounded-lg px-4 py-2 text-sm font-medium transition ${
                loading || cooldown > 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Resending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
            </button>
            <div className="mt-4 text-xs text-gray-500">
              Didn’t receive the email? Check your spam folder or try resending.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
