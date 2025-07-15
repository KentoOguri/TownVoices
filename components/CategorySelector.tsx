'use client'

import { Category } from '@/types'
import { useRef, useEffect } from 'react'

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string) => void
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategorySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const getCategoryColor = (categoryName: string, isSelected: boolean) => {
    const baseColors: { [key: string]: { bg: string, text: string } } = {
      'みんなの声': { bg: 'bg-purple-500', text: 'text-purple-500' },
      'ひとこと': { bg: 'bg-pink-500', text: 'text-pink-500' },
      '教育': { bg: 'bg-blue-500', text: 'text-blue-500' },
      '福祉': { bg: 'bg-green-500', text: 'text-green-500' },
      '生活': { bg: 'bg-amber-500', text: 'text-amber-500' },
      'その他': { bg: 'bg-gray-500', text: 'text-gray-500' }
    }
    
    const color = baseColors[categoryName] || baseColors['その他']
    
    if (isSelected) {
      return `${color.bg} text-white`
    }
    return `bg-white ${color.text} border-2 border-current`
  }

  useEffect(() => {
    // 選択されたカテゴリーを中央に表示
    if (selectedCategory && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(`[data-category-id="${selectedCategory}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selectedCategory])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-10">
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            data-category-id={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap
              transition-all duration-200 transform
              ${getCategoryColor(category.name, selectedCategory === category.id)}
              ${selectedCategory === category.id ? 'scale-105 shadow-md' : 'hover:scale-105'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}