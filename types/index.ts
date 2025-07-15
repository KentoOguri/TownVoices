export interface User {
  id: string
  name: string
  icon?: string
}

export interface Category {
  id: string
  name: string
}

export interface Comment {
  id: string
  userId: string
  user: User
  content: string
  categoryId: string
  category: Category
  latitude: number
  longitude: number
  createdAt: string
  reactionCount: number
  hasReacted?: boolean
}

export interface Reaction {
  id: string
  userId: string
  commentId: string
}