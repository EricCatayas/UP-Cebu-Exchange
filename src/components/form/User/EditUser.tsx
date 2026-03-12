'use client';
import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/navigation';
import { USER_ROLES, USER_STATUSES } from '@/lib/constants';
import type { UserEditDTO, UserDTO } from '@/models/User';

function EditUser({ user, canEditRole = true }: { user: UserDTO; canEditRole?: boolean }) {
  const router = useRouter();
  const { openConfirmation } = useModal();

  const roles = USER_ROLES;
  const email = user.email;

  const [formData, setFormData] = useState<UserEditDTO>({
    fullName: user.fullName || '',
    phoneNumber: user.phoneNumber || '',
    status: user.status || '',
    role: user.role.name || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error(data?.error || 'Failed to update user.');
        setSubmitting(false);
        return;
      }

      console.log('User updated:', data);
      setTimeout(() => router.push('/admin/users'), 500);
    } catch (err) {
      console.error('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    openConfirmation(
      {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete user ${user.fullName}? This action cannot be undone.`,
      },
      async () => {
        try {
          const res = await fetch(`/api/user/${user.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
        } catch (err) {
          console.error('Network error. Please try again.');
        }
      }
    );
  };

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const sectionCls = 'grid gap-4';

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-gray-100">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit User</h1>
          <p className="mt-2 text-sm text-gray-600">Update account information and permissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-1">
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

            {/* Email */}
            <div className="md:col-span-1">
              <label className={labelCls} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`${inputCls} bg-gray-100 cursor-not-allowed`}
                value={email}
                readOnly
              />
            </div>

            {/* Phone Number */}
            <div className="md:col-span-1">
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

            {/* Status */}
            <div className="md:col-span-1">
              <label className={labelCls} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className={inputCls}
                value={formData.status}
                onChange={handleChange}
              >
                {USER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Role - Full width within the grid */}
            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="role">
                Role
              </label>
              {canEditRole ? (
                <select
                  id="role"
                  name="role"
                  required
                  className={inputCls}
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="role"
                  name="role"
                  type="text"
                  readOnly
                  className={`${inputCls} bg-gray-100 cursor-not-allowed`}
                  value={formData.role}
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-100">
            <button
              type="button"
              disabled={submitting}
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800 font-semibold transition"
            >
              Delete User Account
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                className="px-6 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition"
                onClick={() => router.push('/admin/users')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-2 rounded-lg font-medium text-white transition ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Updating…' : 'Update User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
