export const paymentApi = {
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
};
