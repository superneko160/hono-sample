/**
 * HTML内に含まれる改行、タブ、タグ以外の空白の除去
 * @param {string} data  HTMLコンテンツデータ
 * @returns {string}  除去後のコンテンツデータ
 */
export const trimHtml = (data: string): string => {
  return data.replace(/\r?\n|\r|\t/g, '').trim().replace(/>\s+</g, '><')
}