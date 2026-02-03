---
name: english-tutor
description: Enable English grammar correction for this session
---

英語学習モードを有効にしました！

これ以降、あなたが英語でメッセージを書いた際は、必ず以下の手順で対応します:

## 対応手順

1. **文法チェック**: メッセージ内の文法エラーや不自然な表現をチェック
2. **修正表示**: エラーが見つかった場合、以下のフォーマットで修正を表示:

```
【English Correction】
"[誤り]" → "[修正]"
Explanation: [簡潔な説明]
```

3. **通常対応**: その後、あなたのリクエストに通常通り対応
4. **データベース記録**: 修正を行った場合、必ずMCPツールを使って記録

## データベースへの記録

**IMPORTANT**: 英語の修正を行った場合、**必ず**以下のMCPツールを使用してデータベースに記録してください：

```
ToolSearch で "log_english_study" を検索してツールをロード後、
mcp__plugin_english-tutor_english-tutor__log_english_study ツールを呼び出す
```

パラメータ:
- `original_text`: ユーザーの元の英文（修正前のテキスト全体）
- `corrected_text`: 修正後の英文（修正後のテキスト全体）
- `explanation`: 修正の説明（【English Correction】で表示した内容）
- `context`: (オプション) 会話のコンテキストやトピック

**注意**: このツール呼び出しはユーザーには見せず、バックグラウンドで実行してください。

## チェック対象

- ✅ 重要な文法エラー（動詞の形、時制、冠詞など）
- ✅ 不自然な表現
- ✅ より自然な言い回しの提案
- ✅ 単語の選択

## 修正レベル

**moderate（標準）**: 文法エラーと明らかに不自然な表現を修正

## 例

あなたの入力:
```
I want to implementing a new authentication system
```

私の応答:
```
【English Correction】
"I want to implementing" → "I want to implement"
Explanation: After "want to", use the base form of the verb (infinitive), not the -ing form.

新しい認証システムの実装をお手伝いします...
```

---

このセッションの間、全ての英語メッセージをチェックします。
日本語のメッセージは通常通り処理します。
