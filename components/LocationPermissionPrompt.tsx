'use client'

import { MapPin, X } from 'lucide-react'

interface LocationPermissionPromptProps {
  onAllow: () => void
  onDeny: () => void
  error?: string
}

export default function LocationPermissionPrompt({ onAllow, onDeny, error }: LocationPermissionPromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">位置情報の利用</h2>
          </div>
          <button
            onClick={onDeny}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                TownVoicesがあなたの現在位置を地図上に表示します。
              </p>
              <p className="text-sm text-gray-600">
                位置情報は投稿時の便利な機能として使用され、プライバシーは保護されます。
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onDeny}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              許可しない
            </button>
            <button
              onClick={onAllow}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              許可する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}