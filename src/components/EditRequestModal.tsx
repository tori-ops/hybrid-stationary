'use client';

import { useState } from 'react';

interface EditRequestModalProps {
  isOpen: boolean;
  onSubmit: (comments: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditRequestModal({
  isOpen,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditRequestModalProps) {
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (comments.trim()) {
      onSubmit(comments);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          What would you like us to adjust?
        </h2>

        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Please share any edits, changes, or adjustments you'd like us to make..."
          className="w-full h-40 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 resize-none text-gray-700"
          disabled={isLoading}
        />

        <p className="text-sm text-gray-500 mt-2 mb-4">
          We'll review your requests and update the page accordingly.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !comments.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Edits'}
          </button>
        </div>
      </div>
    </div>
  );
}
