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
      setTimeout(() => router.push('/users'), 500);
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
    <div className="px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit User</h1>
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
            value={email}
            readOnly
            style={{
              backgroundColor: '#f3f4f6',
              cursor: 'not-allowed',
            }}
          />
        </div>

        <div>
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
          <label className={labelCls} htmlFor="role">
            Role
          </label>
          {canEditRole ? (
            <select id="role" name="role" required className={inputCls} value={formData.role} onChange={handleChange}>
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
              className={inputCls + ' bg-gray-100 cursor-not-allowed'}
              value={formData.role}
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white transition ${
              submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Updating…' : 'Update User'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className={`px-4 py-2 rounded text-white transition ${
              submitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Delete User
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => router.push('/users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
