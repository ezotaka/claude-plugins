---
name: English Correction
description: This skill should be used when analyzing English text for corrections, when the user writes entirely in English, or when asked to "check my English", "correct this", "is my English correct", or similar requests for English language feedback. Provides systematic English correction with explanations.
version: 0.1.0
---

# English Correction for Developers

## Overview

This skill provides systematic English correction focused on helping developers improve their English while maintaining workflow efficiency. Corrections target grammar errors and unnatural expressions at a moderate level—strict enough to be educational, gentle enough to avoid disruption.

## Core Correction Principles

### When to Correct

Apply corrections when:
- User's message is entirely in English
- Grammar errors are present (subject-verb agreement, tense, article usage)
- Expressions are slightly unnatural but understandable
- Word choice could be more precise or idiomatic

Skip corrections when:
- Message contains mixed languages (English + other languages)
- Errors are trivial and don't affect clarity
- User explicitly disables corrections in settings
- Context suggests user is in a hurry (e.g., debugging emergency)

### Correction Format

Structure corrections clearly and concisely:

```
【English Correction】
Original: "[user's text]"
Corrected: "[improved version]"

Explanation:
[Brief explanation of why the correction was made]

[Continue with the user's requested task...]
```

Keep corrections brief (2-3 sentences maximum for explanation). Focus on the most impactful errors rather than listing every minor issue.

## Common Error Categories

### Grammar Errors

**Infinitives after modal verbs and "want to":**
- ❌ "I want to implementing a feature"
- ✅ "I want to implement a feature"
- Rule: Use base form after "want to", "need to", modals

**Subject-verb agreement:**
- ❌ "The function return a value"
- ✅ "The function returns a value"
- Rule: Third-person singular verbs need -s/-es

**Article usage:**
- ❌ "I need to create a function to validate user input"
- ✅ "I need to create a function to validate user input" (correct)
- Note: Articles ("a", "an", "the") are nuanced; correct only clear errors

**Verb tenses:**
- ❌ "I will implemented this feature"
- ✅ "I will implement this feature"
- Rule: Future tense uses base form with "will"

### Technical English Patterns

**Help + object + verb:**
- ❌ "Can you help me to understand async/await?"
- ✅ "Can you help me understand async/await?"
- Rule: "help + object + base verb" (no "to")

**Prepositions with technical terms:**
- ❌ "Connect to the database"
- ✅ "Connect to the database" (correct)
- Note: Common pairs: "connect to", "integrate with", "deploy to"

**Gerunds vs. infinitives:**
- ❌ "I finished to implement the feature"
- ✅ "I finished implementing the feature"
- Rule: "finish" takes gerund (-ing form)

See `references/common-mistakes.md` for comprehensive error patterns.

## Correction Levels

The skill adapts to user's `correction_level` setting:

### Off
Skip all corrections. Skill remains loaded but inactive.

### Gentle
Correct only critical errors that significantly impact clarity:
- Major grammar errors (wrong verb forms, missing verbs)
- Confusing word order
- Critical preposition errors

### Moderate (Default)
Correct grammar errors plus slightly unnatural expressions:
- All grammar errors
- Awkward phrasings
- Non-idiomatic expressions that native speakers wouldn't use
- Minor word choice improvements

### Strict
Provide comprehensive native-like suggestions:
- All moderate-level corrections
- More natural alternative phrasings
- Idiomatic expressions
- Stylistic improvements
- Register/formality adjustments

## Logging Corrections

**ALWAYS** use the MCP tool `mcp__plugin_english-tutor_english-tutor__log_correction` to display
AND log corrections atomically. The tool returns the formatted `【English Correction】` text —
display it exactly as returned. Calling this tool is the **only** way corrections are recorded.

```
Tool: mcp__plugin_english-tutor_english-tutor__log_correction
Parameters:
  original    (required) – user's full original English text
  corrected   (required) – full corrected English text
  corrections (required) – array of correction points:
    - category: Grammar | Spelling | Vocabulary | Style
    - original_fragment: (optional) specific wrong part
    - corrected_fragment: (optional) corrected part
    - explanation: explanation for this point
  context     (optional) – what the user was doing
  work_folder (optional) – current project name
```

**Fallback** (only if MCP tool is unavailable): use the bash script instead (note: script may need updating for v2):
```bash
${CLAUDE_PLUGIN_ROOT}/scripts/log-correction.sh \
  --original "User's full original text" \
  --corrected "Full corrected version" \
  --corrections_json '[{"category":"Grammar", ...}]' \
  --context "What they were doing"
```

**Important:**
- Log even if correction is simple. These logs build learning history for review.
- The MCP tool runs synchronously and returns display text; no separate bash call is needed.

## Technical English Considerations

### Code-Related English

When correcting English about code:
- Preserve technical accuracy over perfect grammar
- Keep code terminology exact (e.g., "async/await", not "asynchronous waiting")
- Accept common developer shorthand in casual contexts

### Commit Message Style

For commit messages (if checking explicitly requested text):
- Use imperative mood: "Fix bug" not "Fixed bug" or "Fixes bug"
- Omit articles for brevity: "Add feature" not "Add a feature"
- Keep first line under 50 characters

See `references/technical-english.md` for domain-specific patterns.

## Workflow Integration

### Minimal Disruption

Keep corrections brief and non-intrusive:
1. State correction first (2-3 lines)
2. Continue immediately with user's request
3. Don't make corrections feel like interruptions

### Example Flow

User asks: "Can you helping me to understand how React hooks work?"

Response:
```
【English Correction】
"Can you helping me" → "Can you help me"
"help me to understand" → "help me understand"

After "can you", use the base verb form. "Help" takes the infinitive without "to".

React hooks are functions that let you use state and lifecycle features...
[Continue with explanation]
```

The correction is quick, educational, and doesn't disrupt the main task.

## Edge Cases

### Mixed Content
If message has both English and code, only correct the English prose, not code comments (unless explicitly asked).

### Urgent Context
If user seems to be debugging or in urgent situation, consider skipping corrections or making them extra brief.

### Ambiguous Correctness
If text is borderline (could be correct in certain dialects or contexts), skip the correction or note it's optional.

### Learning Patterns
After logging several corrections, suggest reviewing logs to identify recurring mistakes (future feature with commands).

## Reading Settings

Check user's configuration file at `.claude/english-tutor.local.md`:

```yaml
---
correction_level: moderate  # off | gentle | moderate | strict
auto_log: true
---
```

Parse the YAML frontmatter to determine correction behavior. Default to `moderate` and `auto_log: true` if file doesn't exist.

## Additional Resources

### Reference Files

For detailed correction patterns and domain knowledge:
- **`references/common-mistakes.md`** - Comprehensive list of frequent errors with examples
- **`references/technical-english.md`** - Domain-specific patterns for programming and technical discussions

### Examples

Working correction examples in `examples/`:
- **`examples/correction-examples.md`** - Real-world correction scenarios with before/after

Use these references when encountering complex correction scenarios or domain-specific language that requires nuanced understanding.

## Summary

Focus on being helpful without being pedantic. Corrections should feel like gentle guidance from a supportive colleague, not harsh criticism. The goal is gradual improvement through consistent, clear feedback that doesn't disrupt the development workflow.
