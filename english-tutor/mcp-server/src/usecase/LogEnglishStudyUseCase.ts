import { EnglishStudyLog } from "../domain/EnglishStudyLog.js";
import { IEnglishStudyLogRepository } from "../domain/IEnglishStudyLogRepository.js";
import { v4 as uuidv4 } from "uuid";

export class LogEnglishStudyUseCase {
  constructor(private repository: IEnglishStudyLogRepository) {}

  async execute(input: {
    original_text: string;
    corrected_text: string;
    explanation: string;
    context?: string;
  }): Promise<EnglishStudyLog> {
    const log: EnglishStudyLog = {
      id: uuidv4(),
      original_text: input.original_text,
      corrected_text: input.corrected_text,
      explanation: input.explanation,
      context: input.context,
      timestamp: new Date().toISOString(),
    };

    await this.repository.save(log);
    return log;
  }
}
