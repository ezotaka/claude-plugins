import Database from "better-sqlite3";
import { EnglishStudyLog } from "../domain/EnglishStudyLog.js";
import { IEnglishStudyLogRepository } from "../domain/IEnglishStudyLogRepository.js";
import fs from "fs";
import path from "path";

export class SqliteEnglishStudyLogRepository implements IEnglishStudyLogRepository {
  private db: Database.Database;

  constructor(dbPath: string) {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS study_logs (
        id TEXT PRIMARY KEY,
        original_text TEXT NOT NULL,
        corrected_text TEXT NOT NULL,
        explanation TEXT NOT NULL,
        context TEXT,
        timestamp TEXT NOT NULL
      )
    `);
  }

  async save(log: EnglishStudyLog): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO study_logs (id, original_text, corrected_text, explanation, context, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      log.id,
      log.original_text,
      log.corrected_text,
      log.explanation,
      log.context ?? null,
      log.timestamp
    );
  }
}
