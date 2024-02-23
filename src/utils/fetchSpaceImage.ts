/**
 * NASAのWebAPIから宇宙の画像を取得
 * @returns {string} 画像のURL
 */
export const fetchSpaceImage = async () => {
  const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  const data = await res.json()
  return data.url
}