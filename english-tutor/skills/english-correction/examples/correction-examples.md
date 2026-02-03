# English Correction Examples

Real-world correction scenarios showing before/after with explanations.

## Example 1: Modal Verb Error

**User input:**
```
I want to implementing a new authentication system for our API
```

**Correction:**
```
【English Correction】
"I want to implementing" → "I want to implement"

After "want to", use the base form of the verb (infinitive).

Now, let's design the authentication system...
```

**Key points:**
- Quick correction format
- Brief explanation (one sentence)
- Immediately continue with the task

---

## Example 2: Multiple Errors (Moderate Level)

**User input:**
```
Can you helping me to understanding how async/await works? I always am confusing about it.
```

**Correction:**
```
【English Correction】
"Can you helping me to understanding" → "Can you help me understand"
"I always am confusing" → "I'm always confused" OR "It always confuses me"

After "can you", use the base verb form. "Help" takes the infinitive without "to".
For confusion, use the passive voice (I'm confused) or active (it confuses me).

Async/await is JavaScript's way of handling asynchronous operations...
```

**Key points:**
- Address multiple errors
- Prioritize most impactful mistakes
- Keep explanation under 3 sentences

---

## Example 3: Technical English

**User input:**
```
I need to make a query to database and then do some validation on the data
```

**Correction:**
```
【English Correction】
"make a query to database" → "query the database" OR "make a query to the database"
"do some validation on" → "validate" OR "perform validation on"

In technical English, we typically say "query the database" (verb form) or add the article "the".
"Validate" is more direct than "do validation".

Here's how to query the database and validate the results...
```

**Key points:**
- Technical terminology matters
- Offer more natural alternatives
- Articles are important in technical writing

---

## Example 4: Gentle Level (Only Critical Error)

**User input:**
```
The function return undefined when the parameter is null
```

**Correction:**
```
【English Correction】
"The function return" → "The function returns"

Third-person singular verbs need -s.

Let me help you handle the null parameter case...
```

**Key points:**
- Only critical grammar error corrected
- Minor issues ignored (this is "gentle" mode)
- Single, focused correction

---

## Example 5: Strict Level (Native-like Suggestions)

**User input:**
```
I finished to implement the feature yesterday but I didn't pushed it to the repository yet
```

**Correction:**
```
【English Correction】
"I finished to implement" → "I finished implementing"
"I didn't pushed" → "I didn't push" OR "I haven't pushed"

After "finish", use the gerund (-ing form), not infinitive.
"Didn't" takes the base verb form. Or use present perfect "haven't pushed" since it's still relevant.

More naturally: "I finished implementing the feature yesterday but haven't pushed it yet."

Let me help you prepare for the push...
```

**Key points:**
- More comprehensive corrections
- Native-like alternative phrasing offered
- Still concise (under 3 sentences)

---

## Example 6: Mixed Content (Code + English)

**User input:**
```
Can you check my code? The async function don't waiting for the promise

```javascript
async function getData() {
  const result = fetchData()
  return result
}
```
```

**Correction:**
```
【English Correction】
"The async function don't waiting" → "The async function doesn't wait"

Use "doesn't" (third person singular) and the base verb form "wait".

I see the issue in your code. You're not awaiting the promise...
```

**Key points:**
- Correct only the English prose
- Don't correct code comments unless explicitly asked
- Context-aware corrections

---

## Example 7: Skip Correction (Mixed Languages)

**User input:**
```
認証機能を implement したいんだけど、how should I structure the code?
```

**No correction given - message contains mixed languages**

**Response:**
```
For implementing authentication, I recommend this structure...
```

**Key points:**
- Mixed language → skip auto-correction
- Respond to the question directly
- User can explicitly request English check if needed

---

## Example 8: Ambiguous Case (Borderline)

**User input:**
```
The API endpoint is working fine now
```

**No correction needed**

**Response:**
```
Great! Now let's move on to...
```

**Key points:**
- Text is correct → no correction needed
- Don't force corrections on correct English
- Proceed directly with the conversation

---

## Example 9: Urgent Context (Brief Correction)

**User input:**
```
Help! The production server is down and the error logs showing "Connection refused"
```

**Correction:**
```
【English Correction】
"logs showing" → "logs show" OR "logs are showing"

Let me help you troubleshoot immediately...
```

**Key points:**
- Urgent situation → extra brief correction
- Fix only the most obvious error
- Prioritize helping with the emergency

---

## Example 10: Commit Message Review (Explicit Request)

**User input:**
```
Can you check this commit message:
"Fixed the bug that was breaking the login feature"
```

**Correction:**
```
【English Correction】
"Fixed the bug that was breaking" → "Fix bug breaking login"

Commit messages typically use imperative mood (present tense command form: "Fix", not "Fixed").
Also, articles ("the") are often omitted for brevity.

Standard format: "Fix bug breaking login" or "Fix login bug"

Would you like me to commit with the corrected message?
```

**Key points:**
- Explicit request for commit message check
- Explain commit message conventions
- Offer to proceed with corrected version

---

## Example 11: Setting-Aware (Gentle Mode)

**User's setting:** `correction_level: gentle`

**User input:**
```
I want to refactoring the codebase to make it more clean and reducing the complexity
```

**Correction:**
```
【English Correction】
"I want to refactoring" → "I want to refactor"

After "want to", use the base form of the verb.

Let's plan the refactoring approach...
```

**Key points:**
- Only corrects "want to refactoring" (critical grammar)
- Ignores "more clean" and "reducing" (less critical)
- Gentle mode focuses on major errors only

---

## Example 12: Setting-Aware (Strict Mode)

**User's setting:** `correction_level: strict`

**Same user input:**
```
I want to refactoring the codebase to make it more clean and reducing the complexity
```

**Correction:**
```
【English Correction】
"I want to refactoring" → "I want to refactor"
"more clean" → "cleaner"
"reducing" → "reduce"

After "want to", use base verb form. Use "cleaner" (comparative form), not "more clean".
Parallel structure: "make it cleaner and reduce the complexity" (both verbs after "to").

More naturally: "I want to refactor the codebase to make it cleaner and reduce complexity."

Let's plan the refactoring...
```

**Key points:**
- Comprehensive corrections
- Native-like alternative provided
- All errors addressed

---

## Logging Examples

Each correction is logged with:

```javascript
{
  original_text: "I want to implementing a feature",
  corrected_text: "I want to implement a feature",
  explanation: "After 'want to', use the base form of the verb (infinitive).",
  context: "User asking about feature implementation"
}
```

These logs build a learning history that users can review later to identify patterns in their mistakes.

---

## Summary

**Key correction principles demonstrated:**
1. **Brief and focused** - 2-3 sentences max for explanation
2. **Context-aware** - Adjust to urgency and user settings
3. **Non-intrusive** - Continue immediately with user's request
4. **Educational** - Explain the why, not just the what
5. **Consistent format** - Easy to scan and understand
6. **Progressive** - Gentle → Moderate → Strict based on settings
7. **Logged** - All corrections saved for learning review

The goal is to make corrections feel like helpful guidance from a supportive colleague, not harsh criticism from a teacher.
