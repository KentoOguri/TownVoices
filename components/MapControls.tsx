'use client'

import { MapPin, Plus, Minus } from 'lucide-react'

interface MapControlsProps {
  onLocationClick: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export default function MapControls({ onLocationClick, onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className="fixed bottom-20 md:bottom-20 sm:bottom-18 left-4 flex flex-col gap-2 z-20">
      {/* 拡大ボタン */}
      <button
        onClick={onZoomIn}
        className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg transition-colors"
        title="拡大"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* 縮小ボタン */}
      <button
        onClick={onZoomOut}
        className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg transition-colors"
        title="縮小"
      >
        <Minus className="w-5 h-5" />
      </button>

      {/* 位置移動ボタン */}
      <button
        onClick={onLocationClick}
        className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg transition-colors"
        title="現在位置に移動"
      >
        <MapPin className="w-5 h-5" />
      </button>
    </div>
  )
}