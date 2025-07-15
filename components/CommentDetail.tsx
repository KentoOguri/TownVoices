'use client'

import { Comment } from '@/types'
import { ThumbsUp, Calendar, User } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface CommentDetailProps {
  comment: Comment
}

export default function CommentDetail({ comment }: CommentDetailProps) {
  const [hasReacted, setHasReacted] = useState(comment.hasReacted || false)
  const [reactionCount, setReactionCount] = useState(comment.reactionCount)
  const queryClient = useQueryClient()

  const reactionMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/comments/${comment.id}/reactions`)
      return response.data
    },
    onSuccess: (data) => {
      setHasReacted(data.hasReacted)
      setReactionCount(data.reactionCount)
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })

  const handleReaction = () => {
    reactionMutation.mutate()
  }

  return (
    <div className="p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          {comment.user.icon ? (
            <img src={comment.user.icon} alt={comment.user.name} className="w-full h-full rounded-full" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{comment.user.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {comment.category.name}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-4">{comment.content}</p>

      <button
        onClick={handleReaction}
        disabled={reactionMutation.isPending}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
          hasReacted 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">わかる</span>
        <span className="text-sm">({reactionCount})</span>
      </button>
    </div>
  )
}