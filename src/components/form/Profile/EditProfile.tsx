'use client';
import React, { useState, useEffect } from 'react';
import { USER_ROLES } from '@/lib/constants';
import type { UserDTO, UserUpdateDTO } from '@/models/User';

function EditProfileForm({ user }: { user: UserDTO }) {
  const [formData, setFormData] = useState<UserUpdateDTO>({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    password: '',
    newPassword: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.newPassword && formData.newPassword !== confirmPassword) {
        alert('New passwords do not match');
        setSubmitting(false);
        return;
      }

      console.log;

      const res = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error || 'Failed to update profile.');
        setSubmitting(false);
        return;
      }

      alert('Profile updated successfully');
      setConfirmPassword('');
      setFormData((prev) => ({
        ...prev,
        password: '',
        newPassword: '',
      }));
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const sectionCls = 'grid gap-4';

  return (
    <form onSubmit={handleSubmit} className={sectionCls}>
      <div>
        <label className={labelCls} htmlFor="fullName">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className={inputCls}
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          readOnly
          className={inputCls}
          value={user.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className={inputCls}
          placeholder="+1234567890"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="password">
          Current Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={inputCls}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="newPassword">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className={inputCls}
          placeholder="••••••••"
          value={formData.newPassword}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={inputCls}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white transition ${
            submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Updating…' : 'Update Profile'}
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
