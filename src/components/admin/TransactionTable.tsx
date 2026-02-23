'use client';

import { useState } from 'react';

interface Transaction {
  id: number;
  paymentId: number;
  transactionType: string;
  amount: string;
  currency: string;
  method: string;
  recordedByUserId?: number | null;
  imageUrl?: string | null;
  metadata?: Record<string, any> | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const getTransactionTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'payment':
      return 'bg-blue-100 text-blue-800';
    case 'refund':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions recorded for this payment</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <>
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}
                  >
                    {transaction.transactionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.currency}{' '}
                  {Number(transaction.amount).toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {transaction.method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleExpanded(transaction.id)}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors font-medium"
                  >
                    {expandedId === transaction.id ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>

              {/* Expanded Details Row */}
              {expandedId === transaction.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-sm">Transaction Details</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {transaction.imageUrl && (
                          <div className="bg-white rounded p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                              Payment Proof
                            </p>
                            <a
                              href={transaction.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              View Proof Document
                            </a>
                          </div>
                        )}

                        {transaction.metadata && (
                          <>
                            {transaction.metadata['recordedBy'] && (
                              <div className="bg-white rounded p-3 border border-gray-200 col-span-1 md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                  Recorded By
                                </p>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>Email: {transaction.metadata['recordedBy'].email}</p>
                                  <p>Full Name: {transaction.metadata['recordedBy'].fullName}</p>
                                </div>
                              </div>
                            )}
                            {transaction.metadata['paymentIntentId'] && (
                              <div className="bg-white rounded p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                  Stripe Payment Intent ID
                                </p>
                                <p className="text-sm text-gray-900">{transaction.metadata['paymentIntentId']}</p>
                              </div>
                            )}

                            {transaction.metadata['paymentMethod'] && (
                              <div className="bg-white rounded p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                  Stripe Payment Method
                                </p>
                                <p className="text-sm text-gray-900">{transaction.metadata['paymentMethod']}</p>
                              </div>
                            )}

                            {transaction.metadata['notes'] && (
                              <div className="bg-white rounded p-3 border border-gray-200 col-span-1 md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                  {transaction.metadata['notes']}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Metadata</p>
                          <pre className="text-xs text-gray-900 bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(transaction.metadata, null, 2)}
                          </pre>
                        </div>
                      )} */}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
