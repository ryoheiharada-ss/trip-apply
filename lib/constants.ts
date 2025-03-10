export const FLOW_PATHS = {
  STEP1: '/travel-request/step1',
  STEP2: '/travel-request/step2',
  STEP3: '/travel-request/step3',
  REVIEW: '/travel-request/review',
  CONFIRM: '/travel-request/confirm',
  COMPLETE: '/travel-request/complete',
} as const;

export const FLOW_ORDER = [
  FLOW_PATHS.STEP1,
  FLOW_PATHS.STEP2,
  FLOW_PATHS.STEP3,
  FLOW_PATHS.REVIEW,
  FLOW_PATHS.CONFIRM,
  FLOW_PATHS.COMPLETE,
] as const;

export const DEPARTMENTS = [
  { value: "sales", label: "AI トランスフォーメーション室" },
  { value: "engineering", label: "技術部" },
  { value: "marketing", label: "マーケティング部" },
  // 他の部門を追加
] as const;

export const TRAVEL_TYPES = [
  { value: "sales", label: "顧客訪問・商談", destinationPlaceholder: "訪問先企業名（例：株式会社〇〇）" },
  { value: "meeting", label: "社内会議・プロジェクト打合せ", destinationPlaceholder: "会議開催オフィス名（例：本社）" },
  { value: "training", label: "社内行事・式典参加", destinationPlaceholder: "開催場所（例：〇〇ホテル）" },
  { value: "exhibition", label: "イベント参加・学会・セミナー", destinationPlaceholder: "イベント会場名（例：東京ビッグサイト）" },
  { value: "conference", label: "現地調査・市場調査・フィールドワーク", destinationPlaceholder: "調査実施場所（例：〇〇地区）" },
] as const;

export const PREFECTURES = [
  { value: "hokkaido", label: "北海道" },
  { value: "aomori", label: "青森県" },
  { value: "iwate", label: "岩手県" },
  { value: "miyagi", label: "宮城県" },
  { value: "akita", label: "秋田県" },
  { value: "yamagata", label: "山形県" },
  { value: "fukushima", label: "福島県" },
  { value: "ibaraki", label: "茨城県" },
  { value: "tochigi", label: "栃木県" },
  { value: "gunma", label: "群馬県" },
  { value: "saitama", label: "埼玉県" },
  { value: "chiba", label: "千葉県" },
  { value: "tokyo", label: "東京都" },
  { value: "kanagawa", label: "神奈川県" },
  { value: "niigata", label: "新潟県" },
  { value: "toyama", label: "富山県" },
  { value: "ishikawa", label: "石川県" },
  { value: "fukui", label: "福井県" },
  { value: "yamanashi", label: "山梨県" },
  { value: "nagano", label: "長野県" },
  { value: "gifu", label: "岐阜県" },
  { value: "shizuoka", label: "静岡県" },
  { value: "aichi", label: "愛知県" },
  { value: "mie", label: "三重県" },
  { value: "shiga", label: "滋賀県" },
  { value: "kyoto", label: "京都府" },
  { value: "osaka", label: "大阪府" },
  { value: "hyogo", label: "兵庫県" },
  { value: "nara", label: "奈良県" },
  { value: "wakayama", label: "和歌山県" },
  { value: "tottori", label: "鳥取県" },
  { value: "shimane", label: "島根県" },
  { value: "okayama", label: "岡山県" },
  { value: "hiroshima", label: "広島県" },
  { value: "yamaguchi", label: "山口県" },
  { value: "tokushima", label: "徳島県" },
  { value: "kagawa", label: "香川県" },
  { value: "ehime", label: "愛媛県" },
  { value: "kochi", label: "高知県" },
  { value: "fukuoka", label: "福岡県" },
  { value: "saga", label: "佐賀県" },
  { value: "nagasaki", label: "長崎県" },
  { value: "kumamoto", label: "熊本県" },
  { value: "oita", label: "大分県" },
  { value: "miyazaki", label: "宮崎県" },
  { value: "kagoshima", label: "鹿児島県" },
  { value: "okinawa", label: "沖縄県" },
] as const;

export const ACCOMMODATION_RATES = {
  tokyo: 13000,
  other: 11000,
} as const;
