import React from 'react';
import { APP_CONTACT_EMAIL, APP_CONTACT_PHONE } from '@/lib/constants';
import FAQItem from '@/components/FAQ/FAQItem';

function PrivacyPolicy() {
  const today = new Date();
  const lastUpdatedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const policySections = [
    {
      question: '1. Information We Collect',
      answer: [
        'Personal Identification Information: Full name, Email address, Contact number, Address or location data',
        'Account Information: Username and password, Profile details you provide',
        'Usage, Technical & Cookies Data: IP address, System activity and logs, Cookies and similar technologies',
        'This information is collected when you register, use system features, submit forms, or otherwise interact with the system.',
      ],
    },
    {
      question: '2. How We Use Your Information',
      answer: [
        'Providing and maintaining system functionality',
        'Processing transactions and user requests',
        'Communicating with you (notifications, support, updates)',
        'Improving our system and services',
        'Complying with legal obligations',
      ],
    },
    {
      question: '3. Disclosure of Personal Data',
      answer: [
        'We do not sell your personal information.',
        'Your personal data may be shared only with: Authorized system administrators and employees, Government or regulatory authorities when required by law',
      ],
    },
    {
      question: '4. Modification, Withdrawal, and Access',
      answer: [
        'Modification: You may review and update your personal information through your account settings.',
        'Withdrawal of Consent: You have the right to withdraw consent for data processing by contacting us. Withdrawal of consent does not affect processing already completed.',
        'Access and Portability: You may request access to or transfer your personal data in a structured, machine-readable format.',
      ],
    },
    {
      question: '5. Retention and Deletion',
      answer: [
        'We retain personal data only as long as necessary to fulfill the purposes outlined in this policy or as required by law.',
        'When your account is closed or no longer active, your personal data may be deleted or anonymized, except where retention is required for legal compliance, dispute resolution, or legitimate business purposes.',
        'To request data deletion, please contact support. We will respond within a reasonable period, as required by law.',
      ],
    },
    {
      question: '6. Cookies and Tracking Technologies',
      answer: [
        'We use cookies and similar technologies to: Improve user experience, Remember preferences, Analyze usage trends',
        'You can control cookie settings through your browser, but disabling cookies may impact certain system features.',
      ],
    },
    {
      question: '7. Protection and Security of Personal Data',
      answer: [
        'We implement reasonable and appropriate technical, organizational, and physical measures to protect personal data against unauthorized access, loss, misuse, alteration, or disclosure.',
        'Only authorized personnel with a legitimate need have access to personal data.',
      ],
    },
    {
      question: '8. Changes to This Privacy Policy',
      answer: [
        "We may update this Privacy Policy from time to time. Any changes will be posted within the system, and the 'Last updated' date above will be revised accordingly.",
        'By continuing to use the system after changes are posted, you agree to the updated policy.',
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-24">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-600 mb-8">Last updated: {lastUpdatedDate}</p>

            {/* Introduction */}
            <div className="prose prose-sm max-w-none mb-12 text-gray-700 leading-relaxed space-y-4">
              <p>
                UP Cebu Exchange ("we", "us", "our", or the "System") is committed to protecting the privacy of users of
                our system. This Privacy Policy explains how we collect, use, disclose, store, and protect your personal
                information in accordance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and its
                Implementing Rules and Regulations.
              </p>
              <p>
                By accessing or using our system, you agree to the collection and use of information in accordance with
                this policy.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="border rounded-lg overflow-hidden shadow-sm mb-12">
            {policySections.map((section, index) => (
              <FAQItem key={index} question={section.question} answer={section.answer} defaultOpen={index === 0} />
            ))}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions, requests, or concerns about this Privacy Policy or your personal data, please
              contact us:
            </p>
            <a
              href={`mailto:${APP_CONTACT_EMAIL}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
            >
              {APP_CONTACT_EMAIL}
            </a>
            <p className="text-gray-700 font-semibold mt-4">{APP_CONTACT_PHONE}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
