import { EnglishStudyLog } from "./EnglishStudyLog.js";

export interface IEnglishStudyLogRepository {
  save(log: EnglishStudyLog): Promise<void>;
  // Future methods can be added here
}
