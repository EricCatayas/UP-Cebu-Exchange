import React from 'react';
import FAQItem from '@/components/FAQ/FAQItem';
import { APP_CONTACT_EMAIL } from '@/lib/constants';

const faqData = [
  {
    category: 'General Information',
    items: [
      {
        question: 'What is UP Cebu Exchange?',
        answer:
          "UP Cebu Exchange is an online rental system that allows customers to rent artworks from UP Cebu's art galleries, including pieces created by students.",
      },
      {
        question: 'Do I need an account to use the system?',
        answer: ['Some features may be public.', 'Most functions require a registered account.'],
      },
      {
        question: 'Does the system use third-party services?',
        answer: [
          'Yes. We may use third-party tools for hosting, analytics, or payments.',
          'We are not responsible for their privacy practices.',
        ],
      },
      {
        question: 'Can the policies change?',
        answer: ['Yes. Policies may be updated at any time.', 'Continued use means you accept the updated policies.'],
      },
      {
        question: 'Who can I contact for questions or concerns?',
        answer: `You can reach out to our support team at ${APP_CONTACT_EMAIL} for any inquiries or assistance.`,
      },
    ],
  },
  {
    category: 'Artwork Rental Process',
    items: [
      {
        question: 'How do I rent an artwork?',
        answer:
          'Explain the basic steps, such as browsing artworks, selecting an item, and submitting a rental request.',
      },
      {
        question: 'How long can I rent an artwork?',
        answer: ['3 months', '6 months', '12 months'],
      },
      {
        question: 'What are the rental fees?',
        answer: 'Rental fees vary based on the artwork. Check the artwork details for specific pricing information.',
      },
    ],
  },
  {
    category: 'Personal Information and Privacy',
    items: [
      {
        question: 'What personal information is collected?',
        answer:
          'We may collect your name, email, contact number, account details, and basic usage data. We only collect what is necessary.',
      },
    ],
  },
  {
    category: 'Personal Information and Privacy',
    items: [
      {
        question: 'What personal information is collected?',
        answer:
          'We may collect your name, email, contact number, account details, and basic usage data. We only collect what is necessary.',
      },
      {
        question: 'Why is my personal data collected?',
        answer: [
          'Manage your account',
          'Provide system features and support',
          'Improve security and performance',
          'Comply with legal requirements',
        ],
      },
      {
        question: 'Does the system share my personal data?',
        answer: [
          'We do not sell personal data.',
          'Data is shared only with authorized staff, trusted service providers, or when required by law.',
        ],
      },
      {
        question: 'How can I update or delete my information?',
        answer: [
          'You can update most details in your account settings.',
          'For deletion or access requests, contact test@email.com.',
        ],
      },
      {
        question: 'Can I withdraw my consent?',
        answer: [
          'Yes. You may withdraw consent at any time.',
          'Some system features may no longer be available after withdrawal.',
        ],
      },
      {
        question: 'Does the system use cookies?',
        answer: [
          'Yes. Cookies help improve performance and user experience.',
          'You can disable cookies in your browser, but some features may not work properly.',
        ],
      },
    ],
  },
];

function FAQ() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about UP Cebu Exchange</p>
        </div>

        {faqData.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{section.category}</h2>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              {section.items.map((item, itemIndex) => (
                <FAQItem
                  key={itemIndex}
                  question={item.question}
                  answer={item.answer}
                  defaultOpen={index === 0 && itemIndex === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
