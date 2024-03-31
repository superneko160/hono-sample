/**
 * 画像ファイルアップロード用フォームのコンポーネント
 * @returns {JSX.Element} フォーム
 */
export const UploadForm = () => (
  <form action="upload" method="post" enctype="multipart/form-data" required>
    <input type="file" name="file" accept="image/*" required /><br />
    <button type="submit">アップロード</button>
  </form>
)