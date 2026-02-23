---
name: english-tutor:web
description: Launch the English Tutor Dashboard to review your learning history
---

## Command Behavior

1. **Check Dependencies**:
   Ensure `node` (v22+) is available.

2. **Run Server**:
   Execute the server in the background:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/web/server.js --db ${CLAUDE_PLUGIN_ROOT}/english_study.db --port 3000
   ```

3. **Notify User**:
   Notify the user that the dashboard is running:
   "English Tutor Dashboard is now running at [http://localhost:3000](http://localhost:3000)"

---

English Tutor Dashboard を起動します！

これ以降、あなたが過去の英語学習履歴をブラウザ上で確認できるようになります。

## 起動手順

1. **サーバーの起動**:
   以下のコマンドを使用してサーバーをバックグラウンドで起動します：

   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/web/server.js 
     --db ${CLAUDE_PLUGIN_ROOT}/english_study.db 
     --port 3000
   ```

2. **ブラウザでのアクセス**:
   起動後、以下のURLにアクセスしてダッシュボードを確認してください：
   [http://localhost:3000](http://localhost:3000)

## ダッシュボードでできること

- **統計の確認**: 総修正数、直近7日間、直近30日間の学習状況を把握
- **履歴のフィルタリング**:
  - **日付範囲**: 指定した期間の修正を抽出
  - **キーワード検索**: オリジナルテキスト、修正、または説明から検索
- **詳細の確認**: 各カードをクリックすると、修正の背景や文脈（Context）を詳細に確認可能

---

サーバーを起動しました。
[http://localhost:3000](http://localhost:3000) でダッシュボードを確認できます。
停止するには、このターミナルまたはバックグラウンドプロセスを停止してください。
