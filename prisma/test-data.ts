import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestData() {
  // 新潟県の座標範囲（大まかな範囲）
  const niigataCoords = {
    north: 38.557,
    south: 36.754,
    east: 139.888,
    west: 137.628
  }

  // ランダムな座標を生成
  const getRandomCoords = () => ({
    lat: Math.random() * (niigataCoords.north - niigataCoords.south) + niigataCoords.south,
    lng: Math.random() * (niigataCoords.east - niigataCoords.west) + niigataCoords.west
  })

  // カテゴリーを取得
  const categories = await prisma.category.findMany()
  
  // デモユーザーを取得
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo@townvoices.com' }
  })

  if (!demoUser) {
    console.error('デモユーザーが見つかりません')
    return
  }

  // テストコメントデータ
  const testComments = [
    // みんなの声
    '新潟駅周辺の開発が進んでいますね',
    '古町の活性化に期待しています',
    '万代橋から見る信濃川の景色が美しい',
    '新潟市の雪対策がしっかりしています',
    '日本海の夕日が絶景です',
    '米どころ新潟の農業を守りたい',
    '佐渡島への観光アクセスが便利',
    '新潟まつりが盛大で楽しい',
    '信濃川の堤防が整備されています',
    '新潟の食文化を大切にしたい',
    '長岡花火大会は世界一です',
    '上越新幹線の利便性が高い',
    '新潟空港の国際便を増やしてほしい',
    '燕三条の金属加工技術が素晴らしい',
    '魚沼産コシヒカリは最高品質',
    '弥彦神社の歴史を感じます',
    '寺泊の魚市場が新鮮で美味しい',
    '湯沢温泉でリラックスできます',
    '苗場スキー場で冬を満喫',
    '新潟の酒蔵巡りが楽しい',

    // ひとこと
    '雪が多すぎる',
    '海鮮が美味しい',
    '交通便利',
    '自然豊か',
    '米が最高',
    '花火すごい',
    '温泉最高',
    'スキー楽しい',
    'お酒美味しい',
    '人が優しい',
    '景色綺麗',
    '魚が新鮮',
    '歴史感じる',
    '祭り盛大',
    '技術すごい',
    '農業盛ん',
    '観光楽しい',
    '文化豊か',
    '伝統守る',
    '発展期待',

    // 教育
    '新潟大学の研究環境が充実している',
    '地域の小学校で農業体験授業',
    '図書館の蔵書を増やしてほしい',
    '子供たちの理科教育を充実させたい',
    '英語教育の国際化が必要',
    '新潟県立大学の地域貢献',
    '高等学校の進路指導が丁寧',
    '生涯学習センターの講座が豊富',
    '学校給食に地元食材を使用',
    'IT教育の推進が急務',
    '特別支援教育の充実',
    '学校施設の耐震化が完了',
    '教員の研修制度が整っている',
    '地域と連携した教育活動',
    '奨学金制度の拡充を',
    '職業訓練校の充実',
    '大学と企業の連携強化',
    '子供の読書活動推進',
    '科学館での体験学習',
    '国際交流教育の推進',

    // 福祉
    '高齢者のデイサービスが充実',
    '障害者支援施設の拡充が必要',
    '子育て支援センターが便利',
    '介護保険制度の充実',
    '医療機関との連携が良い',
    '高齢者の見守りサービス',
    '障害者の就労支援が充実',
    '認知症カフェの開設',
    '児童発達支援センター',
    '地域包括支援センター',
    'ボランティア活動が活発',
    '福祉用具の貸与制度',
    '相談支援体制の充実',
    '生活困窮者への支援',
    'バリアフリー化の推進',
    '地域福祉の充実',
    '社会福祉協議会の活動',
    '健康増進事業の推進',
    '精神保健福祉の充実',
    '災害時の要援護者支援',

    // 生活
    '除雪作業が迅速で助かります',
    '公共交通機関が便利',
    '商店街の活性化が必要',
    '道路の整備が進んでいます',
    '公園の維持管理が良い',
    '住宅地の環境が静か',
    '上下水道の整備が完了',
    'ゴミ分別制度が分かりやすい',
    '街灯の設置が十分',
    '防犯対策が充実',
    '消防署の対応が迅速',
    '市役所の手続きが簡単',
    '病院の待ち時間が短い',
    '薬局が近くにあって便利',
    'スーパーの品揃えが豊富',
    '銀行ATMの設置が多い',
    '郵便局のサービスが良い',
    '美容院の技術が高い',
    'レストランの味が美味しい',
    '駐車場の料金が安い',

    // その他
    '新潟の方言が温かい',
    '地域のイベントが多い',
    '商工会議所の活動が活発',
    '観光案内所の情報が充実',
    'Wi-Fi環境の整備',
    '防災無線の設置',
    '地域の安全パトロール',
    '環境保護活動の推進',
    'リサイクル活動の充実',
    '新エネルギーの導入',
    '地産地消の推進',
    '農産物直売所の充実',
    '工業団地の整備',
    '企業誘致の促進',
    '就職支援の充実',
    '創業支援制度',
    '商業施設の充実',
    '文化施設の維持',
    'スポーツ施設の充実',
    '地域ブランドの確立'
  ]

  // 100件のテストデータを作成
  const comments = []
  for (let i = 0; i < 100; i++) {
    const coords = getRandomCoords()
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomComment = testComments[Math.floor(Math.random() * testComments.length)]
    
    comments.push({
      content: randomComment,
      latitude: coords.lat,
      longitude: coords.lng,
      userId: demoUser.id,
      categoryId: randomCategory.id,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 過去30日間のランダムな日時
    })
  }

  // データベースに挿入
  await prisma.comment.createMany({
    data: comments
  })

  console.log('新潟県のテストデータ100件を作成しました')
}

createTestData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })