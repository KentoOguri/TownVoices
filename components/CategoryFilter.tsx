'use client'

import { Category } from '@/types'
import { Filter } from 'lucide-react'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
}

export default function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryToggle 
}: CategoryFilterProps) {
  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      '教育': 'bg-blue-100 text-blue-800 border-blue-300',
      '福祉': 'bg-green-100 text-green-800 border-green-300',
      '生活': 'bg-amber-100 text-amber-800 border-amber-300',
      'その他': 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[categoryName] || colors['その他']
  }

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4" />
        <h3 className="font-medium">カテゴリーフィルター</h3>
      </div>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryToggle(category.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(category.name)}`}>
              {category.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}