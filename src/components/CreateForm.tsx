/**
 * ユーザの新規作成コンポーネント
 * @returns {JSX.Element} フォーム
 */
export const CreateForm = () => (
  <form action="user" method="post" required>
    username: <input type="text" name="name" id="name" required /><br />
    age: <input type="number" name="age" id="age" required /><br />
    <button type="submit">CREATE USER</button>
  </form>
)