export const paymentApi = {
  update: async (paymentId: number, data: { amount: number; method: string; status: string }) => {
    const response = await fetch(`/api/payment/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment');
    }
    console.log('Payment updated successfully');
    return response.json();
  },
  updateStatus: async (paymentId: number, status: string) => {
    const response = await fetch(`/api/payment/${paymentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }
    console.log('Payment status updated successfully');
    return response.json();
  },
  createPaymentTransaction: async (data: {
    paymentId: number;
    amount: number;
    currency?: string;
    transactionType: string;
    method: string;
    imageFile?: File;
    imageUrl?: string;
    notes?: string;
    transactionDate?: string;
  }) => {
    const formData = new FormData();
    formData.append('amount', data.amount.toString());
    formData.append('currency', data.currency || 'PHP');
    formData.append('transactionType', data.transactionType || 'cash');
    formData.append('method', data.method);
    if (data.imageFile) {
      formData.append('imageFile', data.imageFile);
    }
    if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (data.transactionDate) {
      formData.append('transactionDate', data.transactionDate);
    }

    const response = await fetch(`/api/payment/${data.paymentId}/transaction`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create payment transaction' }));
      throw new Error(errorData.error || 'Failed to create payment transaction');
    }
    console.log('Payment transaction created successfully');
    return response.json();
  },
};
