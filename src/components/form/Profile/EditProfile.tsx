'use client';
import React, { useState, useEffect } from 'react';
import type { UserDTO, UserUpdateDTO } from '@/models/User';
import { validateFullName, validatePassword, validatePhoneNumber } from '@/lib/validators';

type FormErrors = Partial<Record<'fullName' | 'phoneNumber' | 'password' | 'newPassword' | 'confirmPassword', string>>;

function EditProfileForm({ user }: { user: UserDTO }) {
  const [formData, setFormData] = useState<UserUpdateDTO>({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    password: '',
    newPassword: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
      }));
    }
  }, [user]);

  const validatePasswordField = (field: 'password' | 'newPassword', value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: value ? (validatePassword(value).isValid ? undefined : validatePassword(value).message) : undefined,
    }));
  };

  const validateConfirmPassword = (nextConfirmPassword: string, nextNewPassword = formData.newPassword || '') => {
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        nextConfirmPassword && nextConfirmPassword !== nextNewPassword ? 'New passwords do not match' : undefined,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'fullName') {
      const validationResult = validateFullName(value);
      setErrors((prev) => ({
        ...prev,
        fullName: validationResult.isValid ? undefined : validationResult.message,
      }));
    }

    if (name === 'phoneNumber') {
      const validationResult = validatePhoneNumber(value);
      setErrors((prev) => ({
        ...prev,
        phoneNumber: validationResult.isValid ? undefined : validationResult.message,
      }));
    }

    if (name === 'password' || name === 'newPassword') {
      validatePasswordField(name, value);

      if (name === 'newPassword') {
        validateConfirmPassword(confirmPassword, value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert('Profile updated successfully');
        setConfirmPassword('');
        setFormData((prev) => ({
          ...prev,
          password: '',
          newPassword: '',
        }));
      } else {
        alert(data?.error || 'Failed to update profile.');
      }
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
  const errorTextCls = 'mt-1 text-sm text-red-600';
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
        {errors.fullName && <p className={errorTextCls}>{errors.fullName}</p>}
      </div>

      <div>
        <label className={labelCls} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" readOnly className={inputCls} value={user.email} />
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
        {errors.phoneNumber && <p className={errorTextCls}>{errors.phoneNumber}</p>}
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
        {errors.password && <p className={errorTextCls}>{errors.password}</p>}
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
        {errors.newPassword && <p className={errorTextCls}>{errors.newPassword}</p>}
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
          onChange={(e) => {
            const value = e.target.value;
            setConfirmPassword(value);
            validateConfirmPassword(value);
          }}
        />
        {errors.confirmPassword && <p className={errorTextCls}>{errors.confirmPassword}</p>}
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
