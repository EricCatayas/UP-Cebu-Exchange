'use client';
import { useCookie } from '@/contexts/CookieContext';
import Link from 'next/link';

export default function CookieConsent() {
  const { hasChosenPreference, acceptCookies, rejectCookies } = useCookie();

  if (hasChosenPreference) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
      <div className="bg-gradient-to-tr from-[#f09a71] to-[#fff17c] rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-6">
          {/* Cookie Notice */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-white">Cookie Notice</h3>
              <p className="text-sm leading-relaxed">
                We use cookies to improve your browsing experience, analyze site traffic, and personalize content. By
                clicking "Accept", you consent to our use of cookies.
              </p>
              <p className="text-sm mt-2">
                You can manage your preferences or withdraw consent at any time by clicking "Cookie Settings". For more
                information, please review our{' '}
                <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={acceptCookies}
                className="px-4 py-2 bg-primary text-white font-medium rounded-lg transition whitespace-nowrap"
              >
                Accept
              </button>
              <button
                onClick={rejectCookies}
                className="px-4 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-600 transition whitespace-nowrap"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
