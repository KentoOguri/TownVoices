'use client'

import { Comment } from '@/types'
import { ThumbsUp, Calendar, User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface CommentSlideUpProps {
  comment: Comment | null
  onClose: () => void
}

export default function CommentSlideUp({ comment, onClose }: CommentSlideUpProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasReacted, setHasReacted] = useState(false)
  const [reactionCount, setReactionCount] = useState(0)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (comment) {
      setHasReacted(comment.hasReacted || false)
      setReactionCount(comment.reactionCount)
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [comment])

  const reactionMutation = useMutation({
    mutationFn: async () => {
      if (!comment) return
      const response = await axios.post(`/api/comments/${comment.id}/reactions`)
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        setHasReacted(data.hasReacted)
        setReactionCount(data.reactionCount)
        queryClient.invalidateQueries({ queryKey: ['comments'] })
      }
    }
  })

  const handleReaction = () => {
    if (comment) {
      reactionMutation.mutate()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // アニメーション後にonCloseを呼び出し
  }

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'みんなの声': 'bg-purple-100 text-purple-800 border-purple-300',
      'ひとこと': 'bg-pink-100 text-pink-800 border-pink-300',
      '教育': 'bg-blue-100 text-blue-800 border-blue-300',
      '福祉': 'bg-green-100 text-green-800 border-green-300',
      '生活': 'bg-amber-100 text-amber-800 border-amber-300',
      'その他': 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[categoryName] || colors['その他']
  }

  if (!comment) return null

  return (
    <>
      {/* 背景オーバーレイ */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* コメント表示エリア */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* ハンドルバー */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {comment.user.icon ? (
                <img 
                  src={comment.user.icon} 
                  alt={comment.user.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{comment.user.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(comment.category.name)}`}>
              {comment.category.name}
            </span>
          </div>

          <p className="text-gray-800 text-base leading-relaxed mb-6">
            {comment.content}
          </p>

          {/* わかるボタン */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReaction}
              disabled={reactionMutation.isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                hasReacted 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-medium">わかる</span>
              <span className="text-sm">({reactionCount})</span>
            </button>
          </div>
        </div>

        {/* 下部の余白 */}
        <div className="h-6" />
      </div>
    </>
  )
}