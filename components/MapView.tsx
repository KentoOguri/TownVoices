'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow, OverlayView } from '@react-google-maps/api'
import { useState, useCallback, memo, useEffect } from 'react'
import { Comment } from '@/types'
import CommentDetail from './CommentDetail'
import CommentMarker from './CommentMarker'
import { MessageCircle, Users, MessageSquare, GraduationCap, Heart, Home, MoreHorizontal } from 'lucide-react'

interface MapViewProps {
  comments: Comment[]
  onMapClick: (lat: number, lng: number) => void
  googleMapsApiKey: string
  onMapLoad?: (map: google.maps.Map) => void
  onCommentSelect?: (comment: Comment) => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 35.6812,
  lng: 139.7671
}

const MapView = memo(({ comments, onMapClick, googleMapsApiKey, onMapLoad, onCommentSelect }: MapViewProps) => {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)

  // 位置情報の取得と監視
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('位置情報がサポートされていません')
      return
    }

    const successCallback = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setUserLocation(newLocation)
      setLocationError(null)
      
      // 初回取得時は地図を現在位置に移動
      if (mapInstance && !userLocation) {
        mapInstance.setCenter(newLocation)
        mapInstance.setZoom(14)
      }
    }

    const errorCallback = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError('位置情報の利用が拒否されました')
          break
        case error.POSITION_UNAVAILABLE:
          setLocationError('位置情報が利用できません')
          break
        case error.TIMEOUT:
          setLocationError('位置情報の取得がタイムアウトしました')
          break
        default:
          setLocationError('位置情報の取得に失敗しました')
          break
      }
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    // 初回位置取得
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)

    // リアルタイム位置監視
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options)

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [mapInstance, userLocation])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map)
    
    // 位置情報が既に取得されている場合は現在位置を中心に表示
    if (userLocation) {
      map.setCenter(userLocation)
      map.setZoom(14)
    } else {
      // 位置情報がまだ取得されていない場合はデフォルト位置
      map.setCenter(defaultCenter)
      map.setZoom(12)
    }
    
    // 親コンポーネントに地図インスタンスを渡す
    if (onMapLoad) {
      onMapLoad(map)
    }
  }, [userLocation, onMapLoad])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMapClick(e.latLng.lat(), e.latLng.lng())
    }
  }, [onMapClick])

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

  const mapOptions = {
    disableDefaultUI: false,
    mapTypeControl: false,
    fullscreenControl: false,
    keyboardShortcuts: false,
    mapTypeId: 'roadmap' as google.maps.MapTypeId,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 3,
              scale: 8,
            }}
            title="現在位置"
            zIndex={1000}
          />
        )}

        {comments.map((comment) => (
          <OverlayView
            key={comment.id}
            position={{ lat: comment.latitude, lng: comment.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2)
            })}
          >
            <CommentMarker
              comment={comment}
              onMouseOver={() => setHoveredComment(comment)}
              onMouseOut={() => setHoveredComment(null)}
              onClick={() => onCommentSelect && onCommentSelect(comment)}
            />
          </OverlayView>
        ))}

        {hoveredComment && (
          <InfoWindow
            position={{ lat: hoveredComment.latitude, lng: hoveredComment.longitude }}
            onCloseClick={() => setHoveredComment(null)}
          >
            <div className="p-2 max-w-xs">
              <p className="text-sm font-medium">{hoveredComment.category.name}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{hoveredComment.content}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
})

MapView.displayName = 'MapView'

export default MapView