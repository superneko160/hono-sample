import { HTMLElement } from 'node-html-parser'

/**
 * タグ名と属性を取得した配列を作成
 * @returns {object} 要素名と属性のデータ
 */
export const getElements = (root: HTMLElement) => {
  let data = {}

  function traverse(element: HTMLElement) {
    // 属性（attributes）が空ではなかった場合
    if (element.attributes && Object.keys(element.attributes).length  !== 0) {
      data[element.tagName] = element.attributes
    }
    element.childNodes.forEach(traverse)
  }

  traverse(root)

  return data
}