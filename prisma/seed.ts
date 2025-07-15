import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // カテゴリーの作成
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'みんなの声' } }),
    prisma.category.create({ data: { name: 'ひとこと' } }),
    prisma.category.create({ data: { name: '教育' } }),
    prisma.category.create({ data: { name: '福祉' } }),
    prisma.category.create({ data: { name: '生活' } }),
    prisma.category.create({ data: { name: 'その他' } }),
  ])

  // デモユーザーの作成
  const demoUser = await prisma.user.create({
    data: {
      name: 'デモユーザー',
      email: 'demo@townvoices.com',
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })