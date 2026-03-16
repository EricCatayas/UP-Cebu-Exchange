'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/lib/constants';
import type { UserCreateDTO } from '@/models/User';

function CreateUser() {
  const router = useRouter();
  const roles = USER_ROLES;

  const [formData, setFormData] = useState<UserCreateDTO>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: roles[0] || '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.password !== confirmPassword) {
        alert('Passwords do not match');
        setSubmitting(false);
        return;
      }

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || 'Failed to create user.');
        setSubmitting(false);
        return;
      }

      alert('User created successfully.');
      setTimeout(() => router.push('/admin/users'), 500);
    } catch (err) {
      alert('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const sectionCls = 'grid gap-4';

  return (
    <div className="px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create New User</h1>
      </div>
      <form onSubmit={handleSubmit} className={sectionCls}>
        <div>
          <label className={labelCls} htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
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
            required
            className={inputCls}
            placeholder="name@example.com"
            value={formData.email}
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
            required
            className={inputCls}
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={inputCls}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className={inputCls}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="role">
            Role
          </label>
          <select id="role" name="role" required className={inputCls} value={formData.role} onChange={handleChange}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white transition ${
              submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Creating…' : 'Create User'}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => router.push('/admin/users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateUser;
