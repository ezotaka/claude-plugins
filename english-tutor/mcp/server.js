#!/usr/bin/env node
// English Tutor MCP Server - log_correction tool
// Requires Node.js 22+ (uses node:sqlite)

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync }    from 'node:fs';
import { homedir }      from 'node:os';
import { dirname, join } from 'node:path';
import { randomUUID }   from 'node:crypto';
import { createInterface } from 'node:readline';

// ---------------------------------------------------------------------------
// Database setup
// ---------------------------------------------------------------------------
const DB_PATH = process.env.ENGLISH_TUTOR_DB
  ?? join(homedir(), '.claude', 'english-tutor', 'english_study.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS english_sessions (
    id             TEXT PRIMARY KEY,
    original_text  TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    context        TEXT,
    work_folder    TEXT,
    created_at     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS english_corrections (
    id                 TEXT PRIMARY KEY,
    session_id         TEXT NOT NULL,
    category           TEXT NOT NULL,
    original_fragment  TEXT,
    corrected_fragment TEXT,
    explanation        TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES english_sessions(id)
  );
`);

const stmtInsertSession = db.prepare(`
  INSERT INTO english_sessions
    (id, original_text, corrected_text, context, work_folder, created_at)
  VALUES (?, ?, ?, ?, ?, datetime('now'))
`);

const stmtInsertCorrection = db.prepare(`
  INSERT INTO english_corrections
    (id, session_id, category, original_fragment, corrected_fragment, explanation)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// ---------------------------------------------------------------------------
// MCP tool definition
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    name: 'log_correction',
    description:
      'Display English corrections to the user AND atomically log them to the learning database. ' +
      'Supports multiple correction points per message.',
    inputSchema: {
      type: 'object',
      properties: {
        original:    { type: 'string', description: "User's full original English text" },
        corrected:   { type: 'string', description: 'Full corrected English text' },
        corrections: {
          type: 'array',
          description: 'Individual correction points',
          items: {
            type: 'object',
            properties: {
              category:           { type: 'string', enum: ['Grammar', 'Spelling', 'Vocabulary', 'Style'], description: 'Category of the error' },
              original_fragment:  { type: 'string', description: 'The specific part that was wrong (optional)' },
              corrected_fragment: { type: 'string', description: 'The corrected part (optional)' },
              explanation:        { type: 'string', description: 'Explanation for this specific correction' },
            },
            required: ['category', 'explanation'],
          }
        },
        context:     { type: 'string', description: 'Optional: conversation context / topic' },
        work_folder: { type: 'string', description: 'Optional: current project/workspace name' },
      },
      required: ['original', 'corrected', 'corrections'],
    },
  },
];

function handleInitialize(id) {
  return {
    jsonrpc: '2.0',
    id,
    result: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'english-tutor', version: '0.2.0' },
    },
  };
}

function handleToolsList(id) {
  return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
}

function handleToolCall(id, params) {
  if (params.name !== 'log_correction') {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unknown tool: ${params.name}` },
    };
  }

  const { original, corrected, corrections, context, work_folder } = params.arguments;
  const sessionId = randomUUID();

  try {
    stmtInsertSession.run(
      sessionId,
      original,
      corrected,
      context     ?? null,
      work_folder ?? null,
    );

    for (const corr of corrections) {
      stmtInsertCorrection.run(
        randomUUID(),
        sessionId,
        corr.category,
        corr.original_fragment  ?? null,
        corr.corrected_fragment ?? null,
        corr.explanation,
      );
    }
  } catch (err) {
    process.stderr.write(`[english-tutor MCP] DB error: ${err.message}\n`);
  }

  const textLines = [
    '【English Correction】',
    `Original:  "${original}"`,
    `Corrected: "${corrected}"`,
    '',
    'Points:',
  ];

  for (const corr of corrections) {
    const orig = corr.original_fragment ? `"${corr.original_fragment}" → ` : '';
    const corrFrag = corr.corrected_fragment ? `"${corr.corrected_fragment}" ` : '';
    textLines.push(`- [${corr.category}] ${orig}${corrFrag}(${corr.explanation})`);
  }

  return {
    jsonrpc: '2.0',
    id,
    result: { content: [{ type: 'text', text: textLines.join('\n') }] },
  };
}

// ---------------------------------------------------------------------------
// Stdio transport
// ---------------------------------------------------------------------------
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on('line', line => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }

  // Notifications have no id — ignore silently
  if (msg.id == null) return;

  let response;
  switch (msg.method) {
    case 'initialize':  response = handleInitialize(msg.id); break;
    case 'tools/list':  response = handleToolsList(msg.id);  break;
    case 'tools/call':  response = handleToolCall(msg.id, msg.params); break;
    default:
      response = {
        jsonrpc: '2.0',
        id: msg.id,
        error: { code: -32601, message: `Unknown method: ${msg.method}` },
      };
  }

  process.stdout.write(JSON.stringify(response) + '\n');
});

rl.on('close', () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });
