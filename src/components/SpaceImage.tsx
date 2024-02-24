/**
 * 宇宙の画像を表示するコンポーネント
 * @param props.url {string} 画像のURL
 * @returns {JSX.Element} 画像を表示する要素
 */
export const SpaceImage = (props: {url: string}) => (
    <img src={props.url} />
)