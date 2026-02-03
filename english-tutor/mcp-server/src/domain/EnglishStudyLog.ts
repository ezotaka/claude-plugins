export interface EnglishStudyLog {
  id: string;
  original_text: string;
  corrected_text: string;
  explanation: string;
  context?: string;
  timestamp: string; // ISO 8601
}
