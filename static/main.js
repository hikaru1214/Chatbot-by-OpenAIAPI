async function sendMessage(message = null) { // メッセージを送信する関数
  const input = document.getElementById("user-input"); // HTMLの<input>から入力を取得

  if (message === null) { // 送信ボタンが押された時の処理
    message = input.value; // inputの値をmassageに代入
    if (!message) return; // 入力が空の場合は何もしない
    appendMessage(message, "user"); // ユーザーの送信内容を表示
    input.value = ""; // 入力フィールドをクリア
  }

  const response = await fetch("/chat", { // チャットエンドポイントにPOSTリクエストを送信(同期処理)
    method: "POST", // HTTPメソッドを指定
    headers: { "Content-Type": "application/json" }, // リクエストヘッダーにContent-Typeを設定
    body: JSON.stringify({ message: message }) // メッセージをJSON形式で送信
  });

  const data = await response.json(); // レスポンスをJSON形式で取得(同期処理)
  appendMessage(data.reply, "bot"); // チャットボットの返信内容を表示
}


function appendMessage(text, sender) { // チャット画面にメッセージ内容を表示させる関数
  const chatBox = document.getElementById("chat-box"); // HTMLから<div>チャットボックスを取得
  const messageDiv = document.createElement("div"); // 新しいメッセージ用の<div>を作成
  messageDiv.className = `message ${sender}`; // 作成した<div>にクラス名を設定(userまたはbot)
  messageDiv.textContent = text; // 作成した<div>にメッセージ内容を格納
  chatBox.appendChild(messageDiv); // チャットボックスに作成した<div>を追加
  chatBox.scrollTop = chatBox.scrollHeight; // チャットボックスを下までスクロール
}


window.addEventListener("DOMContentLoaded", () => { // 初回ロード時に__init__を渡す
  sendMessage("__init__");
});