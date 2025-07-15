import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    
    // カスタムソート順序
    const sortOrder = ['みんなの声', 'ひとこと', '教育', '福祉', '生活', 'その他']
    
    const sortedCategories = categories.sort((a, b) => {
      const aIndex = sortOrder.indexOf(a.name)
      const bIndex = sortOrder.indexOf(b.name)
      
      // 見つからない場合は最後に配置
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      
      return aIndex - bIndex
    })
    
    return NextResponse.json(sortedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}