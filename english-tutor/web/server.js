#!/usr/bin/env node
// English Tutor Web Dashboard - server.js
// Requires Node.js 22+

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
  argMap[args[i].replace(/^--/, '')] = args[i + 1];
}

const DB_PATH = argMap.db;
const PORT    = parseInt(argMap.port ?? '3000', 10);

if (!DB_PATH) {
  console.error('Error: --db <path> is required');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Database setup
// ---------------------------------------------------------------------------
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS english_study_logs (
    id             TEXT PRIMARY KEY,
    original_text  TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    explanation    TEXT NOT NULL,
    context        TEXT,
    created_at     TEXT NOT NULL
  )
`);

const stmtCorrections = db.prepare(`
  SELECT id, original_text, corrected_text, explanation, context, created_at
  FROM english_study_logs
  WHERE 
    (original_text LIKE ? OR corrected_text LIKE ? OR explanation LIKE ? OR context LIKE ?)
    AND created_at >= ?
    AND created_at <= ?
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?
`);

const stmtCount = db.prepare(`
  SELECT COUNT(*) AS total 
  FROM english_study_logs
  WHERE 
    (original_text LIKE ? OR corrected_text LIKE ? OR explanation LIKE ? OR context LIKE ?)
    AND created_at >= ?
    AND created_at <= ?
`);

const stmtCorrectionById = db.prepare(`
  SELECT id, original_text, corrected_text, explanation, context, created_at
  FROM english_study_logs
  WHERE id = ?
`);

const stmtStats = db.prepare(`
  SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN created_at >= datetime('now', '-7 days')  THEN 1 END) AS last7days,
    COUNT(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 END) AS last30days
  FROM english_study_logs
`);

// ---------------------------------------------------------------------------
// Static file (loaded once at startup)
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = readFileSync(join(__dirname, 'public', 'index.html'), 'utf8');

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function send(res, status, data, contentType = 'application/json') {
  const body = contentType === 'application/json' ? JSON.stringify(data) : data;
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------
function handleStats(res) {
  const stats = stmtStats.get();
  send(res, 200, stats);
}

function handleCorrections(req, res) {
  const url     = new URL(req.url, `http://localhost:${PORT}`);
  const page    = Math.max(1, parseInt(url.searchParams.get('page')    ?? '1',  10));
  const limit   = Math.min(100, parseInt(url.searchParams.get('limit') ?? '20', 10));
  const keyword = `%${url.searchParams.get('keyword') ?? ''}%`;
  const from    = url.searchParams.get('from') || '0000-00-00';
  const to      = url.searchParams.get('to')   || '9999-99-99';
  const offset  = (page - 1) * limit;

  const params = [keyword, keyword, keyword, keyword, from, to];
  const items  = stmtCorrections.all(...params, limit, offset);
  const total  = stmtCount.get(...params).total;

  send(res, 200, {
    total,
    page,
    items,
  });
}

function handleCorrectionById(id, res) {
  const row = stmtCorrectionById.get(id);
  if (!row) return send(res, 404, { error: 'Not found' });
  send(res, 200, row);
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const server = createServer((req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });

  if (pathname === '/' || pathname === '/index.html') {
    return send(res, 200, INDEX_HTML, 'text/html; charset=utf-8');
  }
  if (pathname === '/api/stats')       return handleStats(res);
  if (pathname === '/api/corrections') return handleCorrections(req, res);

  const matchId = pathname.match(/^\/api\/corrections\/([^/]+)$/);
  if (matchId) return handleCorrectionById(decodeURIComponent(matchId[1]), res);

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`English Tutor Dashboard running at http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
  console.log('Press Ctrl+C to stop.');
});

process.on('SIGINT',  () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });
