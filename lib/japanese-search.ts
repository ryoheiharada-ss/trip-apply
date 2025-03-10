/**
 * 文字列を正規化し、全角・半角の違いを吸収
 */
export const normalizeString = (str: string): string => {
  return str.normalize('NFKC').toLowerCase();
};

/**
 * ひらがなをカタカナに変換
 */
export const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, match => 
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
};

/**
 * カタカナをひらがなに変換
 */
export const katakanaToHiragana = (str: string): string => {
  return str.replace(/[\u30A1-\u30F6]/g, match => 
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
};

/**
 * 日本語対応の検索用フィルター関数
 */
export const japaneseFilter = (searchValue: string, targetValue: string): boolean => {
  const normalized = normalizeString(searchValue);
  const normalizedTarget = normalizeString(targetValue);

  return (
    normalizedTarget.includes(normalized) ||
    normalizedTarget.includes(hiraganaToKatakana(normalized)) ||
    normalizedTarget.includes(katakanaToHiragana(normalized))
  );
};
