'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useCookie } from '@/contexts/CookieContext';
import { useModal } from '@/contexts/ModalContext';
import { isAdmin } from '@/lib/role';

export default function SettingsPage() {
  const { cookiePreference, acceptCookies, rejectCookies } = useCookie();
  const { user } = useAuth();
  const hasAcceptedCookies = cookiePreference === 'accept';
  const hasRejectedCookies = cookiePreference === 'reject';
  const { openConfirmation } = useModal();

  const handleAcceptCookies = () => {
    openConfirmation(
      {
        title: 'Accept Cookies',
        message: 'Are you sure you want to accept cookies?',
      },
      async () => {
        await acceptCookies();
      }
    );
  };

  const handleRejectCookies = () => {
    openConfirmation(
      {
        title: 'Reject Cookies',
        message: 'Are you sure you want to reject cookies?',
      },
      async () => {
        if (user && isAdmin(user)) {
          alert('Staff members are required to accept cookies to use the application.');
          return;
        }
        await rejectCookies();
      }
    );
  };

  const handleClearBrowsingData = () => {
    // TODO: Implementation for removing browsing data
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-gray-600">Manage your preferences and privacy</p>
        </div>

        {/* Cookie Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Cookie Preferences</h2>
            <p className="text-gray-600">Control how we use cookies to enhance your browsing experience.</p>
          </div>

          {/* Current Status */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Current preference:</span>{' '}
              <span
                className={`font-semibold ${
                  hasAcceptedCookies ? 'text-green-600' : hasRejectedCookies ? 'text-orange-600' : 'text-gray-600'
                }`}
              >
                {cookiePreference === 'accept' && 'Cookies Accepted'}
                {cookiePreference === 'reject' && 'Cookies Rejected'}
                {cookiePreference === null && 'No preference set'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAcceptCookies}
              disabled={hasAcceptedCookies}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                hasAcceptedCookies
                  ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-300'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              {hasAcceptedCookies ? '✓ Cookies Accepted' : 'Accept Cookies'}
            </button>

            <button
              onClick={handleRejectCookies}
              disabled={hasRejectedCookies}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                hasRejectedCookies
                  ? 'bg-orange-100 text-orange-700 cursor-not-allowed border border-orange-300'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
            >
              {hasRejectedCookies ? '✓ Cookies Rejected' : 'Reject Cookies'}
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Browsing Data</h2>
            <p className="text-gray-600">Clear your browsing activity and cookies from this app.</p>
          </div>

          <button
            onClick={handleClearBrowsingData}
            className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-all active:scale-95"
          >
            Clear Browsing Data
          </button>
        </div>
      </div>
    </div>
  );
}
