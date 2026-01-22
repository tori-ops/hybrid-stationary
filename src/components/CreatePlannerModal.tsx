'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CreatePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plannerUserId?: string;
  onSuccess: () => void;
}

export default function CreatePlannerModal({ isOpen, onClose, plannerUserId, onSuccess }: CreatePlannerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('planner-logos')
      .upload(fileName, file);

    if (error) throw new Error(`Logo upload failed: ${error.message}`);

    const { data: publicData } = supabase.storage
      .from('planner-logos')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const response = await fetch('/api/create-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          businessName,
          address,
          email,
          logoUrl,
          createdBy: plannerUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create planner');
      }

      // Reset form
      setFirstName('');
      setLastName('');
      setBusinessName('');
      setAddress('');
      setEmail('');
      setLogoFile(null);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold" style={{ color: '#274E13' }}>
            Create Planner Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
              Business Name *
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              placeholder="Street, City, State ZIP"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
              Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full text-xs"
            />
            {logoFile && (
              <p className="text-xs text-gray-600 mt-1">
                ✓ {logoFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-75"
              style={{ color: '#274E13', borderColor: '#274E13', border: '2px solid' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-sm text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#274E13' }}
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
