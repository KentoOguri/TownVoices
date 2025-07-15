'use client'

import { Users, MessageSquare, GraduationCap, Heart, Home, MoreHorizontal } from 'lucide-react'
import { Comment } from '@/types'

interface CommentMarkerProps {
  comment: Comment
  onMouseOver: () => void
  onMouseOut: () => void
  onClick: () => void
}

export default function CommentMarker({ comment, onMouseOver, onMouseOut, onClick }: CommentMarkerProps) {
  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      'みんなの声': Users,
      'ひとこと': MessageSquare,
      '教育': GraduationCap,
      '福祉': Heart,
      '生活': Home,
      'その他': MoreHorizontal
    }
    return icons[categoryName] || icons['その他']
  }

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'みんなの声': '#A855F7',
      'ひとこと': '#EC4899',
      '教育': '#3B82F6',
      '福祉': '#10B981',
      '生活': '#F59E0B',
      'その他': '#6B7280'
    }
    return colors[categoryName] || colors['その他']
  }

  const Icon = getCategoryIcon(comment.category.name)
  const color = getCategoryColor(comment.category.name)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '…'
  }

  return (
    <div
      className="relative cursor-pointer"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {/* 吹き出し */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1">
        <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-1.5 min-w-fit max-w-32 text-center">
          <div className="text-xs text-gray-800 font-medium whitespace-nowrap">
            {truncateText(comment.content, 9)}
          </div>
          {/* 吹き出しの三角形 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200 -top-px"></div>
          </div>
        </div>
      </div>

      {/* アイコンマーク */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
  )
}