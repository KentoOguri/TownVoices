'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import MapView from '@/components/MapView'
import CommentForm from '@/components/CommentForm'
import CategorySelector from '@/components/CategorySelector'
import { Comment, Category } from '@/types'

export default function HomePage() {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('')

  useEffect(() => {
    // 環境変数からAPIキーを取得（本番環境では適切に設定）
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '')
  }, [])

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await axios.get('/api/comments')
      return response.data
    }
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories')
      return response.data
    }
  })

  // 初回ロード時に最初のカテゴリーを選択
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
    }
  }, [categories, selectedCategory])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setShowCommentForm(true)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const filteredComments = selectedCategory
    ? comments.filter(comment => comment.categoryId === selectedCategory)
    : comments

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Google Maps APIキーが設定されていません</p>
          <p className="text-sm text-gray-500">環境変数 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen">
      <div className="h-full pb-16">
        <MapView
          comments={filteredComments}
          onMapClick={handleMapClick}
          googleMapsApiKey={googleMapsApiKey}
        />
      </div>
      
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {showCommentForm && selectedLocation && (
        <CommentForm
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lng}
          onClose={() => {
            setShowCommentForm(false)
            setSelectedLocation(null)
          }}
        />
      )}
    </div>
  )
}