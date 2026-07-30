'use client';

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <input
          autoFocus
          type="text"
          placeholder="Search products..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none"
        />
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-800">
          Close
        </button>
      </div>
    </div>
  )
}