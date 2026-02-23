---
name: english-tutor
description: Enable English grammar correction for this session
---

**IMPORTANT - First Action**: Before responding to the user, you MUST create/update the state file to enable English correction:

1. Check if `.claude/english-tutor.local.md` exists
2. If it doesn't exist, create it with the template from `.claude-example/english-tutor.local.md` in the plugin directory, setting `correction_level: moderate`
3. If it exists but has `correction_level: off`, update it to `correction_level: moderate`
4. Only after updating the state file, proceed with your response

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
4. **データベース記録**: 修正を行った場合、**必ず** MCPツールを使って記録と表示を同時に行う

## データベースへの記録

**IMPORTANT**: 英語の修正を行った場合、**必ず** MCPツール `mcp__plugin_english-tutor_english-tutor__log_correction` を使用してください。このツールが修正テキストの生成とDB記録を不可分に実行します。

```
Tool: mcp__plugin_english-tutor_english-tutor__log_correction
Parameters:
  original    (必須) – ユーザーの元の英文
  corrected   (必須) – 修正後の英文
  explanation (必須) – 修正の説明
  context     (任意) – 会話のコンテキスト
  work_folder (任意) – 現在のプロジェクト名
```

ツールが返すテキスト（`【English Correction】`形式）をそのまま表示してください。

**フォールバック**（MCPツールが利用不可の場合のみ）:
```bash
${CLAUDE_PLUGIN_ROOT}/scripts/log-correction.sh \
  --original "ユーザーの元の英文" \
  --corrected "修正後の英文" \
  --explanation "修正の説明" \
  --context "会話のコンテキスト（オプション）" \
  --work-folder "$(basename "$(pwd)")"
```

## チェック対象

- ✅ 重要な文法エラー（動詞の形、時制、冠詞など）
- ✅ 不自然な表現
- ✅ より自然な言い回しの提案
- ✅ 単語の選択

## 修正レベル

**moderate（標準）**: 文法エラーと明らかに不自然な表現を修正

## 重要な方針

**カジュアルな会話でも必ず修正**: 会話が casual であっても、文法エラーや不自然な表現は常に修正します。「開発者のカジュアルな会話だから」という理由で修正を省略しません。一貫した修正により、効果的な学習を実現します。

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
