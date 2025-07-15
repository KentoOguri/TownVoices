'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useCallback, memo } from 'react'
import { Comment } from '@/types'
import CommentDetail from './CommentDetail'
import { MessageCircle } from 'lucide-react'

interface MapViewProps {
  comments: Comment[]
  onMapClick: (lat: number, lng: number) => void
  googleMapsApiKey: string
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 35.6812,
  lng: 139.7671
}

const MapView = memo(({ comments, onMapClick, googleMapsApiKey }: MapViewProps) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds()
    if (comments.length > 0) {
      comments.forEach(comment => {
        bounds.extend({ lat: comment.latitude, lng: comment.longitude })
      })
      map.fitBounds(bounds)
    }
  }, [comments])

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
        {comments.map((comment) => (
          <Marker
            key={comment.id}
            position={{ lat: comment.latitude, lng: comment.longitude }}
            onClick={() => setSelectedComment(comment)}
            onMouseOver={() => setHoveredComment(comment)}
            onMouseOut={() => setHoveredComment(null)}
            icon={{
              path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
              fillColor: getCategoryColor(comment.category.name),
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 1.5,
            }}
          />
        ))}

        {hoveredComment && !selectedComment && (
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

        {selectedComment && (
          <InfoWindow
            position={{ lat: selectedComment.latitude, lng: selectedComment.longitude }}
            onCloseClick={() => setSelectedComment(null)}
          >
            <CommentDetail comment={selectedComment} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
})

MapView.displayName = 'MapView'

export default MapView