from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv() #envファイルの読み込み

api_key = os.getenv("key") # 環境変数からAPIキーを取得

if not api_key: # 環境変数が設定されていない場合のエラーメッセージ
    raise ValueError("APIキーが設定されていません。")

client = OpenAI(api_key=api_key) # OpenAIクライアントを初期化

app = Flask(__name__) # Flaskアプリケーションのインスタンスを作成

@app.route("/") #ルートにアクセスした時の処理(index.htmlが表示される)
def index():
    return render_template("index.html") #HTMLテンプレートをレンダリング

@app.route("/chat", methods=["POST"]) #チャットのエンドポイントの定義
def chat():
    user_message = request.json.get("message") # ユーザーからのメッセージを取得
    system_message = {"role": "system", "content": "あなたは親切なアシスタントです。"} #ロールを変数として設定
    if user_message == "__init__": #最初にチャットボットから挨拶を送る
        messages = [
            system_message,{"role": "user", "content": "こんにちは！"}
        ]
    else: #ユーザーからのメッセージ
        messages = [
            system_message,{"role": "user", "content": user_message}
        ]
    response = client.chat.completions.create( #ChatGPT APIの呼び出し
    model="gpt-3.5-turbo", # 使用するモデルを指定
    messages=messages # メッセージ引数を初期化
    )

    reply = response.choices[0].message.content # APIからの応答を取得
    return jsonify({"reply": reply}) # JSON形式で応答を返す

if __name__ == "__main__":
    app.run(debug=True) 
