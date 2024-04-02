import { HTMLElement } from 'node-html-parser'

/**
 * タグ名と属性を取得した配列を作成
 * @param {HTMLElement} root HTML要素
 * @returns {object} data 要素名と属性のデータ
 */
export const getElements = (root: HTMLElement) => {
  let data = {}

  function traverse(element: HTMLElement) {
    // 属性（attributes）が空ではなかった場合
    if (element.attributes && Object.keys(element.attributes).length  !== 0) {
      data[element.tagName] = element.attributes
    }
    // 再帰的に処理
    element.childNodes.forEach(traverse)
  }

  traverse(root)

  return data
}