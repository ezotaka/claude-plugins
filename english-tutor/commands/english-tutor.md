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
4. **データベース記録**: 修正を行った場合、必ずスクリプトを使って記録

## データベースへの記録

**IMPORTANT**: 英語の修正を行った場合、**必ず**以下のスクリプトを使用してデータベースに記録してください：

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/log-correction.sh \
  --original "ユーザーの元の英文" \
  --corrected "修正後の英文" \
  --explanation "修正の説明" \
  --context "会話のコンテキスト（オプション）"
```

パラメータ:
- `--original`: ユーザーの元の英文（修正前のテキスト全体）
- `--corrected`: 修正後の英文（修正後のテキスト全体）
- `--explanation`: 修正の説明（【English Correction】で表示した内容）
- `--context`: (オプション) 会話のコンテキストやトピック

**注意**: このスクリプトはバックグラウンドで実行され、ユーザーに表示されません。

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
