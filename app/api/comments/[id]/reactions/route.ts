import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id

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

    // 既存のリアクションをチェック
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_commentId: {
          userId: demoUser.id,
          commentId
        }
      }
    })

    if (existingReaction) {
      // 既にリアクションしている場合は削除
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      })
    } else {
      // リアクションを作成
      await prisma.reaction.create({
        data: {
          userId: demoUser.id,
          commentId
        }
      })
    }

    // 更新後のリアクション数を取得
    const reactionCount = await prisma.reaction.count({
      where: { commentId }
    })

    return NextResponse.json({
      hasReacted: !existingReaction,
      reactionCount
    })
  } catch (error) {
    console.error('Error handling reaction:', error)
    return NextResponse.json(
      { error: 'Failed to handle reaction' },
      { status: 500 }
    )
  }
}