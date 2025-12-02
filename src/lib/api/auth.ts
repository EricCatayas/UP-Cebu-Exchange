export const authApi = {
  async verifyEmail(token: string): Promise<{ success: boolean; error: string | null }> {
    if (!token) {
      return { success: false, error: 'Missing token' };
    }
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Email verification failed' };
    }
  },

  async resendEmailVerification(email: string) {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to resend verification email');
    }
    return data;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to request password reset' };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to reset password' };
    }
  },
};
