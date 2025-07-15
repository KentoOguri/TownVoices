'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import MapView from '@/components/MapView'
import CommentForm from '@/components/CommentForm'
import CategorySelector from '@/components/CategorySelector'
import LocationPermissionPrompt from '@/components/LocationPermissionPrompt'
import MapControls from '@/components/MapControls'
import CommentSlideUp from '@/components/CommentSlideUp'
import { Comment, Category } from '@/types'
import { Send } from 'lucide-react'

export default function HomePage() {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('')
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

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

  // 位置情報の許可プロンプトを表示
  useEffect(() => {
    if (!locationPermissionAsked && googleMapsApiKey) {
      // 位置情報の許可状態を確認
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          // 既に許可されている場合はプロンプトを表示せず、直接許可済みとする
          setLocationPermissionAsked(true)
        } else if (result.state === 'prompt') {
          // 許可が求められる場合のみプロンプトを表示
          const timer = setTimeout(() => {
            setShowLocationPrompt(true)
          }, 1000)
          return () => clearTimeout(timer)
        } else {
          // 拒否されている場合は何もしない
          setLocationPermissionAsked(true)
        }
      }).catch(() => {
        // Permissions APIが利用できない場合は従来の方法
        const timer = setTimeout(() => {
          setShowLocationPrompt(true)
        }, 1000)
        return () => clearTimeout(timer)
      })
    }
  }, [locationPermissionAsked, googleMapsApiKey])

  // 現在位置を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        }
      )
    }
  }, [])

  // 地図インスタンスを取得するためのコールバック
  const handleMapLoad = (map: google.maps.Map) => {
    setMapInstance(map)
  }

  const handleMapClick = (lat: number, lng: number) => {
    // 地図クリック時はモーダルを表示しない
    // setSelectedLocation({ lat, lng })
    // setShowCommentForm(true)
  }

  const handlePostButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 最新の現在位置を取得してコメント投稿に使用
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setSelectedLocation(currentLocation)
          setShowCommentForm(true)
        },
        (error) => {
          console.error('現在位置の取得に失敗しました:', error)
          // 位置情報が取得できない場合は保存済みの位置情報を使用
          if (userLocation) {
            setSelectedLocation(userLocation)
            setShowCommentForm(true)
          } else {
            // 最終的にデフォルト位置を使用
            setSelectedLocation({ lat: 35.6812, lng: 139.7671 })
            setShowCommentForm(true)
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0 // キャッシュを使用せず常に最新の位置を取得
        }
      )
    } else {
      // Geolocation APIが利用できない場合は保存済みの位置情報を使用
      if (userLocation) {
        setSelectedLocation(userLocation)
        setShowCommentForm(true)
      } else {
        setSelectedLocation({ lat: 35.6812, lng: 139.7671 })
        setShowCommentForm(true)
      }
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleLocationAllow = () => {
    setShowLocationPrompt(false)
    setLocationPermissionAsked(true)
  }

  const handleLocationDeny = () => {
    setShowLocationPrompt(false)
    setLocationPermissionAsked(true)
  }

  const handleLocationMove = () => {
    if (userLocation && mapInstance) {
      // より滑らかなアニメーションのためにanimateToオプションを使用
      mapInstance.panTo(userLocation)
      
      // ズームも滑らかに変更
      const currentZoom = mapInstance.getZoom() || 12
      const targetZoom = 14
      
      // 段階的にズーム
      if (currentZoom !== targetZoom) {
        const steps = Math.abs(targetZoom - currentZoom)
        const stepSize = (targetZoom - currentZoom) / steps
        
        for (let i = 1; i <= steps; i++) {
          setTimeout(() => {
            mapInstance.setZoom(currentZoom + (stepSize * i))
          }, i * 200)
        }
      }
    }
  }

  const handleZoomIn = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || 12
      mapInstance.setZoom(currentZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || 12
      mapInstance.setZoom(currentZoom - 1)
    }
  }

  const handleCommentSelect = (comment: Comment) => {
    setSelectedComment(comment)
  }

  const handleCloseCommentSlideUp = () => {
    setSelectedComment(null)
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
      <div className="h-full">
        <MapView
          comments={filteredComments}
          onMapClick={handleMapClick}
          googleMapsApiKey={googleMapsApiKey}
          onMapLoad={handleMapLoad}
          onCommentSelect={handleCommentSelect}
        />
      </div>
      
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* 地図操作ボタン */}
      <MapControls
        onLocationClick={handleLocationMove}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* 投稿ボタン */}
      <button
        onClick={handlePostButtonClick}
        className="fixed bottom-20 md:bottom-20 sm:bottom-18 right-4 bg-blue-500 hover:bg-blue-600 text-white 
                   px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-1.5 rounded-full shadow-lg transition-colors z-20 
                   text-sm md:text-sm sm:text-xs font-medium flex items-center gap-1.5"
      >
        <Send className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3" />
        投稿する
      </button>

      {showCommentForm && selectedLocation && (
        <CommentForm
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lng}
          initialCategoryId={selectedCategory || undefined}
          onClose={() => {
            setShowCommentForm(false)
            setSelectedLocation(null)
          }}
        />
      )}

      {showLocationPrompt && (
        <LocationPermissionPrompt
          onAllow={handleLocationAllow}
          onDeny={handleLocationDeny}
        />
      )}

      <CommentSlideUp
        comment={selectedComment}
        onClose={handleCloseCommentSlideUp}
      />
    </div>
  )
}