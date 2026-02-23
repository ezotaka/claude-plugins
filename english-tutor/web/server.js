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

const stmtSessions = db.prepare(`
  SELECT s.*, GROUP_CONCAT(c.category || ': ' || c.explanation, ' | ') AS summary_explanation
  FROM english_sessions s
  LEFT JOIN english_corrections c ON s.id = c.session_id
  WHERE 
    (s.original_text LIKE ? OR s.corrected_text LIKE ? OR c.explanation LIKE ? OR s.context LIKE ?)
    AND (s.work_folder LIKE ? OR ? IS NULL)
    AND s.created_at >= ?
    AND s.created_at <= ?
  GROUP BY s.id
  ORDER BY s.created_at DESC
  LIMIT ? OFFSET ?
`);

const stmtCount = db.prepare(`
  SELECT COUNT(DISTINCT s.id) AS total 
  FROM english_sessions s
  LEFT JOIN english_corrections c ON s.id = c.session_id
  WHERE 
    (s.original_text LIKE ? OR s.corrected_text LIKE ? OR c.explanation LIKE ? OR s.context LIKE ?)
    AND (s.work_folder LIKE ? OR ? IS NULL)
    AND s.created_at >= ?
    AND s.created_at <= ?
`);

const stmtSessionById = db.prepare(`
  SELECT * FROM english_sessions WHERE id = ?
`);

const stmtCorrectionsBySessionId = db.prepare(`
  SELECT * FROM english_corrections WHERE session_id = ?
`);

const stmtFolders = db.prepare(`
  SELECT DISTINCT work_folder 
  FROM english_sessions 
  WHERE work_folder IS NOT NULL AND work_folder != ''
  ORDER BY work_folder ASC
`);

const stmtStats = db.prepare(`
  SELECT
    COUNT(*) AS total_sessions,
    (SELECT COUNT(*) FROM english_corrections) AS total_corrections,
    COUNT(CASE WHEN created_at >= datetime('now', '-7 days')  THEN 1 END) AS last7days,
    (SELECT COUNT(*) FROM english_corrections c JOIN english_sessions s ON c.session_id = s.id WHERE s.created_at >= datetime('now', '-7 days')) AS corrections7days
  FROM english_sessions
`);

const stmtCategoryDist = db.prepare(`
  SELECT category, COUNT(*) as count
  FROM english_corrections
  GROUP BY category
  ORDER BY count DESC
`);

const stmtTrends = db.prepare(`
  SELECT date(created_at) as date, COUNT(*) as count
  FROM english_sessions
  GROUP BY date
  ORDER BY date ASC
  LIMIT 30
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
  // Map new field names to what UI expects for simplicity
  send(res, 200, {
    total: stats.total_corrections,
    last7days: stats.corrections7days,
    last30days: stats.total_sessions // Simple fallback for now
  });
}

function handleFolders(res) {
  const folders = stmtFolders.all().map(row => row.work_folder);
  send(res, 200, folders);
}

function handleCorrections(req, res) {
  const url     = new URL(req.url, `http://localhost:${PORT}`);
  const page    = Math.max(1, parseInt(url.searchParams.get('page')    ?? '1',  10));
  const limit   = Math.min(100, parseInt(url.searchParams.get('limit') ?? '20', 10));
  const keyword = `%${url.searchParams.get('keyword') ?? ''}%`;
  const folder  = url.searchParams.get('folder') || null;
  const from    = url.searchParams.get('from') || '0000-00-00';
  const to      = url.searchParams.get('to')   || '9999-99-99';
  const offset  = (page - 1) * limit;

  const params = [keyword, keyword, keyword, keyword, folder, folder, from, to];
  const sessions = stmtSessions.all(...params, limit, offset);
  const total    = stmtCount.get(...params).total;

  // Map to UI expectation
  const items = sessions.map(s => ({
    ...s,
    explanation: s.summary_explanation // So UI can still display something
  }));

  send(res, 200, {
    total,
    page,
    items,
  });
}

function handleCorrectionById(id, res) {
  const session = stmtSessionById.get(id);
  if (!session) return send(res, 404, { error: 'Not found' });
  
  const points = stmtCorrectionsBySessionId.all(id);
  send(res, 200, {
    ...session,
    points // List of all corrections
  });
}

function handleCategoryStats(res) {
  const categories = stmtCategoryDist.all();
  send(res, 200, categories);
}

function handleTrends(res) {
  const trends = stmtTrends.all();
  send(res, 200, trends);
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
  if (pathname === '/api/stats')                return handleStats(res);
  if (pathname === '/api/folders')              return handleFolders(res);
  if (pathname === '/api/corrections')          return handleCorrections(req, res);
  if (pathname === '/api/analytics/categories') return handleCategoryStats(res);
  if (pathname === '/api/analytics/trends')     return handleTrends(res);

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
