import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export const ConfirmationModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'error', // 'error' | 'warning' | 'primary'
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const getVariantButtonClass = () => {
    switch (confirmVariant) {
      case 'error':
        return 'btn-error text-white';
      case 'warning':
        return 'btn-warning text-neutral';
      case 'primary':
      default:
        return 'btn-primary text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-base-100 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-base-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center text-xl shrink-0">
            <FiAlertTriangle />
          </div>
          <h3 className="font-bold text-lg text-neutral">{title}</h3>
        </div>

        <p className="text-sm text-base-content/80 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-ghost btn-sm rounded-lg"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`btn btn-sm rounded-lg ${getVariantButtonClass()}`}
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
