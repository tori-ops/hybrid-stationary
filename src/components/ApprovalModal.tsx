'use client';

import { useState } from 'react';

interface ApprovalModalProps {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ApprovalModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: ApprovalModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setConfirmed(true);
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Approve Invitation?
        </h2>
        <p className="text-gray-600 mb-6">
          By approving this invitation, you're confirming that everything looks good and is ready to be published. This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Approving...' : 'Yes, Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}
