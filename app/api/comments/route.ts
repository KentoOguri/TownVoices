import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: 後で範囲指定の実装を追加
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        category: true,
        _count: {
          select: { reactions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // TODO: 実際のユーザー認証実装後に修正
    const currentUserId = 'demo-user-id'

    // リアクション数と現在のユーザーがリアクションしたかを含める
    const commentsWithReactionInfo = await Promise.all(
      comments.map(async (comment) => {
        const hasReacted = currentUserId ? await prisma.reaction.findUnique({
          where: {
            userId_commentId: {
              userId: currentUserId,
              commentId: comment.id
            }
          }
        }) : null

        return {
          ...comment,
          reactionCount: comment._count.reactions,
          hasReacted: !!hasReacted,
          _count: undefined
        }
      })
    )

    return NextResponse.json(commentsWithReactionInfo)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, categoryId, latitude, longitude } = body

    // TODO: 実際のユーザー認証実装後に修正
    const demoUser = await prisma.user.findFirst({
      where: { email: 'demo@townvoices.com' }
    })

    if (!demoUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        latitude,
        longitude,
        userId: demoUser.id,
        categoryId
      },
      include: {
        user: true,
        category: true
      }
    })

    return NextResponse.json({
      ...comment,
      reactionCount: 0,
      hasReacted: false
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}