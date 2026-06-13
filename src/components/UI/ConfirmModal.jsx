import React from "react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-orange-500 px-4 py-2 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
