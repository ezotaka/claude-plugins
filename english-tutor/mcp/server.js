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
  CREATE TABLE IF NOT EXISTS english_study_logs (
    id             TEXT PRIMARY KEY,
    original_text  TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    explanation    TEXT NOT NULL,
    context        TEXT,
    work_folder    TEXT,
    created_at     TEXT NOT NULL
  )
`);

const stmtInsert = db.prepare(`
  INSERT INTO english_study_logs
    (id, original_text, corrected_text, explanation, context, work_folder, created_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
`);

// ---------------------------------------------------------------------------
// MCP tool definition
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    name: 'log_correction',
    description:
      'Display an English correction to the user AND atomically log it to the learning database. ' +
      'ALWAYS use this tool instead of showing corrections as plain text — ' +
      'calling this tool is the only way corrections are recorded.',
    inputSchema: {
      type: 'object',
      properties: {
        original:    { type: 'string', description: "User's original English text" },
        corrected:   { type: 'string', description: 'Corrected English text' },
        explanation: { type: 'string', description: 'Brief explanation of the correction' },
        context:     { type: 'string', description: 'Optional: conversation context / topic' },
        work_folder: { type: 'string', description: 'Optional: current project/workspace name' },
      },
      required: ['original', 'corrected', 'explanation'],
    },
  },
];

// ---------------------------------------------------------------------------
// MCP method handlers
// ---------------------------------------------------------------------------
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

  const { original, corrected, explanation, context, work_folder } = params.arguments;

  try {
    stmtInsert.run(
      randomUUID(),
      original,
      corrected,
      explanation,
      context    ?? null,
      work_folder ?? null,
    );
  } catch (err) {
    process.stderr.write(`[english-tutor MCP] DB error: ${err.message}\n`);
  }

  const text = [
    '【English Correction】',
    `"${original}" → "${corrected}"`,
    `Explanation: ${explanation}`,
  ].join('\n');

  return {
    jsonrpc: '2.0',
    id,
    result: { content: [{ type: 'text', text }] },
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
