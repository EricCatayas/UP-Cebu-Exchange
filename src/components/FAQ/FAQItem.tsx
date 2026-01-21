import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string | string[];
  defaultOpen?: boolean;
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  return (
    <details className="group border-b last:border-b-0" open={defaultOpen}>
      <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-lg py-4 px-6 hover:bg-gray-50 transition-colors">
        <span>{question}</span>
        <svg
          className="w-5 h-5 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-4 text-gray-700 leading-relaxed">
        {Array.isArray(answer) ? (
          <ul className="list-disc list-inside space-y-2">
            {answer.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{answer}</p>
        )}
      </div>
    </details>
  );
}
